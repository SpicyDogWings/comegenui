#!/usr/bin/env node
// scripts/docs-freeze.mjs — Congela (materializa) las tablas de API de una versión.
//
// Al cortar una versión, sus tablas dejan de regenerarse: se guardan en **texto plano**, sin los
// marcadores `@api:*`, para que esa versión sea autosuficiente (no necesita el SFC de su tag ni el
// toolchain). Después de congelarla, `gen-api --check` ya no corre sobre esa versión.
//
//   node scripts/docs-freeze.mjs <id>          # congela docs/versiones/<id>/**
//   node scripts/docs-freeze.mjs <id> --dry    # muestra qué haría, sin escribir
//
// Ver `docs/notes/13-doc-versionada.md`.
import { readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const [, , id, ...flags] = process.argv;
const dry = flags.includes("--dry");

if (!id) {
  console.error("docs-freeze: falta el id de la versión (ej: node scripts/docs-freeze.mjs 5.1.1)");
  process.exit(2);
}

const versionDir = resolve(root, "docs/versiones", id);
try {
  if (!statSync(versionDir).isDirectory()) throw new Error();
} catch {
  console.error(`docs-freeze: no existe docs/versiones/${id}`);
  process.exit(1);
}

/** Los marcadores que `gen-api` usa para rellenar/validar; se van, el contenido queda. */
const MARCADOR = /[ \t]*<!--\s*\/?@api:[\w:-]+\s*-->[ \t]*\n?/g;

function markdownFiles(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const full = resolve(dir, entry);
    if (statSync(full).isDirectory()) markdownFiles(full, out);
    else if (entry.endsWith(".md")) out.push(full);
  }
  return out;
}

let archivos = 0;
let marcadores = 0;
for (const file of markdownFiles(versionDir)) {
  const source = readFileSync(file, "utf-8");
  if (!source.includes("@api:")) continue;
  const limpio = source.replace(MARCADOR, "");
  const n = [...source.matchAll(MARCADOR)].length;
  marcadores += n;
  archivos++;
  const rel = file.slice(root.length + 1);
  console.log(`${dry ? "(dry) " : ""}${rel}: ${n} marcador(es)`);
  if (!dry) writeFileSync(file, limpio);
}

console.log(
  `docs-freeze: ${archivos} archivo(s), ${marcadores} marcador(es) ${dry ? "a quitar" : "quitados"} en docs/versiones/${id}`,
);
