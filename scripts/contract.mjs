#!/usr/bin/env node
// scripts/contract.mjs — el contrato de cada custom element compilado.
//
// Carga cada `dist-libs/umd-core/Cu*.umd.js` en jsdom, instancia el elemento y arma una
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
import { fileURLToPath, pathToFileURL } from "node:url";
import { tmpdir } from "node:os";
import { JSDOM } from "jsdom";

export const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const OUT_ROOT = resolve(ROOT, "dist-libs");
// La huella (baseline) se toma de `umd-core`: la API es la misma en las cuatro
// configuraciones; las demás se verifican con un smoke test (abajo).
const DIST = resolve(OUT_ROOT, "umd-core");
const UMD_SHARED = resolve(OUT_ROOT, "umd-shared");
const ESM_CORE = resolve(OUT_ROOT, "esm-core");
const ESM_SHARED = resolve(OUT_ROOT, "esm-shared");
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

/**
 * Entorno jsdom propio, rebindeando a mano los globals del DOM que Vue y
 * `initTokens` consultan (a diferencia de `makeWindow`, que sólo copia los que
 * aún no existen). Necesario para correr cada smoke ESM en un registro nuevo,
 * sin chocar con los tags ya definidos por `umd-core` u otra config. NO toca
 * globals propios de Node (performance, fetch…): hacerlo cuelga jsdom.
 */
const DOM_BINDINGS = [
  "document", "customElements", "getComputedStyle", "matchMedia",
  "HTMLElement", "SVGElement", "Element", "Node", "ShadowRoot",
  "DocumentFragment", "Document", "CSSStyleSheet",
  "HTMLStyleElement", "HTMLTemplateElement", "Text", "Comment",
  "CustomEvent", "Event", "EventTarget",
];
function makeBoundWindow() {
  const dom = new JSDOM("<!DOCTYPE html><html><body></body></html>", {
    runScripts: "outside-only",
    pretendToBeVisual: true,
    url: "http://localhost/",
  });
  const { window } = dom;
  globalThis.window = window;
  globalThis.self = window;
  for (const key of DOM_BINDINGS) {
    if (!(key in window)) continue;
    const value = typeof window[key] === "function" && key === "getComputedStyle"
      ? window[key].bind(window)
      : window[key];
    try {
      Object.defineProperty(globalThis, key, { value, configurable: true, writable: true });
    } catch { /* propiedad no configurable */ }
  }
  return window;
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
    const attrs = [...el.attributes].map((a) => a.name)
      .filter((n) => n !== "class" && !/^data-v-/.test(n)).sort();
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
  // La huella se toma de `umd-core`: `shared` (mismo tag, mismo fuente) y las
  // variantes ESM se verifican aparte con un smoke test.
  const files = readdirSync(DIST)
    .filter((f) => f.endsWith(".umd.js"))
    .sort();
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
    return [{ tag: "(dist-libs/umd-core)", status: "error", diffs: [`no existe ${DIST}; corré build:lib`] }];
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

// ── configuraciones alternativas: smoke tests ────────────────────────────────
/**
 * `umd-core` es la huella (baseline). Las otras tres configuraciones registran
 * la misma API desde el mismo fuente: sólo cambia cómo resuelven Vue y el
 * formato. Lo que se verifica es que carguen de verdad y queden marcadas con su
 * `type` (`umd-shared`, `esm-core`, `esm-shared`). Sin esto, una config rota
 * pasaría en verde.
 */

const registersCE = (code) =>
  code.includes("defineComegenElement") || code.includes("customElements.define");

/** Intercepta `customElements.define` para saber qué tags registra un bundle. */
function interceptDefine(registry) {
  const original = registry.define;
  const defined = [];
  registry.define = function (name, ctor, options) {
    defined.push(name);
    return original.call(this, name, ctor, options);
  };
  return { defined, restore: () => { registry.define = original; } };
}

/** Arma el resultado de un smoke: tag registrado + metadata con su `type`. */
function smokeResult(registry, defined, file, label) {
  const base = defined.find((k) => !k.includes("--v")) ?? defined[0] ?? null;
  if (!base) return { file, tag: null, ok: false, error: "no registró tag" };
  const meta = registry.get(base)?.comegen;
  if (!meta?.version) return { file, tag: base, ok: false, error: "sin metadata comegen" };
  if (meta.type !== label) {
    return { file, tag: base, ok: false, error: `type="${meta.type}", esperado "${label}"` };
  }
  return { file, tag: base, ok: true, error: null };
}

/** `umd-shared`: carga el runtime global (`__COMEGEN_VUE__`) + cada bundle. */
function smokeUmdShared() {
  const runtime = resolve(UMD_SHARED, "comegen-vue.global.js");
  if (!existsSync(runtime) || !existsSync(UMD_SHARED)) {
    return [{ file: "umd-shared/comegen-vue.global.js", ok: false, error: "no existe; corré build:lib" }];
  }
  const files = readdirSync(UMD_SHARED).filter((f) => f.endsWith(".umd.js")).sort();
  if (!files.length) return [];
  const dom = new JSDOM("<!DOCTYPE html><html><body></body></html>", {
    runScripts: "outside-only",
    pretendToBeVisual: true,
    url: "http://localhost/",
  });
  const { window } = dom;
  window.eval(readFileSync(runtime, "utf-8"));
  if (!window.__COMEGEN_VUE__) {
    return [{ file: "umd-shared/comegen-vue.global.js", ok: false, error: "no expuso __COMEGEN_VUE__" }];
  }
  const out = [];
  for (const f of files) {
    const file = `umd-shared/${f}`;
    const code = readFileSync(resolve(UMD_SHARED, f), "utf-8");
    // Hay bundles que no registran CE (p. ej. `CuColors`, sólo tokens).
    if (!registersCE(code)) continue;
    const { defined, restore } = interceptDefine(window.customElements);
    try {
      window.eval(code);
      out.push(smokeResult(window.customElements, defined, file, "umd-shared"));
    } catch (err) {
      out.push({ file, tag: null, ok: false, error: err.message });
    } finally {
      restore();
    }
  }
  return out;
}

/**
 * `esm-core` / `esm-shared`: `import()` real. Los bundles se llaman `CuX.js`.
 * `esm-shared` trae `import 'vue'` (bare) y su runtime `comegen-vue.js`; para
 * importarlo en Node sin bundler se reescribe ese import al runtime del zip en
 * una copia temporal, así se verifica el bundle real + el runtime real.
 */
async function smokeEsm(dir, label) {
  if (!existsSync(dir)) return [];
  const files = readdirSync(dir).filter((f) => f.endsWith(".js") && !f.endsWith(".umd.js")).sort();
  if (!files.length) return [];
  const window = makeBoundWindow();
  const runtime = label === "esm-shared" ? pathToFileURL(resolve(dir, "comegen-vue.js")).href : null;
  const out = [];
  for (const f of files) {
    const file = `${label}/${f}`;
    let code = readFileSync(resolve(dir, f), "utf-8");
    if (!registersCE(code)) continue;
    let importPath = resolve(dir, f);
    let tmp = null;
    try {
      if (runtime) {
        code = code.replace(/from\s*(["'])vue\1/g, `from ${JSON.stringify(runtime)}`);
        tmp = resolve(tmpdir(), `comegen-smoke-${label}-${f}-${process.pid}.mjs`);
        writeFileSync(tmp, code);
        importPath = tmp;
      }
      const { defined, restore } = interceptDefine(window.customElements);
      try {
        await import(pathToFileURL(importPath).href);
        out.push(smokeResult(window.customElements, defined, file, label));
      } finally {
        restore();
      }
    } catch (err) {
      out.push({ file, tag: null, ok: false, error: err.message });
    } finally {
      if (tmp) rmSync(tmp, { force: true });
    }
  }
  return out;
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
  const smokes = update
    ? []
    : [
        ...smokeUmdShared(),
        ...(await smokeEsm(ESM_CORE, "esm-core")),
        ...(await smokeEsm(ESM_SHARED, "esm-shared")),
      ];

  if (json) {
    console.log(JSON.stringify({ contracts: results, smokes }, null, 2));
  } else {
    const icon = { ok: "✅", updated: "🔄", created: "🆕", broken: "❌", error: "💥" };
    for (const r of results) {
      console.log(`${icon[r.status] ?? "•"} ${r.tag}${r.status === "broken" ? " — ROTO" : ""}`);
      for (const d of r.diffs ?? []) console.log(`     ${d}`);
    }
    for (const s of smokes) {
      console.log(
        s.ok
          ? `✅ ${s.file} → ${s.tag}`
          : `❌ ${s.file} — ROTO: ${s.error}`,
      );
    }
  }
  const smokeBroken = smokes.some((s) => !s.ok);
  if (results.some((r) => r.status === "broken" || r.status === "error") || smokeBroken) {
    process.exit(1);
  }
}
