#!/usr/bin/env node
// scripts/typecheck-diff.mjs — errores de tipo NUEVOS, por identidad.
//
// Lee el log de `vue-tsc` y lo compara contra el baseline (una línea por error
// conocido, `archivo:codigo`). Imprime en la primera línea la cantidad de
// errores nuevos y, debajo, cada uno. Salida 0 si no hay ninguno nuevo.
//
// Uso: node scripts/typecheck-diff.mjs <log> <baseline>
import { readFileSync, existsSync } from "node:fs";

const [, , logPath, baselinePath] = process.argv;
const log = existsSync(logPath) ? readFileSync(logPath, "utf-8") : "";
const baseline = existsSync(baselinePath)
  ? new Set(readFileSync(baselinePath, "utf-8").split("\n").map((l) => l.trim()).filter(Boolean))
  : new Set();

const ERROR_RE = /^(.+?)\((\d+),(\d+)\):\s+error (TS\d+):/gm;

/** Clave estable de un error: archivo + código (sin línea, que se mueve). */
function keyOf(file, code) {
  return `${file}:${code}`;
}

const current = new Map(); // clave → muestra representativa
for (const m of log.matchAll(ERROR_RE)) {
  const [, file, line, col, code] = m;
  const key = keyOf(file, code);
  if (!current.has(key)) current.set(key, `${file}(${line},${col}): error ${code}`);
}

const nuevos = [...current.keys()].filter((k) => !baseline.has(k)).sort();

console.log(nuevos.length);
for (const key of nuevos) console.log(current.get(key));
process.exit(nuevos.length ? 1 : 0);
