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
import { readFileSync, readdirSync, statSync, existsSync, writeFileSync } from "node:fs";
import { dirname, resolve, relative } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const LIB_DIR = resolve(root, "src/lib");
const FICHA_DIR = resolve(root, "docs/componentes");
const FICHA_VUE_DIR = resolve(FICHA_DIR, "vue");
const SITE_DIR = resolve(root, "docs/site/componentes");

// Tags que definen un custom element pero no se documentan (shim deprecado).
const IGNORED_TAGS = new Set([]);

// Componentes sin custom element que NO se documentan (experimentales/internos).
const UNDOCUMENTED_VUE = new Set(["lab/collapse/navigation/Outline"]);

// Componentes con **ficha unificada**: la API Vue vive dentro de la ficha del custom
// element (que lleva los marcadores `@api:props`/`@api:emits`/`@api:expose`) y el sitio
// tiene una sola página, con las dos APIs en tabs. No hay `docs/componentes/vue/<kebab>.md`
// ni página `vue/<kebab>`. Ver `docs/notes/10-ficha-unificada.md`.
const UNIFIED_VUE = new Set(["button"]);

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
  if (UNIFIED_VUE.has(name)) continue;
  if (!vueFichas.includes(name)) problems.push(`componente Vue ${file}: falta docs/componentes/vue/${name}.md`);
}

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

  // Toda página Vue del sitio debe traer demos en vivo (los vanilla no).
  if (page.startsWith("vue/") && !/^## Demos en vivo\s*$/m.test(source)) {
    problems.push(`página ${page}.md: sin sección "## Demos en vivo"`);
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

// ── fichas unificadas ────────────────────────────────────────────────────────
// Cada componente de `UNIFIED_VUE` tiene que tener UNA ficha vanilla con los marcadores
// de la API Vue; si no, sus tablas (props/emits/expose) se pierden en silencio.
const unifiedFichas = vanillaFichas.filter((slug) =>
  readFileSync(resolve(FICHA_DIR, `${slug}.md`), "utf-8").includes("<!-- @api:props -->"),
);
if (unifiedFichas.length !== UNIFIED_VUE.size) {
  problems.push(
    `fichas unificadas: ${unifiedFichas.length} ficha(s) con @api:props ` +
      `(${unifiedFichas.join(", ") || "ninguna"}), esperaba ${UNIFIED_VUE.size} ` +
      `(${[...UNIFIED_VUE].join(", ")})`,
  );
}
for (const kebab of UNIFIED_VUE) {
  if (vueFichas.includes(kebab)) {
    problems.push(`ficha vue/${kebab}.md: el componente es unificado (ver docs/notes/10-ficha-unificada.md)`);
  }
  if (pages.includes(`vue/${kebab}`)) {
    problems.push(`página vue/${kebab}.md: el componente es unificado (ver docs/notes/10-ficha-unificada.md)`);
  }
}

// ── descripciones vacías en las tablas de API ────────────────────────────────
// La "Descripción" de cada fila sale del JSDoc del SFC: una celda vacía es doc que se quedó
// atrás (típicamente porque el JSDoc está en el `.ce.vue` y no en el `.vue`). Se compara por
// identidad contra `scripts/docs-baseline.txt` (igual que los tipos): una ficha puede mejorar
// sin tocar el baseline, pero no empeorar.
const DOCS_BASELINE = resolve(root, "scripts/docs-baseline.txt");

function emptyDescriptions(files) {
  const counts = new Map(); // ruta relativa → celdas con descripción vacía
  for (const file of files) {
    let empty = 0;
    const source = readFileSync(file, "utf-8");
    for (const block of source.matchAll(/<!-- @api:([a-z-]+) -->([\s\S]*?)<!-- \/@api:\1 -->/g)) {
      // Los slots quedan afuera: su descripción no sale del SFC (en todo el repo es `—`).
      if (block[1].startsWith("slots")) continue;
      for (const line of block[2].split("\n")) {
        if (!/^\| `/.test(line)) continue;
        const cols = line.replace(/\|\s*$/, "").split("|").map((cell) => cell.trim());
        if (cols.length > 1 && cols[cols.length - 1] === "—") empty++;
      }
    }
    if (empty) counts.set(rel(file), empty);
  }
  return counts;
}

const allFichas = [
  ...vanillaFichas.map((slug) => resolve(FICHA_DIR, `${slug}.md`)),
  ...vueFichas.map((kebab) => resolve(FICHA_VUE_DIR, `${kebab}.md`)),
];
const emptyNow = emptyDescriptions(allFichas);

// `--update` reescribe el baseline, pero sigue validando (no se sale antes).
const UPDATE_BASELINE = process.argv.includes("--update");

if (UPDATE_BASELINE) {
  const lines = [...emptyNow].sort().map(([file, count]) => `${file}\t${count}`);
  writeFileSync(DOCS_BASELINE, `${lines.join("\n")}\n`);
  console.log(`check-docs: baseline de descripciones vacías actualizado (${emptyNow.size} ficha(s))`);
} else {
  const docsBaseline = new Map();
  if (existsSync(DOCS_BASELINE)) {
    for (const line of readFileSync(DOCS_BASELINE, "utf-8").split("\n")) {
      const [file, count] = line.split("\t");
      if (file && count) docsBaseline.set(file, Number(count));
    }
  }
  for (const [file, count] of emptyNow) {
    const allowed = docsBaseline.get(file) ?? 0;
    if (count > allowed) {
      problems.push(
        `ficha ${file}: ${count} descripción(es) vacía(s) en las tablas de API ` +
          `(baseline: ${allowed}) — el JSDoc del SFC es la fuente de la tabla`,
      );
    }
  }
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
const pendientes = [...emptyNow.values()].reduce((total, count) => total + count, 0);
console.log(
  `check-docs: ok — ${tags.size} tag(s), ${vanillaFichas.length} ficha(s) vanilla, ` +
    `${vueFichas.length} ficha(s) Vue, ${pages.length} página(s)` +
    (pendientes ? ` · pendiente: ${pendientes} descripción(es) vacía(s) en ${emptyNow.size} ficha(s)` : ""),
);
