#!/usr/bin/env node
// scripts/docs-freeze.mjs — Congela (materializa) las tablas de API del árbol de una versión.
//
// Al cortar una versión, sus tablas dejan de regenerarse: se guardan en **texto plano**, sin los
// marcadores `@api:*`, para que esa versión sea autosuficiente (no necesita el SFC de su tag ni el
// toolchain). Después de congelarla, `gen-api --check` ya no corre sobre esa versión.
//
// Con overlay, una versión guarda sólo lo que cambió: se resuelve **su árbol** (`doc-tree`) y se
// congelan los archivos que le pertenecen (los heredados de versiones anteriores ya se congelaron
// al cortarlas; no se tocan). Si un archivo heredado todavía tuviera marcadores, se avisa.
//
//   node scripts/docs-freeze.mjs <id>          # congela el árbol resuelto de docs/versiones/<id>/
//   node scripts/docs-freeze.mjs <id> --dry     # muestra qué haría, sin escribir
//
// Ver `docs/notes/13-doc-versionada.md`.
import { readFileSync, writeFileSync } from "node:fs";
import { relative, resolve } from "node:path";
import { ROOT, resolvedFilesFor, resolveInVersion, versionsInOrder } from "./doc-tree.mjs";

const [, , id, ...flags] = process.argv;
const dry = flags.includes("--dry");

if (!id) {
  console.error("docs-freeze: falta el id de la versión (ej: node scripts/docs-freeze.mjs 5.1.1)");
  process.exit(2);
}
if (!versionsInOrder().some((v) => v.id === id)) {
  console.error(`docs-freeze: '${id}' no está en el manifiesto (docs/versions.json)`);
  process.exit(1);
}

/** Los marcadores que `gen-api` usa para rellenar/validar; se van, el contenido queda. */
const MARCADOR = /[ \t]*<!--\s*\/?@api:[\w:-]+\s*-->[ \t]*\n?/g;

const rel = (p) => relative(ROOT, p);

let archivos = 0;
let marcadores = 0;
let heredados = 0;
const heredadosConMarcadores = [];

// Se recorre el árbol **resuelto** de la versión; sólo se escribe lo que le pertenece.
for (const [relPath, fromVersion] of resolvedFilesFor(id)) {
  if (!relPath.endsWith(".md")) continue;
  const file = resolveInVersion(id, relPath);
  const source = readFileSync(file, "utf-8");
  const tieneMarcadores = source.includes("@api:");

  if (fromVersion !== id) {
    heredados++;
    if (tieneMarcadores) heredadosConMarcadores.push(rel(file));
    continue;
  }
  if (!tieneMarcadores) continue;

  const limpio = source.replace(MARCADOR, "");
  const n = [...source.matchAll(MARCADOR)].length;
  marcadores += n;
  archivos++;
  console.log(`${dry ? "(dry) " : ""}${rel(file)}: ${n} marcador(es)`);
  if (!dry) writeFileSync(file, limpio);
}

if (heredadosConMarcadores.length) {
  console.warn(
    `docs-freeze: ${heredadosConMarcadores.length} archivo(s) heredado(s) todavía con marcadores ` +
      `(congelá primero la versión que los define):`,
  );
  for (const f of heredadosConMarcadores) console.warn(`  · ${f}`);
  // El árbol resuelto no queda autosuficiente si un archivo heredado conserva marcadores.
  if (!dry) process.exitCode = 1;
}

console.log(
  `docs-freeze: ${archivos} archivo(s) propios con ${marcadores} marcador(es) ${dry ? "a quitar" : "quitados"} ` +
    `en docs/versiones/${id} (+ ${heredados} heredado(s) ya congelados)`,
);
