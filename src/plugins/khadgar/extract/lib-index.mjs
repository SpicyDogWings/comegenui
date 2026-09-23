// src/plugins/khadgar/extract/lib-index.mjs — Índice de la lib UMD.
//
// Mapea cada `.vue` público a su tag de custom element, leyendo los entry
// points de `libDir` (`customElements.define('cu-x', ...)` + el `.vue` importado).
import { readFileSync } from "node:fs";
import { basename, dirname, resolve } from "node:path";
import fg from "fast-glob";

const EXCLUDE = ["**/index.ts", "**/tokens.ts", "**/colors.ts"];
const VUE_IMPORT = /import\s+[\w$]+\s+from\s+["']([^"']+\.vue)["']/g;
const TAG_DEFINE = /customElements\.define\(\s*["']([\w-]+)["']/;

/** Resuelve un import (`@/x` o relativo) a ruta absoluta. */
function resolveImport(root, fromFile, spec) {
  if (spec.startsWith("@/")) return resolve(root, "src", spec.slice(2));
  if (spec.startsWith(".")) return resolve(dirname(fromFile), spec);
  return null;
}

/** Specs de todos los `.vue` importados en un fuente. */
function vueImports(src) {
  return [...src.matchAll(VUE_IMPORT)].map((match) => match[1]);
}

/**
 * Elige el import del componente propio: el que coincide con el basename
 * (`Table.ce.vue` → `Table.vue`), o el primero si ninguno coincide.
 */
function pickVueImport(src, base) {
  const imports = vueImports(src);
  return imports.find((spec) => basename(spec) === `${base}.vue`) ?? imports[0] ?? null;
}

/**
 * Entradas de la lib: `tag → { sfc, vue }`, donde `sfc` es el SFC que
 * distribuye el entry (`.ce.vue` o `.vue`) y `vue` el componente real.
 *
 * @param {string} root raíz del proyecto.
 * @param {string} [libDir] dir de entry points. Default: `src/lib`.
 * @returns {Map<string, { tag: string, sfc: string, vue: string }>}
 */
export function buildLibTargets(root, libDir = "src/lib") {
  const map = new Map();
  const files = fg.sync(`${libDir}/**/*.ts`, { cwd: root, absolute: true, ignore: EXCLUDE });
  for (const file of files) {
    const src = readFileSync(file, "utf-8");
    const tag = src.match(TAG_DEFINE)?.[1];
    const imp = vueImports(src)[0];
    if (!tag || !imp) continue;
    const sfc = resolveImport(root, file, imp);
    if (!sfc) continue;

    let vue = sfc;
    // Los entry points suelen importar el wrapper `.ce.vue`; el componente real
    // es el `.vue` que ese wrapper importa (mismo basename sin `.ce`).
    if (imp.endsWith(".ce.vue")) {
      const base = basename(sfc).replace(/\.ce\.vue$/, "");
      const inner = pickVueImport(readFileSync(sfc, "utf-8"), base);
      if (inner) vue = resolveImport(root, sfc, inner);
    }
    map.set(tag, { tag, sfc, vue });
  }
  return map;
}

/**
 * Índice `.vue` (absoluto) → tag (`cu-x`).
 *
 * @param {string} root raíz del proyecto.
 * @param {string} [libDir] dir de entry points. Default: `src/lib`.
 * @returns {Map<string, string>}
 */
export function buildLibIndex(root, libDir = "src/lib") {
  const map = new Map();
  for (const target of buildLibTargets(root, libDir).values()) map.set(target.vue, target.tag);
  return map;
}

/** Invierte el índice: tag → `.vue` absoluto. */
export function invertLibIndex(libIndex) {
  const map = new Map();
  for (const [file, tag] of libIndex) map.set(tag, file);
  return map;
}
