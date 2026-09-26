#!/usr/bin/env node
// scripts/check-docs.mjs — Gate de documentación. Sin extracción: sólo verifica
// la consistencia entre las entradas de la lib y las fichas/páginas escritas a
// mano.
//
//   1. cada tag de `src/lib/**/*.ts` tiene página en el sitio y ficha en la skill,
//   2. cada ficha de la skill tiene su página en el sitio,
//   3. cada página declara `title` y `group` en el frontmatter.
//
// Uso: node scripts/check-docs.mjs
import { readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const LIB_DIR = resolve(root, "src/lib");
const SITE_DIR = resolve(root, "docs/site/componentes");
const SKILL_DIR = resolve(root, "docs/skills/use-comegen/componentes");

// Tags que definen un custom element pero no se documentan (shim deprecado).
const IGNORED_TAGS = new Set(["cu-date-picker-range"]);

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

const tags = definedTags();
const pages = slugs(SITE_DIR);
const pageSet = new Set(pages);
const fichas = slugs(SKILL_DIR);

const problems = [];
for (const tag of [...tags].sort()) {
  if (IGNORED_TAGS.has(tag)) continue;
  if (!pageSet.has(tag)) problems.push(`tag ${tag}: falta docs/site/componentes/${tag}.md`);
  if (!fichas.includes(tag)) problems.push(`tag ${tag}: falta docs/skills/use-comegen/componentes/${tag}.md`);
}
for (const ficha of [...fichas].sort()) {
  if (!pageSet.has(ficha)) problems.push(`ficha ${ficha}: falta docs/site/componentes/${ficha}.md`);
}
for (const page of pages) {
  const source = readFileSync(resolve(SITE_DIR, `${page}.md`), "utf-8");
  const block = /^---\r?\n([\s\S]*?)\r?\n---/.exec(source);
  if (!block) {
    problems.push(`página ${page}.md: sin frontmatter`);
    continue;
  }
  if (!/^title:\s*\S/m.test(block[1])) problems.push(`página ${page}.md: sin 'title' en el frontmatter`);
  if (!/^group:\s*\S/m.test(block[1])) problems.push(`página ${page}.md: sin 'group' en el frontmatter`);
}

if (problems.length) {
  console.error(`check-docs: ${problems.length} problema(s)`);
  for (const problem of problems) console.error(`  ✗ ${problem}`);
  process.exit(1);
}
console.log(
  `check-docs: ok — ${tags.size} tag(s), ${fichas.length} ficha(s), ${pages.length} página(s)`,
);
