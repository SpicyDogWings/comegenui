#!/usr/bin/env node
// scripts/docs-versions.mjs — Construye y agrega las versiones de la documentación.
//
// Modelo: **un sitio estático por versión** (no hay swap en runtime). Cada versión
// se sirve bajo su propia base `/<id>/`; `latest` se construye desde el árbol de
// trabajo y, además, deja una copia en la raíz `/` para que las URLs sin versión
// (las históricas, y las que referencian READMEs/skills) sigan funcionando.
//
// Salida agregada:
//
//   <out>/                 ← latest en `/` (alias de back-compat, base `/`)
//   <out>/5.1.1/           ← latest canónico (base `/5.1.1/`)
//   <out>/5.0.0/           ← versión congelada (base `/5.0.0/`)
//   <out>/versions.json    ← catálogo que lee el select del topbar
//
// Uso:
//   node scripts/docs-versions.mjs [--out <dir>] [--only id,id] [--list]
//                                  [--keep] [--no-install] [--no-root-alias] [--force]
//
// Requiere `pnpm` y los refs del manifiesto (`docs/versions.json`). Las versiones
// congeladas se construyen en un worktree descartable de su ref de git.
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const manifestPath = resolve(root, "docs/versions.json");

// /tmp/opencode es el temporal aprobado por el entorno.
const worktreeRoot = process.env.DOCS_VERSIONS_WORKTREES ?? "/tmp/opencode/docs-versions";

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

function run(cmd, args, { cwd = root, env = {}, capture = false } = {}) {
  return execFileSync(cmd, args, {
    cwd,
    env: { ...process.env, ...env },
    stdio: capture ? ["ignore", "pipe", "inherit"] : "inherit",
    encoding: "utf-8",
  });
}

// ---------------------------------------------------------------------------
// Argumentos
// ---------------------------------------------------------------------------
const argv = process.argv.slice(2);
const opts = {
  out: "docs/site/.vitepress/dist-versions",
  only: null,
  list: false,
  keep: false,
  install: true,
  rootAlias: null,
  force: false,
};
for (let i = 0; i < argv.length; i++) {
  const arg = argv[i];
  if (arg === "--out") opts.out = argv[++i];
  else if (arg === "--only") opts.only = (argv[++i] ?? "").split(",").map((s) => s.trim()).filter(Boolean);
  else if (arg === "--list") opts.list = true;
  else if (arg === "--keep") opts.keep = true;
  else if (arg === "--no-install") opts.install = false;
  else if (arg === "--no-root-alias") opts.rootAlias = false;
  else if (arg === "--force") opts.force = true;
  else if (arg === "--help" || arg === "-h") {
    console.log(
      [
        "node scripts/docs-versions.mjs [opciones]",
        "",
        "  --out <dir>       destino agregado (default docs/site/.vitepress/dist-versions)",
        "  --only id,id      construye sólo esas versiones (latest se agrega igual si está)",
        "  --list            muestra el manifiesto y sale",
        "  --keep            no borra los worktrees temporales",
        "  --no-install      no corre pnpm install en los worktrees",
        "  --no-root-alias   no deja la copia de latest en / (sólo /<id>/)",
        "  --force           permite limpiar un --out que no parece de build",
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

// Orden: latest primero (así su barrido de rutas no ve las carpetas de las otras).
const selected = all
  .filter((v) => v.latest || !opts.only || opts.only.includes(v.id))
  .sort((a, b) => Number(b.latest) - Number(a.latest));

const outDir = resolve(root, opts.out);
// Sólo se limpia un destino que parece de build (dentro de .vitepress o con el
// nombre por defecto), salvo --force: evita rm -rf de una carpeta ajena.
if (existsSync(outDir)) {
  const looksLikeBuild = outDir.includes(".vitepress") || /dist-versions$/.test(outDir);
  if (!looksLikeBuild && !opts.force) {
    fail(`--out ${outDir} no parece un directorio de build; usá --force si estás seguro`);
  }
  log(`limpiando ${relative(root, outDir)}`);
  rmSync(outDir, { recursive: true, force: true });
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
// Build
// ---------------------------------------------------------------------------
/** Corre los pasos de build del sitio en `cwd`, con `base` y metadatos de versión. */
function buildSite({ cwd, base, id, label, out }) {
  const env = { DOCS_BASE: base, DOCS_VERSION_ID: id, DOCS_VERSION_LABEL: label };
  const steps = [
    ["pnpm", ["build:docs:lib"], "lib (esm-shared) para los demos"],
    ["pnpm", ["site:sync"], "tema de VitePress"],
    ["pnpm", ["exec", "vitepress", "build", "docs/site", `--base=${base}`, `--outDir=${out}`], `sitio (base ${base})`],
  ];
  for (const [cmd, args, what] of steps) {
    log(`  · ${what}`);
    run(cmd, args, { cwd, env });
  }
}

const worktrees = [];
function withWorktree(ref, id, fn) {
  mkdirSync(worktreeRoot, { recursive: true });
  const dir = resolve(worktreeRoot, id);
  if (existsSync(dir)) rmSync(dir, { recursive: true, force: true });
  try {
    run("git", ["rev-parse", "--verify", `${ref}^{commit}`], { capture: true });
  } catch {
    fail(`el ref '${ref}' de la versión ${id} no existe en este repo`);
  }
  log(`  · worktree ${dir} @ ${ref}`);
  run("git", ["worktree", "add", "--detach", dir, ref]);
  worktrees.push(dir);
  try {
    if (opts.install) {
      log("  · pnpm install");
      run("pnpm", ["install", "--frozen-lockfile"], { cwd: dir });
    }
    fn(dir);
  } finally {
    if (!opts.keep) {
      run("git", ["worktree", "remove", "--force", dir]);
      worktrees.pop();
    } else {
      log(c.yellow(`  · worktree conservado: ${dir}`));
    }
  }
}

const routesById = {};
log(`${c.bold("Construyendo")} ${selected.length} versión(es) → ${relative(root, outDir)}`);

for (const version of selected) {
  const { id, label } = version;
  const base = baseOf(version);
  log(`${c.bold(id)} ${c.dim(`(${version.ref} → ${base})`)}`);
  const out = resolve(outDir, id);

  if (version.latest) {
    // Alias en `/` primero: el build de VitePress vacía su `outDir`, así que el
    // de la raíz tiene que correr antes de que existan las subcarpetas de versión.
    if (rootAlias) {
      buildSite({ cwd: root, base: "/", id, label, out: outDir });
    }
    // Canónica versionada `/<id>/` (URL estable cuando la versión se congela).
    buildSite({ cwd: root, base, id, label, out });
    routesById[id] = collectRoutes(out);
  } else {
    withWorktree(version.ref, id, (dir) => buildSite({ cwd: dir, base, id, label, out }));
    routesById[id] = collectRoutes(out);
  }
  log(`  ${c.green("✓")} ${routesById[id].length} rutas`);
}

// ---------------------------------------------------------------------------
// Catálogo (lo lee DocsVersionSelect en runtime)
// ---------------------------------------------------------------------------
const catalog = {
  generatedAt: new Date().toISOString(),
  rootAlias,
  // Sólo las versiones construidas: con `--only`, las no construidas no deben
  // aparecer en el select (linkearían a carpetas que no existen en esta salida).
  versions: selected.map((v) => ({
    id: v.id,
    label: v.label,
    base: baseOf(v),
    latest: !!v.latest,
    routes: routesById[v.id] ?? [],
  })),
};

const catalogJson = `${JSON.stringify(catalog, null, 2)}\n`;
// En la raíz (lo fetcha el alias `/`) y en cada versión (lo fetcha `/<id>/`).
writeFileSync(join(outDir, "versions.json"), catalogJson);
for (const version of selected) {
  writeFileSync(join(outDir, version.id, "versions.json"), catalogJson);
}
log(`${c.green("✓")} catálogo: ${c.dim(relative(root, join(outDir, "versions.json")))}`);

// ---------------------------------------------------------------------------
// Limpieza
// ---------------------------------------------------------------------------
if (!opts.keep) {
  for (const dir of worktrees) rmSync(dir, { recursive: true, force: true });
  run("git", ["worktree", "prune"]);
}

log(`${c.bold(c.green("listo"))} — serví ${c.dim(relative(root, outDir))} como sitio estático`);
for (const v of catalog.versions) {
  log(`  ${v.latest ? "★ latest" : `  ${v.id}   `}  ${v.base}`);
}
if (rootAlias) log(`    alias    /  ${c.dim(`(copia de latest, sin versión)`)}`);
