#!/usr/bin/env node
// scripts/check-docs.mjs — Gate de documentación (mínimo). Sin extracción.
//
// Valida sólo estructura:
//   1. cada tag de `src/lib/**/*.ts` tiene ficha vanilla (`docs/componentes/<tag>.md`),
//   2. cada componente Vue de las categorías tiene ficha Vue (`docs/componentes/vue/<kebab>.md`),
//   3. cada página del sitio incluye una ficha que existe (y sus includes anidados resuelven),
//   4. cada ficha la incluye exactamente una página.
//
// NO mira contenido, cabeceras, demos ni descripciones: eso es a mano (skill `documenter`).
// Las tablas de API las valida contra el SFC `scripts/gen-api.mjs --check`.
//
// Uso: node scripts/check-docs.mjs
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { dirname, resolve, relative } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const LIB_DIR = resolve(root, "src/lib");
const FICHA_DIR = resolve(root, "docs/componentes");
const FICHA_VUE_DIR = resolve(FICHA_DIR, "vue");
const SITE_DIR = resolve(root, "docs/site/componentes");

// Tags que definen un custom element pero no se documentan.
const IGNORED_TAGS = new Set([]);
// Componentes sin custom element que NO se documentan (experimentales/internos).
const UNDOCUMENTED_VUE = new Set(["lab/collapse/navigation/Outline"]);

/** Todos los archivos con `ext` bajo `dir` (recursivo, sin dependencias). */
function walk(dir, ext) {
  const found = [];
  for (const entry of readdirSync(dir)) {
    const full = resolve(dir, entry);
    if (statSync(full).isDirectory()) found.push(...walk(full, ext));
    else if (entry.endsWith(ext)) found.push(full);
  }
  return found;
}

/** Tags de custom element definidos en las entradas de la lib. */
function definedTags() {
  const tags = new Set();
  const tagRE = /(?:customElements\.define|defineComegenElement)\(\s*["']([^"']+)["']/g;
  for (const file of walk(LIB_DIR, ".ts")) {
    const base = file.split("/").pop();
    if (base === "index.ts" || base === "tokens.ts") continue;
    for (const match of readFileSync(file, "utf-8").matchAll(tagRE)) tags.add(match[1]);
  }
  return tags;
}

/** Slugs (sin extensión) de los `.md` de un directorio. */
function slugs(dir) {
  return readdirSync(dir)
    .filter((file) => file.endsWith(".md"))
    .map((file) => file.slice(0, -3));
}

/**
 * Slugs de las páginas del sitio, recursivo: las de Vue viven en
 * `docs/site/componentes/vue/`, así que el slug puede llevar `/`.
 */
function pageSlugs() {
  return walk(SITE_DIR, ".md").map((file) =>
    relative(SITE_DIR, file).replace(/\.md$/, "").replaceAll("\\", "/"),
  );
}

const problems = [];
const rel = (p) => relative(root, p);
const kebab = (s) => s.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();

const vanillaFichas = slugs(FICHA_DIR).filter((s) => s !== "README");
const vueFichas = existsSync(FICHA_VUE_DIR) ? slugs(FICHA_VUE_DIR) : [];

// ── componentes Vue ↔ ficha Vue ──────────────────────────────────────────────
const VUE_CATEGORIES = ["buttons", "controls", "data", "form", "information", "markdown", "navigation", "overlay", "theme"];
function documentedVueComponents() {
  const found = new Map(); // kebab → ruta relativa (para el mensaje)
  for (const category of VUE_CATEGORIES) {
    const dir = resolve(root, "src/components", category);
    if (!existsSync(dir)) continue;
    for (const file of walk(dir, ".vue")) {
      if (file.endsWith(".ce.vue")) continue;
      const slug = relative(resolve(root, "src/components"), file).replace(/\.vue$/, "").replaceAll("\\", "/");
      if (UNDOCUMENTED_VUE.has(slug)) continue;
      const base = file.split("/").pop().replace(/\.vue$/, "");
      found.set(kebab(base), `src/components/${slug}.vue`);
    }
  }
  return found;
}
for (const [name, file] of documentedVueComponents()) {
  if (!vueFichas.includes(name)) problems.push(`componente Vue ${file}: falta docs/componentes/vue/${name}.md`);
}

// ── includes: la página incluye la ficha; la ficha puede incluir partials ─────
// VitePress no falla con un `@include` roto (devuelve el texto crudo), así que lo
// validamos acá, recursivo.
const includeRE = /<!--@include:\s*(\S+?)\s*-->/g;
function checkIncludes(file, seen = new Set()) {
  if (seen.has(file) || !existsSync(file)) return;
  seen.add(file);
  for (const match of readFileSync(file, "utf-8").matchAll(includeRE)) {
    const target = resolve(dirname(file), match[1]);
    if (!existsSync(target)) {
      problems.push(`${rel(file)}: @include roto → ${match[1]}`);
      continue;
    }
    checkIncludes(target, seen);
  }
}

// ── páginas: frontmatter + include de una ficha ──────────────────────────────
const pages = pageSlugs();
const includedBy = new Map(); // ruta de ficha → cantidad de páginas que la incluyen
for (const page of pages) {
  const file = resolve(SITE_DIR, `${page}.md`);
  const source = readFileSync(file, "utf-8");

  const include = /<!--@include:\s*(\S+?)\s*-->/.exec(source);
  if (!include) {
    problems.push(`página ${page}.md: sin @include de una ficha`);
    continue;
  }
  const target = resolve(dirname(file), include[1]);
  if (!existsSync(target)) {
    problems.push(`página ${page}.md: @include roto → ${include[1]}`);
    continue;
  }
  includedBy.set(target, (includedBy.get(target) ?? 0) + 1);
  checkIncludes(target);
}

// cada ficha la incluye exactamente una página
for (const slug of vanillaFichas) {
  const file = resolve(FICHA_DIR, `${slug}.md`);
  if (!includedBy.get(file)) problems.push(`ficha ${rel(file)}: ninguna página la incluye`);
}
for (const kebab of vueFichas) {
  const file = resolve(FICHA_VUE_DIR, `${kebab}.md`);
  if (!includedBy.get(file)) problems.push(`ficha ${rel(file)}: ninguna página la incluye`);
}
for (const [file, count] of includedBy) {
  if (count > 1) problems.push(`ficha ${rel(file)}: incluida por ${count} páginas`);
}

// ── tags ↔ ficha vanilla ─────────────────────────────────────────────────────
const tags = definedTags();
for (const tag of [...tags].sort()) {
  if (IGNORED_TAGS.has(tag)) continue;
  const ficha = resolve(FICHA_DIR, `${tag}.md`);
  if (!existsSync(ficha)) problems.push(`tag ${tag}: falta ${relative(root, ficha)}`);
}

if (problems.length) {
  console.error(`check-docs: ${problems.length} problema(s)`);
  for (const problem of problems) console.error(`  ✗ ${problem}`);
  process.exit(1);
}
console.log(
  `check-docs: ok — ${tags.size} tag(s), ${vanillaFichas.length} ficha(s) vanilla, ` +
    `${vueFichas.length} ficha(s) Vue, ${pages.length} página(s)`,
);
