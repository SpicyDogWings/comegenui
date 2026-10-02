#!/usr/bin/env node
// scripts/impact.mjs — ¿qué componentes toca este cambio?
//
// Construye el grafo de imports desde cada entry de `src/lib/**/*.ts` (sigue
// imports relativos y el alias `@/`), calcula el cierre transitivo de cada
// componente y, dado un conjunto de archivos cambiados, devuelve los tags
// afectados. Sin dependencias nuevas: parser de imports por regex + resolver
// de extensiones.
//
// Uso:
//   node scripts/impact.mjs --files a.ts b.vue     # tags afectados por esos archivos
//   node scripts/impact.mjs --git                  # usa `git diff --name-only`
//   node scripts/impact.mjs --list                 # tag → cantidad de archivos
//   node scripts/impact.mjs --json                 # salida JSON
import { readFileSync, existsSync, statSync, readdirSync } from "node:fs";
import { resolve, dirname, extname, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

export const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const SRC = resolve(ROOT, "src");
const LIB = resolve(SRC, "lib");
const EXTS = [".ts", ".tsx", ".js", ".mjs", ".vue"];

/** Todos los archivos bajo `dir` con las extensiones pedidas. */
function walk(dir, exts) {
  const found = [];
  for (const entry of readdirSync(dir)) {
    const full = resolve(dir, entry);
    if (statSync(full).isDirectory()) found.push(...walk(full, exts));
    else if (exts.includes(extname(entry))) found.push(full);
  }
  return found;
}

/** Especificadores importados por un archivo (import, export-from, import()). */
function importsOf(file, source = readFileSync(file, "utf-8")) {
  const specs = new Set();
  for (const re of [
    /\bfrom\s*["']([^"']+)["']/g,
    /\bimport\s*["']([^"']+)["']/g,
    /\bimport\(\s*["']([^"']+)["']\s*\)/g,
  ]) {
    for (const m of source.matchAll(re)) specs.add(m[1]);
  }
  return [...specs];
}

/** `@/x` o `./x` → ruta absoluta existente; `null` si es un paquete externo. */
function resolveSpec(fromFile, spec) {
  let base;
  if (spec.startsWith("@/")) base = resolve(SRC, spec.slice(2));
  else if (spec.startsWith(".")) base = resolve(dirname(fromFile), spec);
  else return null;

  const candidates = [base, ...EXTS.map((e) => base + e), ...EXTS.map((e) => resolve(base, "index" + e))];
  for (const candidate of candidates) {
    if (existsSync(candidate) && statSync(candidate).isFile()) return candidate;
  }
  return null;
}

/** Grafo de adyacencia archivo → archivos importados (resueltos). */
export function buildGraph() {
  const graph = new Map();
  const entries = walk(LIB, [".ts"]).filter((f) => !/(^|\/)(index|tokens)\.ts$/.test(f));
  const queue = [...entries];
  const seen = new Set(queue);
  while (queue.length) {
    const file = queue.pop();
    const deps = new Set();
    for (const spec of importsOf(file)) {
      const resolved = resolveSpec(file, spec);
      if (resolved) {
        deps.add(resolved);
        if (!seen.has(resolved)) {
          seen.add(resolved);
          queue.push(resolved);
        }
      }
    }
    graph.set(file, deps);
  }
  return { graph, entries };
}

/** tag del custom element → archivo entry de `src/lib`. */
export function componentEntries() {
  const map = new Map();
  const tagRE = /(?:customElements\.define|defineComegenElement)\(\s*["']([^"']+)["']/g;
  for (const file of walk(LIB, [".ts"])) {
    const base = file.split(sep).pop();
    if (base === "index.ts" || base === "tokens.ts") continue;
    for (const m of readFileSync(file, "utf-8").matchAll(tagRE)) map.set(m[1], file);
  }
  return map;
}

/** tag → Set(archivos) del cierre transitivo del componente. */
export function componentFiles(graph = buildGraph().graph) {
  const result = new Map();
  for (const [tag, entry] of componentEntries()) {
    const seen = new Set([entry]);
    const stack = [entry];
    while (stack.length) {
      const file = stack.pop();
      for (const dep of graph.get(file) ?? []) {
        if (!seen.has(dep)) {
          seen.add(dep);
          stack.push(dep);
        }
      }
    }
    result.set(tag, seen);
  }
  return result;
}

/** Tags cuyos archivos incluyen alguno de `changedFiles`. */
export function affectedComponents(changedFiles, filesByTag = componentFiles()) {
  const changed = new Set(changedFiles.map((f) => resolve(ROOT, f)));
  const affected = [];
  for (const [tag, files] of filesByTag) {
    for (const f of changed) if (files.has(f)) {
      affected.push(tag);
      break;
    }
  }
  return affected.sort();
}

/** Archivos cambiados según git (working tree + staged, o vs `base`). */
export function gitChanged(base) {
  const args = base
    ? ["diff", "--name-only", base]
    : ["status", "--porcelain"];
  const out = execFileSync("git", args, { cwd: ROOT, encoding: "utf-8" });
  const lines = out.split("\n").map((l) => l.trim()).filter(Boolean);
  if (base) return lines;
  return lines.map((l) => {
    const m = /^(?:\?\?|\S+)\s+(.+)$/.exec(l);
    return m ? m[1] : l;
  });
}

// ── CLI ──────────────────────────────────────────────────────────────────────
if (import.meta.url === `file://${process.argv[1]}`) {
  const argv = process.argv.slice(2);
  const json = argv.includes("--json");
  const filesByTag = componentFiles();
  const out = (obj, text) => console.log(json ? JSON.stringify(obj, null, 2) : text);

  if (argv.includes("--list")) {
    const rows = [...filesByTag.entries()].sort((a, b) => a[0].localeCompare(b[0]));
    out(
      rows.map(([tag, files]) => ({ tag, files: files.size })),
      rows.map(([tag, files]) => `${tag}\t${files.size} archivo(s)`).join("\n"),
    );
  } else {
    const i = argv.indexOf("--files");
    const changed = argv.includes("--git") ? gitChanged() : i >= 0 ? argv.slice(i + 1) : [];
    const affected = affectedComponents(changed);
    out(
      { changed, affected },
      affected.length
        ? affected.map((t) => `- ${t}`).join("\n")
        : "(ningún componente afectado por los archivos cambiados)",
    );
  }
}
