#!/usr/bin/env node
// scripts/docs-versions.mjs — Compone y agrega las versiones de la documentación.
//
// Modelo: **un sitio estático por versión** (no hay swap en runtime). La doc es la fuente y está
// versionada con overlay (ver `docs/notes/13-doc-versionada.md`): acá **no** se reconstruye desde el
// tag. Se resuelve el árbol de cada versión (`doc-tree`), se materializa para el sitio (`docs-compose`)
// y se buildea una vez por versión. Nada de `git worktree` ni `pnpm install`.
//
// Cada versión usa **su** lib: los demos vanilla consumen `@comegen-shared`, que acá se apunta a la
// lib versionada de esa versión (`docs/versiones/<id>/lib`, congelada por `docs-freeze`) cuando
// existe; si no, al build actual (`dist-libs/esm-shared`). Ver la opción `COMEGEN_SHARED_DIR` en
// `docs/site/.vitepress/config.ts`.
//
// Salida agregada:
//
//   <out>/                 ← latest en `/` (alias de back-compat, base `/`)
//   <out>/5.1.1/           ← latest canónico (base `/5.1.1/`)
//   <out>/5.0.0/           ← versión congelada (base `/5.0.0/`)
//   <out>/versions.json    ← catálogo que lee el select del topbar
//
// Uso:
//   node scripts/docs-versions.mjs [--out <dir>] [--only id,id] [--list] [--force] [--no-root-alias]
//
// Reconstruye sólo lo que falta (una versión cuyo `<out>/<id>/index.html` ya existe se saltea) salvo
// `--force`. `--only id` limita a esas versiones. No borra la carpeta de salida entera: sólo rehace
// lo que corresponde.
import { execFileSync } from "node:child_process";
import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { compose } from "./docs-compose.mjs";
import { latestId } from "./doc-tree.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const manifestPath = resolve(root, "docs/versions.json");

// /tmp/opencode es el temporal aprobado por el entorno (el alias raíz se buildea ahí).
const tmpBase = process.env.DOCS_VERSIONS_TMP ?? "/tmp/opencode";

const c = {
  dim: (s) => `\x1b[2m${s}\x1b[0m`,
  bold: (s) => `\x1b[1m${s}\x1b[0m`,
  green: (s) => `\x1b[32m${s}\x1b[0m`,
  red: (s) => `\x1b[31m${s}\x1b[0m`,
  yellow: (s) => `\x1b[33m${s}\x1b[0m`,
};

function log(message) {
  console.log(`${c.dim("[docs-versions]")} ${message}`);
}

function fail(message) {
  console.error(`${c.red("[docs-versions]")} ${message}`);
  process.exit(1);
}

function run(cmd, args, { env = {} } = {}) {
  execFileSync(cmd, args, { cwd: root, env: { ...process.env, ...env }, stdio: "inherit" });
}

// ---------------------------------------------------------------------------
// Argumentos
// ---------------------------------------------------------------------------
const argv = process.argv.slice(2);
const opts = { out: "docs/site/.vitepress/dist-versions", only: null, list: false, rootAlias: null, force: false };
for (let i = 0; i < argv.length; i++) {
  const arg = argv[i];
  if (arg === "--out") opts.out = argv[++i];
  else if (arg === "--only") opts.only = (argv[++i] ?? "").split(",").map((s) => s.trim()).filter(Boolean);
  else if (arg === "--list") opts.list = true;
  else if (arg === "--no-root-alias") opts.rootAlias = false;
  else if (arg === "--force") opts.force = true;
  else if (arg === "--help" || arg === "-h") {
    console.log(
      [
        "node scripts/docs-versions.mjs [opciones]",
        "",
        "  --out <dir>       destino agregado (default docs/site/.vitepress/dist-versions)",
        "  --only id,id      compone y buildea sólo esas versiones",
        "  --list            muestra el manifiesto y sale",
        "  --force           rehace las versiones cuyo output ya existe",
        "  --no-root-alias   no deja la copia de latest en / (sólo /<id>/)",
      ].join("\n"),
    );
    process.exit(0);
  } else {
    fail(`opción desconocida: ${arg}`);
  }
}

// ---------------------------------------------------------------------------
// Manifiesto
// ---------------------------------------------------------------------------
if (!existsSync(manifestPath)) fail(`no existe ${relative(root, manifestPath)}`);
const manifest = JSON.parse(readFileSync(manifestPath, "utf-8"));
const all = Array.isArray(manifest.versions) ? manifest.versions : [];
if (all.length === 0) fail("el manifiesto no tiene versiones");

const latestEntries = all.filter((v) => v.latest);
if (latestEntries.length !== 1) fail(`debe haber exactamente una versión 'latest' (hay ${latestEntries.length})`);
for (const v of all) {
  if (!v.id || !v.ref) fail(`versión inválida en el manifiesto: ${JSON.stringify(v)}`);
  if (v.id.includes("/")) fail(`el id '${v.id}' no puede contener '/'`);
}

/** Base canónica de una versión: siempre `/<id>/` (estable entre releases). */
const baseOf = (v) => `/${v.id}/`;
/** Además de `/<id>/`, latest se copia en `/` para no romper las URLs históricas. */
const rootAlias = opts.rootAlias ?? manifest.rootAlias !== false;

if (opts.list) {
  for (const v of all) {
    const alias = v.latest && rootAlias ? " + /" : "";
    log(`${v.latest ? "★" : " "} ${c.bold(v.id)}  ${v.label}  ${c.dim(`${v.ref} → ${baseOf(v)}${alias}`)}`);
  }
  process.exit(0);
}

const selected = opts.only ? all.filter((v) => opts.only.includes(v.id)) : all;
if (opts.only) {
  const unknown = opts.only.filter((id) => !all.some((v) => v.id === id));
  if (unknown.length) fail(`--only: versiones desconocidas en el manifiesto: ${unknown.join(", ")}`);
}

const outDir = resolve(root, opts.out);
// Sólo se escribe en un destino que parece de build (dentro de .vitepress o con el nombre por
// defecto), salvo --force: evita pisar una carpeta ajena.
if (existsSync(outDir) && !opts.force) {
  const looksLikeBuild = outDir.includes(".vitepress") || /dist-versions$/.test(outDir);
  if (!looksLikeBuild) fail(`--out ${outDir} no parece un directorio de build; usá --force si estás seguro`);
}
mkdirSync(outDir, { recursive: true });

// ---------------------------------------------------------------------------
// Rutas del sitio construido
// ---------------------------------------------------------------------------
/** Rutas navegables de un build (`<dir>/**.html` → `/componentes/cu-input`). */
function collectRoutes(dir) {
  const routes = new Set();
  const walk = (d) => {
    for (const entry of readdirSync(d, { withFileTypes: true })) {
      const full = join(d, entry.name);
      if (entry.isDirectory()) {
        walk(full);
        continue;
      }
      if (!entry.name.endsWith(".html") || entry.name === "404.html") continue;
      const rel = relative(dir, full)
        .split(/[\\/]/)
        .join("/")
        .replace(/\.html$/, "")
        .replace(/(^|\/)index$/, "$1");
      routes.add(rel ? `/${rel}` : "/");
    }
  };
  if (existsSync(dir)) walk(dir);
  return [...routes].sort();
}

// ---------------------------------------------------------------------------
// Preparación: lib (para los demos) y tema, una sola vez
// ---------------------------------------------------------------------------
// Con --only se rehace siempre lo pedido; sin --only, se saltea lo que ya está (salvo --force).
const needsBuild = (v) => opts.force || opts.only || !existsSync(join(outDir, v.id, "index.html"));
const pending = selected.filter(needsBuild);
const latest = all.find((v) => v.latest);
const aliasExists = existsSync(join(outDir, "index.html"));
const needAlias = rootAlias && (opts.force || !aliasExists || pending.some((v) => v.latest));

/**
 * Directorio de la lib `esm-shared` de una versión (relativo a la raíz del repo), o `null`.
 * Si la versión lo congeló (`docs/versiones/<id>/lib/`, versionado), se usa; si no, `null` para
 * que `config.ts` caiga al build actual (`dist-libs/esm-shared`).
 */
function sharedDirFor(id) {
  return existsSync(resolve(root, "docs/versiones", id, "lib")) ? `docs/versiones/${id}/lib` : null;
}

/** Buildea el sitio con `base` y `out` dados, sobre el árbol compuesto que haya en disco. */
function buildSite({ base, id, label, out }) {
  const sharedDir = sharedDirFor(id);
  run("pnpm", ["exec", "vitepress", "build", "docs/site", `--base=${base}`, `--outDir=${out}`], {
    env: {
      DOCS_BASE: base,
      DOCS_VERSION_ID: id,
      DOCS_VERSION_LABEL: label,
      // Sin lib versionada, `config.ts` cae al build actual (`dist-libs/esm-shared`).
      ...(sharedDir ? { COMEGEN_SHARED_DIR: sharedDir } : {}),
    },
  });
}

if (pending.length === 0 && !needAlias) {
  log(`${c.bold("Nada para construir")} — todo presente (usá --force para rehacer)`);
} else {
  // La lib actual sólo hace falta como fallback de alguna versión sin lib versionada.
  const needFallback = pending.some((v) => !sharedDirFor(v.id)) || (needAlias && !sharedDirFor(latest.id));
  log(`${c.bold("Preparando")} — ${needFallback ? "lib (esm-shared) + " : ""}tema de VitePress`);
  if (needFallback) run("pnpm", ["build:docs:lib"]);
  run("pnpm", ["site:sync"]);
}

// ---------------------------------------------------------------------------
// Build por versión (componiendo su árbol resuelto antes de cada una)
// ---------------------------------------------------------------------------
log(`${c.bold("Construyendo")} ${pending.length} versión(es) → ${relative(root, outDir)}`);
for (const version of pending) {
  const { id, label } = version;
  const out = resolve(outDir, id);
  const sharedDir = sharedDirFor(id);
  log(
    `${c.bold(id)} ${c.dim(`→ ${baseOf(version)}`)} ${c.dim(`· lib: ${sharedDir ?? "dist-libs/esm-shared (fallback)"}`)}`,
  );
  compose(id);
  buildSite({ base: baseOf(version), id, label, out });
  log(`  ${c.green("✓")} ${collectRoutes(out).length} rutas`);
}

// ---------------------------------------------------------------------------
// Alias raíz (`/` = latest): en un temporal y se copia sobre <out>/
// ---------------------------------------------------------------------------
// VitePress **vacía su outDir**: por eso el alias no se buildea directo en `<out>/` (se llevaría
// las carpetas de versión). Se construye aparte y se copia encima.
if (needAlias) {
  log(`${c.bold("alias /")} ${c.dim(`copia de ${latest.id}`)}`);
  mkdirSync(tmpBase, { recursive: true });
  const tmp = mkdtempSync(join(tmpBase, "docs-versions-root-"));
  try {
    compose(latest.id);
    buildSite({ base: "/", id: latest.id, label: latest.label, out: tmp });
    cpSync(tmp, outDir, { recursive: true });
  } finally {
    rmSync(tmp, { recursive: true, force: true });
  }
}

// ---------------------------------------------------------------------------
// Catálogo (lo lee DocsVersionSelect en runtime): todas las versiones **presentes**
// ---------------------------------------------------------------------------
const present = all.filter((v) => existsSync(join(outDir, v.id, "index.html")));
const catalog = {
  generatedAt: new Date().toISOString(),
  rootAlias: rootAlias && existsSync(join(outDir, "index.html")),
  versions: present.map((v) => ({
    id: v.id,
    label: v.label,
    base: baseOf(v),
    latest: !!v.latest,
    routes: collectRoutes(join(outDir, v.id)),
  })),
};

const catalogJson = `${JSON.stringify(catalog, null, 2)}\n`;
// En la raíz (lo fetcha el alias `/`) y en cada versión (lo fetcha `/<id>/`).
writeFileSync(join(outDir, "versions.json"), catalogJson);
for (const v of present) writeFileSync(join(outDir, v.id, "versions.json"), catalogJson);
log(`${c.green("✓")} catálogo: ${present.length} versión(es) — ${c.dim(relative(root, join(outDir, "versions.json")))}`);

// ---------------------------------------------------------------------------
// Dejar el árbol compuesto apuntando a latest (como estaba)
// ---------------------------------------------------------------------------
compose(latestId());

log(`${c.bold(c.green("listo"))} — serví ${c.dim(relative(root, outDir))} como sitio estático`);
for (const v of catalog.versions) {
  log(`  ${v.latest ? "★ latest" : `  ${v.id}   `}  ${v.base}`);
}
if (catalog.rootAlias) log(`    alias    /  ${c.dim("(copia de latest, sin versión)")}`);
