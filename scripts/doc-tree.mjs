// scripts/doc-tree.mjs — Resolutor del árbol de doc versionada.
//
// La doc es la fuente y vive por versiones (`docs/versiones/<id>/`), con **overlay**: una versión
// guarda sólo lo que cambió y el resto se resuelve desde las anteriores. Este módulo es la única
// implementación de esa regla (la usan `docs-compose`, `gen-api` y `check-docs`).
//
// Regla: de la más vieja a la más nueva, **gana el último archivo del mismo path**.
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";

/** Raíz del repo (este archivo vive en `scripts/`). */
export const ROOT = resolve(dirname(new URL(import.meta.url).pathname), "..");

/** Las versiones del manifiesto, de la más vieja a la más nueva (`latest` al final). */
export function versionsInOrder() {
  const manifest = JSON.parse(readFileSync(resolve(ROOT, "docs/versions.json"), "utf-8"));
  const versions = (manifest.versions ?? []).filter((v) => v?.id);
  return [...versions].sort((a, b) => Number(!!a.latest) - Number(!!b.latest));
}

/** La versión editable (`latest` del manifiesto): ahí se escriben los cambios. */
export function latestId() {
  const latest = versionsInOrder().find((v) => v.latest);
  if (!latest) {
    throw new Error("doc-tree: el manifiesto (docs/versions.json) no tiene una versión latest");
  }
  return latest.id;
}

/** Las versiones del manifiesto **hasta** (incluyendo) `id`, de la más vieja a la más nueva. */
export function versionsUpTo(id) {
  const ordered = versionsInOrder();
  const at = ordered.findIndex((v) => v.id === id);
  if (at === -1) throw new Error(`doc-tree: '${id}' no está en el manifiesto (docs/versions.json)`);
  return ordered.slice(0, at + 1);
}

/** Ruta absoluta del archivo/dir **resuelto** (con overlays) o `null` si no existe en ninguna. */
export function resolveInVersions(relPath) {
  return resolveInVersion(latestId(), relPath);
}

/** Ruta absoluta de `relPath` resuelto **para la versión `id`** (overlay hasta `id`), o `null`. */
export function resolveInVersion(id, relPath) {
  // "gana el último archivo del mismo path": se recorren de la más vieja a la más nueva (`id`) y
  // se devuelve la última que exista.
  const candidates = versionsUpTo(id).map((v) => resolve(ROOT, "docs/versiones", v.id, relPath));
  return candidates.findLast((p) => existsSync(p)) ?? null;
}

/** Todos los paths relativos que existen en el árbol resuelto, con la versión de la que salen. */
export function resolvedFiles(subdir = "") {
  return collectResolved(versionsInOrder(), subdir);
}

/** Todos los paths del árbol resuelto **de la versión `id`**, con la versión que los define. */
export function resolvedFilesFor(id, subdir = "") {
  return collectResolved(versionsUpTo(id), subdir);
}

/** `relPath` (relativo a la raíz de la versión) → id de la versión que gana. */
function collectResolved(versions, subdir) {
  const out = new Map(); // relPath → id (la última versión que lo define gana)
  for (const version of versions) {
    const base = resolve(ROOT, "docs/versiones", version.id);
    const dir = resolve(base, subdir);
    if (!existsSync(dir)) continue;
    for (const full of walk(dir)) out.set(full.slice(base.length + 1), version.id);
  }
  return out;
}

/** ¿Existe `relPath` en el árbol resuelto? */
export function exists(relPath) {
  return resolveInVersions(relPath) !== null;
}

/** Lee `relPath` del árbol resuelto (`null` si no está en ninguna versión). */
export function readResolved(relPath) {
  const file = resolveInVersions(relPath);
  return file ? readFileSync(file, "utf-8") : null;
}

/** Escribe `content` en la versión **latest** (crea los directorios que falten). */
export function writeInLatest(relPath, content) {
  const file = resolve(ROOT, "docs/versiones", latestId(), relPath);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, content);
  return file;
}

function walk(dir) {
  const found = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) found.push(...walk(full));
    else found.push(full);
  }
  return found;
}
