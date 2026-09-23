// src/plugins/khadgar-docs/cli.mjs — Genera las fichas de la **skill de uso**
// (las que viajan en el zip): los componentes con `skill: true`.
//
// El render depende del caso: vanilla/UMD si el componente tiene custom element,
// Vue si no. La ficha Vue del sitio (todos) y la vanilla (custom elements) las
// produce `site.mjs`.
//
// Uso:
//   node src/plugins/khadgar-docs/cli.mjs              # escribe todas las fichas
//   node src/plugins/khadgar-docs/cli.mjs --check      # falla si hay drift
//   node src/plugins/khadgar-docs/cli.mjs --only Alert,Button
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { buildIndex } from "../khadgar/extract/index.mjs";
import { renderDoc } from "./render.mjs";

function parseArgs(argv) {
  const args = { check: false, only: null, config: null };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--check") args.check = true;
    else if (arg === "--only") args.only = argv[++i];
    else if (arg === "--config") args.config = argv[++i];
    else if (arg === "--help" || arg === "-h") {
      console.log("khadgar-docs [--check] [--only A,B] [--config <file>]");
      process.exit(0);
    }
  }
  return args;
}

const args = parseArgs(process.argv.slice(2));
const root = process.cwd();
const configPath = resolve(root, args.config ?? "khadgar.config.json");
const config = existsSync(configPath) ? JSON.parse(readFileSync(configPath, "utf-8")) : {};

if (args.only) {
  const names = new Set(args.only.split(",").map((name) => name.trim()).filter(Boolean));
  config.components = (config.components ?? []).filter((item) => names.has(item.name));
}

const index = buildIndex({ root, config });
const docs = index.components.filter((component) => component.skill);
const docsDir = resolve(root, config.docsDir ?? "docs/skills/use-comegen", "componentes");
const drift = [];
let written = 0;

for (const component of docs) {
  const markdown = renderDoc(component, {
    mode: component.customElement ? "vanilla" : "vue",
  });
  const file = resolve(docsDir, `${component.tag ?? component.slug}.md`);
  if (args.check) {
    const current = existsSync(file) ? readFileSync(file, "utf-8") : null;
    if (current !== markdown) drift.push(component.tag ?? component.slug);
  } else {
    mkdirSync(docsDir, { recursive: true });
    writeFileSync(file, markdown);
    written++;
  }
}

if (args.check) {
  if (drift.length) {
    console.error(`khadgar-docs: ${drift.length} ficha(s) desactualizada(s): ${drift.join(", ")}`);
    process.exit(1);
  }
  console.log(`khadgar-docs: ${docs.length} fichas ok`);
} else {
  console.log(`khadgar-docs: ${written} ficha(s) escritas en ${docsDir}`);
}
