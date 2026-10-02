#!/usr/bin/env node
// scripts/contract.mjs — el contrato de cada custom element compilado.
//
// Carga cada `dist-lib/Cu*.umd.js` en jsdom, instancia el elemento y arma una
// "huella" estable: props declaradas, métodos expuestos, metadata `comegen` y la
// estructura del shadow DOM (tags + clases + nombres de atributos). La compara
// contra el baseline versionado en `scripts/contract-baseline/<tag>.json`.
//
// Si algo cambió, lo reporta con nombre y apellido. Se regenera a propósito con
// `--update`.
//
// Uso:
//   node scripts/contract.mjs                    # verifica todos
//   node scripts/contract.mjs --solo cu-select   # uno solo
//   node scripts/contract.mjs --update           # regenera el baseline
//   node scripts/contract.mjs --json
import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync, rmSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { JSDOM } from "jsdom";

export const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const DIST = resolve(ROOT, "dist-lib");
const BASELINE = resolve(ROOT, "scripts/contract-baseline");

// ── jsdom: un único entorno para todos los UMD ───────────────────────────────
function makeWindow() {
  const dom = new JSDOM("<!DOCTYPE html><html><body></body></html>", {
    runScripts: "outside-only",
    pretendToBeVisual: true,
    url: "http://localhost/",
  });
  const { window } = dom;
  globalThis.window = window;
  globalThis.self = window;
  for (const key of Object.getOwnPropertyNames(window)) {
    if (key in globalThis) continue;
    if (["window", "self", "globalThis", "top", "parent", "frames"].includes(key)) continue;
    try {
      Object.defineProperty(globalThis, key, { value: window[key], configurable: true, writable: true });
    } catch { /* propiedad de solo lectura */ }
  }
  return window;
}

let sharedWindow = null;
function getWindow() {
  if (!sharedWindow) sharedWindow = makeWindow();
  return sharedWindow;
}

/** Carga un UMD y devuelve el tag base recién registrado + su metadata. */
function loadBundle(window, file) {
  const registry = window.customElements;
  const original = registry.define;
  const defined = [];
  // El registry no se puede enumerar: interceptamos `define` para saber qué tags
  // registró este UMD (base + versionado) sin confiar en el nombre del archivo.
  registry.define = function (name, ctor, options) {
    defined.push(name);
    return original.call(this, name, ctor, options);
  };
  try {
    (0, eval)(readFileSync(file, "utf-8"));
  } finally {
    registry.define = original;
  }
  const base = defined.find((k) => !k.includes("--v")) ?? defined[0];
  if (!base) return null;
  const ctor = registry.get(base);
  return { tag: base, name: ctor?.comegen?.name ?? base, version: ctor?.comegen?.version ?? "?" };
}

/** Nombre del tag base registrado por un UMD (sin instanciar). */
function tagOfBundle(window, file) {
  const info = loadBundle(window, file);
  return info ? info.tag : null;
}

/** Huella estable de la estructura del shadow DOM. */
function fingerprint(node) {
  const lines = [];
  const walkEl = (el, depth) => {
    const tag = el.tagName.toLowerCase();
    if (tag === "style" || tag === "script") return;
    const classes = (el.getAttribute("class") ?? "").split(/\s+/).filter(Boolean).sort().join(".");
    const attrs = [...el.attributes].map((a) => a.name).filter((n) => n !== "class").sort();
    lines.push(`${"  ".repeat(depth)}${tag}${classes ? "." + classes : ""}${attrs.length ? "[" + attrs.join(",") + "]" : ""}`);
    for (const child of el.children) walkEl(child, depth + 1);
  };
  for (const child of node.children) walkEl(child, 0);
  return lines.join("\n");
}

const INTERNAL = /^_/;

/** Contrato runtime de un elemento ya registrado. */
function contractOf(window, tag) {
  return new Promise((resolveP) => {
    let el;
    try {
      el = window.document.createElement(tag);
      window.document.body.appendChild(el);
    } catch (err) {
      resolveP({ tag, props: [], methods: [], shadow: `(error al crear: ${err.message})` });
      return;
    }
    // Deja correr el mount de Vue (microtasks + un tick).
    setTimeout(() => {
      try {
        const own = Object.getOwnPropertyNames(el).filter((n) => !INTERNAL.test(n));
        const props = own.filter((n) => typeof el[n] !== "function").sort();
        const methods = own.filter((n) => typeof el[n] === "function").sort();
        resolveP({
          tag,
          props,
          methods,
          shadow: el.shadowRoot ? fingerprint(el.shadowRoot) : "(sin shadow root)",
        });
      } catch (err) {
        resolveP({ tag, props: [], methods: [], shadow: `(error al leer: ${err.message})` });
      }
    }, 40);
  });
}

/** Lista de bundles del dist con su tag. */
export function discoverTags() {
  if (!existsSync(DIST)) return [];
  const files = readdirSync(DIST).filter((f) => f.endsWith(".umd.js")).sort();
  const window = getWindow();
  const tags = [];
  for (const f of files) {
    const tag = tagOfBundle(window, resolve(DIST, f));
    if (tag) tags.push(tag);
  }
  return tags;
}

/** Compara un contrato contra su baseline. Devuelve lista de diferencias humanas. */
function diff(baseline, current) {
  const out = [];
  for (const field of ["props", "methods"]) {
    const a = new Set(baseline[field] ?? []);
    const b = new Set(current[field] ?? []);
    for (const x of b) if (!a.has(x)) out.push(`${field}: AGREGADO "${x}"`);
    for (const x of a) if (!b.has(x)) out.push(`${field}: QUITADO "${x}"`);
  }
  if (baseline.shadow !== current.shadow) {
    const a = new Set((baseline.shadow ?? "").split("\n"));
    const b = new Set((current.shadow ?? "").split("\n"));
    for (const line of b) if (!a.has(line)) out.push(`shadow: + ${line.trim()}`);
    for (const line of a) if (!b.has(line)) out.push(`shadow: - ${line.trim()}`);
  }
  return out;
}

/** Corre el contrato de los tags pedidos y compara contra el baseline. */
export async function runContracts({ tags, update = false } = {}) {
  if (!existsSync(DIST)) {
    return [{ tag: "(dist-lib)", status: "error", diffs: [`no existe ${DIST}; corré build:lib`] }];
  }
  const window = getWindow();
  const all = discoverTags();
  const selected = tags?.length ? all.filter((t) => tags.includes(t)) : all;
  const results = [];
  for (const tag of selected) {
    const current = await contractOf(window, tag);
    const file = resolve(BASELINE, `${tag}.json`);
    const hasBaseline = existsSync(file);
    if (update || !hasBaseline) {
      mkdirSync(BASELINE, { recursive: true });
      writeFileSync(file, JSON.stringify(current, null, 2) + "\n");
      results.push({ tag, status: hasBaseline ? "updated" : "created", name: current.tag });
      continue;
    }
    const baseline = JSON.parse(readFileSync(file, "utf-8"));
    const diffs = diff(baseline, current);
    results.push({ tag, status: diffs.length ? "broken" : "ok", diffs });
  }
  return results;
}

export function baselineTags() {
  if (!existsSync(BASELINE)) return [];
  return readdirSync(BASELINE).filter((f) => f.endsWith(".json")).map((f) => f.slice(0, -5));
}

export function wipeBaseline() {
  if (existsSync(BASELINE)) rmSync(BASELINE, { recursive: true, force: true });
}

// ── CLI ──────────────────────────────────────────────────────────────────────
if (import.meta.url === `file://${process.argv[1]}`) {
  const argv = process.argv.slice(2);
  const json = argv.includes("--json");
  const update = argv.includes("--update");
  const i = argv.indexOf("--solo");
  const solo = i >= 0 ? argv.slice(i + 1).filter((a) => !a.startsWith("-")) : [];

  if (update && argv.includes("--wipe")) wipeBaseline();
  const results = await runContracts({ tags: solo, update });

  if (json) {
    console.log(JSON.stringify(results, null, 2));
  } else {
    const icon = { ok: "✅", updated: "🔄", created: "🆕", broken: "❌", error: "💥" };
    for (const r of results) {
      console.log(`${icon[r.status] ?? "•"} ${r.tag}${r.status === "broken" ? " — ROTO" : ""}`);
      for (const d of r.diffs ?? []) console.log(`     ${d}`);
    }
  }
  if (results.some((r) => r.status === "broken" || r.status === "error")) process.exit(1);
}
