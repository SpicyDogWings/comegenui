#!/usr/bin/env node
// scripts/component-map.mjs — kebab → SFC `.vue`, sin depender de vue-component-meta.
//
// Reusa el mismo criterio que `gen-api.mjs` (entry de `src/lib` → `.ce.vue` → su
// `.vue`; más los componentes sólo Vue) para mapear cada ficha a su componente.
import { readFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { readdirSync, statSync } from "node:fs";

export const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

const kebab = (s) => s.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();

function walk(dir, ext) {
  const found = [];
  for (const entry of readdirSync(dir)) {
    const full = resolve(dir, entry);
    if (statSync(full).isDirectory()) found.push(...walk(full, ext));
    else if (entry.endsWith(ext)) found.push(full);
  }
  return found;
}

/** kebab → ruta relativa del `.vue` (con `/` normalizado). */
export function componentMap() {
  const out = new Map();
  const lib = resolve(ROOT, "src/lib");

  if (existsSync(lib)) {
    for (const file of walk(lib, ".ts")) {
      const src = readFileSync(file, "utf-8");
      const sfc =
        src.match(/from\s+['"]@\/(components\/[^'"]+\.ce\.vue)['"]/)?.[1] ??
        src.match(/from\s+['"]@\/(components\/[^'"]+\.vue)['"]/)?.[1];
      if (!sfc || sfc.includes("legacy/")) continue;
      const name = sfc.split("/").pop().replace(/\.ce\.vue$|\.vue$/, "");
      const vue = `src/${sfc
        .replace("components/customElements/", "components/")
        .replace(/\.ce\.vue$/, ".vue")}`;
      out.set(kebab(name), vue);
    }
  }

  // Sólo componentes públicos: categorías documentadas (sin icons/lab/legacy).
  const dirs = [
    "src/components/buttons",
    "src/components/controls",
    "src/components/data",
    "src/components/form",
    "src/components/information",
    "src/components/markdown",
    "src/components/navigation",
    "src/components/overlay",
    "src/components/theme",
  ];
  for (const dir of dirs) {
    const abs = resolve(ROOT, dir);
    if (!existsSync(abs)) continue;
    for (const file of walk(abs, ".vue")) {
      if (file.endsWith(".ce.vue")) continue;
      const rel = file.replace(ROOT + "/", "");
      const name = kebab(file.split("/").pop().replace(/\.vue$/, ""));
      if (!out.has(name)) out.set(name, rel);
    }
  }
  return out;
}

/** Fichas Vue (kebab) que tienen un componente mapeado. */
export function fichasWithComponent() {
  const map = componentMap();
  return [...map.entries()]
    .map(([kebabName, vue]) => ({ kebab: kebabName, vue }))
    .sort((a, b) => a.kebab.localeCompare(b.kebab));
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const only = process.argv.slice(2).filter((a) => !a.startsWith("-"));
  for (const { kebab: name, vue } of fichasWithComponent()) {
    if (only.length && !only.includes(name)) continue;
    console.log(`${name}\t${vue}`);
  }
}
