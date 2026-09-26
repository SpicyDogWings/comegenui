#!/usr/bin/env node
// scripts/check-docs.mjs — Gate de documentación. Sin extracción: valida la
// consistencia entre las entradas de la lib y las fichas/páginas a mano.
//
// Estructura:
//   docs/componentes/<tag>.md          ficha del Custom Element (vanilla)
//   docs/componentes/vue/<kebab>.md    ficha del componente Vue
//   docs/site/componentes/<slug>.md    página del sitio (frontmatter + @include)
//
// Valida:
//   1. cada tag de `src/lib/**/*.ts` tiene ficha vanilla,
//   2. cada página tiene `title`/`group` y su `@include` apunta a una ficha que existe,
//   3. cada ficha está incluida por exactamente una página,
//   4. cada ficha declara las secciones obligatorias de su tipo.
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

// Tags que definen un custom element pero no se documentan (shim deprecado).
const IGNORED_TAGS = new Set(["cu-date-picker-range"]);

// Secciones obligatorias de cada tipo de ficha.
const VANILLA_SECTIONS = ["## Atributos", "## Eventos", "## Slots", "## Métodos expuestos"];
const VUE_SECTIONS = ["## Props", "## Emits", "## Slots", "## Expose"];

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
  const tagRE = /customElements\.define\(\s*["']([^"']+)["']/g;
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

// ── fichas ───────────────────────────────────────────────────────────────────
const vanillaFichas = slugs(FICHA_DIR).filter((s) => s !== "README");
const vueFichas = existsSync(FICHA_VUE_DIR) ? slugs(FICHA_VUE_DIR) : [];

function checkFicha(file, sections) {
  if (!existsSync(file)) {
    problems.push(`ficha ${rel(file)}: falta`);
    return;
  }
  const source = readFileSync(file, "utf-8");
  for (const section of sections) {
    if (!new RegExp(`^${section}\\s*$`, "m").test(source)) {
      problems.push(`ficha ${rel(file)}: falta la sección "${section}"`);
    }
  }
}
for (const slug of vanillaFichas) checkFicha(resolve(FICHA_DIR, `${slug}.md`), VANILLA_SECTIONS);
for (const kebab of vueFichas) checkFicha(resolve(FICHA_VUE_DIR, `${kebab}.md`), VUE_SECTIONS);

// ── páginas: frontmatter + include ───────────────────────────────────────────
const pages = pageSlugs();
const includedBy = new Map(); // ruta de ficha → cantidad de páginas que la incluyen
for (const page of pages) {
  const file = resolve(SITE_DIR, `${page}.md`);
  const source = readFileSync(file, "utf-8");

  const block = /^---\r?\n([\s\S]*?)\r?\n---/.exec(source);
  if (!block) {
    problems.push(`página ${page}.md: sin frontmatter`);
  } else {
    if (!/^title:\s*\S/m.test(block[1])) problems.push(`página ${page}.md: sin 'title'`);
    if (!/^group:\s*\S/m.test(block[1])) problems.push(`página ${page}.md: sin 'group'`);
  }

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
}

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
