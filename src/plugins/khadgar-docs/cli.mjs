// src/plugins/khadgar-docs/cli.mjs — Genera las fichas `.md` de la skill de uso
// a partir de `khadgar.json` (contrato + prosa curada ya mergeada).
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

let components = config.components;
if (args.only) {
  const names = new Set(args.only.split(",").map((name) => name.trim()).filter(Boolean));
  components = (config.components ?? []).filter((item) => names.has(item.name));
}

// Las fichas documentan el `.vue` real de cada entrada.
const index = buildIndex({ root, config, components });
const docsDir = resolve(root, config.docsDir ?? "docs/skills/use-comegen", "componentes");
const drift = [];
let written = 0;

for (const component of index.components) {
  if (!component.tag) continue;
  const markdown = renderDoc(component);
  const file = resolve(docsDir, `${component.tag}.md`);
  if (args.check) {
    const current = existsSync(file) ? readFileSync(file, "utf-8") : null;
    if (current !== markdown) drift.push(component.tag);
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
  console.log(`khadgar-docs: ${index.components.filter((c) => c.tag).length} fichas ok`);
} else {
  console.log(`khadgar-docs: ${written} ficha(s) escritas en ${docsDir}`);
}
