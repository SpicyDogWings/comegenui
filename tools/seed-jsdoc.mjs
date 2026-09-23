// tools/seed-jsdoc.mjs — Siembra el JSDoc de las props desde los sidecars
// (`cu-*.doc.json`) hacia los SFC que distribuye la lib.
//
// Uso:
//   node tools/seed-jsdoc.mjs --dry   # muestra qué cambiaría
//   node tools/seed-jsdoc.mjs         # escribe
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { buildLibTargets } from "../src/plugins/khadgar/extract/lib-index.mjs";

const dry = process.argv.includes("--dry");
const root = process.cwd();
const config = JSON.parse(readFileSync(resolve(root, "khadgar.config.json"), "utf-8"));
const docsDir = resolve(root, config.docsDir ?? "docs/skills/use-comegen", "componentes");
const targets = [...buildLibTargets(root, config.libDir ?? "src/lib").values()];

/** Descripción de una entrada del sidecar (string u objeto). */
function descriptionOf(entry) {
  if (entry == null) return null;
  const value = typeof entry === "string" ? entry : entry.description;
  return value ? String(value).replace(/\s+/g, " ").replace(/\*\//g, "*\\/").trim() : null;
}

/** Offset del `}` que cierra el `{` en `open`. */
function matchBrace(source, open) {
  let depth = 0;
  for (let i = open; i < source.length; i++) {
    const char = source[i];
    if (char === "{") depth++;
    else if (char === "}") {
      depth--;
      if (depth === 0) return i;
    }
  }
  return -1;
}

/** Inserta `/** … *​/` antes de cada prop del `defineProps({...})`. */
function seedProps(source, descriptions) {
  const match = /defineProps\s*\(\s*\{/.exec(source);
  if (!match) return { source, seeded: 0 };
  const open = source.indexOf("{", match.index + match[0].length - 1);
  const close = matchBrace(source, open);
  if (close < 0) return { source, seeded: 0 };

  // Solo props de primer nivel (profundidad 0 dentro del objeto), no los
  // `type:`/`default:` anidados de cada prop.
  const lines = source.slice(open + 1, close).split("\n");
  const out = [];
  let depth = 0;
  let seeded = 0;
  for (const line of lines) {
    const prop = depth === 0 ? /^(\s*)([A-Za-z_$][\w$]*)\s*:/.exec(line) : null;
    if (prop && descriptions[prop[2]]) {
      const previous = out.length ? out[out.length - 1].trim() : "";
      if (!previous.endsWith("*/")) {
        out.push(`${prop[1]}/** ${descriptions[prop[2]]} */`);
        seeded++;
      }
    }
    out.push(line);
    depth += (line.match(/\{/g)?.length ?? 0) - (line.match(/\}/g)?.length ?? 0);
  }
  return { source: `${source.slice(0, open)}{${out.join("\n")}}${source.slice(close + 1)}`, seeded };
}

let total = 0;
for (const target of targets) {
  let sidecar = null;
  try {
    sidecar = JSON.parse(readFileSync(resolve(docsDir, `${target.tag}.doc.json`), "utf-8"));
  } catch {
    continue;
  }
  const descriptions = {};
  for (const [name, entry] of Object.entries(sidecar.props ?? {})) {
    const description = descriptionOf(entry);
    if (description) descriptions[name] = description;
  }
  if (!Object.keys(descriptions).length) continue;

  const source = readFileSync(target.sfc, "utf-8");
  const { source: next, seeded } = seedProps(source, descriptions);
  if (seeded) {
    total += seeded;
    console.log(`${dry ? "[dry] " : ""}${target.tag}: ${seeded} props`);
    if (!dry) writeFileSync(target.sfc, next);
  }
}
console.log(`${dry ? "[dry] " : ""}total: ${total} props`);
