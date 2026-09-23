// tools/seed-jsdoc.mjs — Siembra la documentación de los sidecars
// (`cu-*.doc.json`) hacia los SFC que distribuye la lib:
//   - props: JSDoc antes de cada prop del `defineProps`.
//   - slots: comentario HTML antes de cada `<slot>`.
//   - exposed: JSDoc antes de cada función/const expuesta.
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

/** Mapa nombre → descripción, salteando entradas sin descripción. */
function descriptionsOf(map) {
  const out = {};
  for (const [name, entry] of Object.entries(map ?? {})) {
    const description = descriptionOf(entry);
    if (description) out[name] = description;
  }
  return out;
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

/** Inserta `/** … *​/` antes de cada prop de primer nivel del `defineProps`. */
function seedProps(source, descriptions) {
  const match = /defineProps\s*\(\s*\{/.exec(source);
  if (!match) return { source, seeded: 0 };
  const open = source.indexOf("{", match.index + match[0].length - 1);
  const close = matchBrace(source, open);
  if (close < 0) return { source, seeded: 0 };

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

/** Inserta `<!-- … -->` antes de cada `<slot>`. */
function seedSlots(source, descriptions) {
  const out = [];
  let seeded = 0;
  for (const line of source.split("\n")) {
    const match = /^(\s*)<slot\b([^>]*)>/.exec(line);
    if (match) {
      const name = /\bname\s*=\s*["']([\w-]+)["']/.exec(match[2])?.[1] ?? "default";
      const description = descriptions[name];
      const previous = out.length ? out[out.length - 1].trim() : "";
      if (description && !previous.endsWith("-->")) {
        out.push(`${match[1]}<!-- ${description} -->`);
        seeded++;
      }
    }
    out.push(line);
  }
  return { source: out.join("\n"), seeded };
}

/** Inserta `/** … *​/` antes de cada función/const expuesta. */
function seedExposes(source, descriptions) {
  const out = [];
  let seeded = 0;
  for (const line of source.split("\n")) {
    const match = /^(\s*)(?:export\s+)?(?:async\s+)?(?:function\s+|const\s+|let\s+|var\s+)([A-Za-z_$][\w$]*)\s*[=(]/.exec(
      line,
    );
    if (match && descriptions[match[2]]) {
      const previous = out.length ? out[out.length - 1].trim() : "";
      if (!previous.endsWith("*/")) {
        out.push(`${match[1]}/** ${descriptions[match[2]]} */`);
        seeded++;
      }
    }
    out.push(line);
  }
  return { source: out.join("\n"), seeded };
}

let totalProps = 0;
let totalSlots = 0;
let totalExposes = 0;
for (const target of targets) {
  let sidecar = null;
  try {
    sidecar = JSON.parse(readFileSync(resolve(docsDir, `${target.tag}.doc.json`), "utf-8"));
  } catch {
    continue;
  }
  const props = descriptionsOf(sidecar.props);
  const slots = descriptionsOf(sidecar.slots);
  const exposes = descriptionsOf(sidecar.exposes);

  const original = readFileSync(target.sfc, "utf-8");
  let source = original;
  let a = { seeded: 0 };
  let b = { seeded: 0 };
  let c = { seeded: 0 };
  if (Object.keys(props).length) {
    a = seedProps(source, props);
    source = a.source;
  }
  if (Object.keys(slots).length) {
    b = seedSlots(source, slots);
    source = b.source;
  }
  if (Object.keys(exposes).length) {
    c = seedExposes(source, exposes);
    source = c.source;
  }

  if (a.seeded || b.seeded || c.seeded) {
    totalProps += a.seeded;
    totalSlots += b.seeded;
    totalExposes += c.seeded;
    console.log(
      `${dry ? "[dry] " : ""}${target.tag}: props ${a.seeded}, slots ${b.seeded}, exposed ${c.seeded}`,
    );
    if (!dry && source !== original) writeFileSync(target.sfc, source);
  }
}
console.log(
  `${dry ? "[dry] " : ""}total: props ${totalProps}, slots ${totalSlots}, exposed ${totalExposes}`,
);
