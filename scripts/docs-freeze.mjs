#!/usr/bin/env node
// scripts/docs-freeze.mjs — Congela (materializa) el árbol de una versión y su lib.
//
// Al cortar una versión, sus tablas dejan de regenerarse: se guardan en **texto plano**, sin los
// marcadores `@api:*`, para que esa versión sea autosuficiente (no necesita el SFC de su tag ni el
// toolchain). Después de congelarla, `gen-api --check` ya no corre sobre esa versión.
//
// Con overlay, una versión guarda sólo lo que cambió: se resuelve **su árbol** (`doc-tree`) y se
// congelan los archivos que le pertenecen (los heredados de versiones anteriores ya se congelaron
// al cortarlas; no se tocan). Si un archivo heredado todavía tuviera marcadores, se avisa.
//
// Además, la versión congela **su lib**: copia el build `esm-shared` (el que consumen los demos
// vanilla) a `docs/versiones/<id>/lib/`, versionado en git. Así cada doc publicada embebe la lib de
// su versión y `scripts/docs-versions.mjs` la usa al buildearla (ver `docs/notes/13-doc-versionada.md`).
//
//   node scripts/docs-freeze.mjs <id>            # congela el árbol + copia la lib (si existe el build)
//   node scripts/docs-freeze.mjs <id> --dry      # muestra qué haría, sin escribir
//   node scripts/docs-freeze.mjs <id> --with-lib # exige copiar la lib (falla si no hay build)
//   node scripts/docs-freeze.mjs <id> --no-lib   # no toca la lib (sólo congela las tablas)
//
// Ver `docs/notes/13-doc-versionada.md`.
import { cpSync, existsSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from "node:fs";
import { relative, resolve } from "node:path";
import { ROOT, resolvedFilesFor, resolveInVersion, versionsInOrder } from "./doc-tree.mjs";

const [, , id, ...flags] = process.argv;
const dry = flags.includes("--dry");
const withLib = flags.includes("--with-lib");
const noLib = flags.includes("--no-lib");

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

// ── lib versionada ───────────────────────────────────────────────────────────
// Se copia el build `esm-shared` (el que consumen los demos) a `docs/versiones/<id>/lib/`, que
// **sí** se versiona (a diferencia de `dist-libs/`, gitignoreado). ~2-3 MB por versión.
const LIB_SRC = resolve(ROOT, "dist-libs/esm-shared");
const LIB_DEST = resolve(ROOT, "docs/versiones", id, "lib");

/** Tamaño legible y cantidad de archivos de un directorio. */
function dirStats(dir) {
  let bytes = 0;
  let files = 0;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = resolve(dir, entry.name);
    if (entry.isDirectory()) {
      const sub = dirStats(full);
      bytes += sub.bytes;
      files += sub.files;
    } else {
      bytes += statSync(full).size;
      files++;
    }
  }
  return { bytes, files };
}

const mb = (bytes) => `${(bytes / 1024 / 1024).toFixed(2)} MB`;

if (noLib) {
  console.log(`docs-freeze: lib no tocada (--no-lib)`);
} else if (!existsSync(LIB_SRC)) {
  if (withLib) {
    console.error(
      `docs-freeze: --with-lib pero no existe ${rel(LIB_SRC)}. ` +
        `Corré \`pnpm build:docs:lib\` (o \`COMEGEN_CONFIGS=esm-shared pnpm build:lib\`) primero.`,
    );
    process.exitCode = 1;
  } else {
    console.warn(`docs-freeze: sin ${rel(LIB_SRC)}: no copié la lib (corré \`pnpm build:docs:lib\`).`);
  }
} else {
  const { bytes, files } = dirStats(LIB_SRC);
  // Se reemplaza el directorio entero: evita dejar bundles de un build anterior.
  console.log(
    `${dry ? "(dry) " : ""}docs-freeze: lib ${rel(LIB_DEST)} (${files} archivo(s), ${mb(bytes)}) ` +
      `← ${rel(LIB_SRC)}`,
  );
  if (!dry) {
    rmSync(LIB_DEST, { recursive: true, force: true });
    cpSync(LIB_SRC, LIB_DEST, { recursive: true });
  }
}
