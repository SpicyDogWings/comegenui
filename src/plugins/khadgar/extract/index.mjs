// src/plugins/khadgar/extract/index.mjs — Extractor de Khadgar.
//
// Dado un `.vue`, devuelve el contrato JSON (`KhadgarComponent`): props, events,
// slots y exposed vía `vue-component-meta`; tokens, clases, interfaces y deps
// vía complementos propias; y overrides curados vía un sidecar opcional.
//
// Es puro: no renderiza, no genera `.md`, no conoce el playground.
import { existsSync, readFileSync } from "node:fs";
import { basename, relative, resolve, sep } from "node:path";
import fg from "fast-glob";
import { getChecker } from "./checker.mjs";
import { buildLibIndex } from "./lib-index.mjs";
import { complements } from "./complements.mjs";

/** Versión del contrato JSON. */
export const CONTRACT_VERSION = "2.0.0";

const IGNORE = [
  "**/customElements/**",
  "**/icons/**",
  "**/lab/**",
  "**/legacy/**",
  "**/archived/**",
];

const posix = (p) => p.split(sep).join("/");

/** `Button` → `button`, `DatePicker` → `date-picker`. */
function kebab(value) {
  return value
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();
}

/** Saca `| undefined` de un tipo opcional. */
function stripUndefined(type) {
  if (!type) return "unknown";
  const clean = type
    .replace(/\s*\|\s*undefined\b/g, "")
    .replace(/\bundefined\s*\|\s*/g, "")
    .trim();
  return clean || "unknown";
}

/** Normaliza el `default` de vcm: `"neutral"` → `neutral`, `'button'` → `button`. */
function cleanDefault(value) {
  if (value === undefined) return undefined;
  let out = String(value).trim();
  if (/^(['"`]).*\1$/.test(out)) out = out.slice(1, -1);
  return out;
}

/** Deriva el tipo de un evento a partir de la firma de vcm. */
function eventType(event) {
  const type = event.type ?? "";
  if (!type || type === "any[]") return "() => void";
  const inner = type.replace(/^\[|\]$/g, "").trim();
  return inner ? `(${inner}) => void` : "() => void";
}

/** Normaliza el `type` de un evento a firma de handler: `boolean` → `(boolean) => void`. */
function asSignature(type) {
  const t = String(type ?? "").trim();
  if (!t) return "() => void";
  if (t.includes("=>") || /^function\b/.test(t)) return t;
  if (t === "void" || t === "undefined") return "() => void";
  return `(${t}) => void`;
}

/** Normaliza una entrada del sidecar: string → `{ description }`. */
function overrideOf(entry) {
  if (entry == null) return {};
  if (typeof entry === "string") return { description: entry };
  return entry;
}

function propRow(prop, override) {
  const row = {
    name: prop.name,
    type: override.type ?? stripUndefined(prop.type),
    required: Boolean(prop.required),
  };
  const def = override.default ?? cleanDefault(prop.default);
  if (def !== undefined && def !== "") row.default = def;
  const description = override.description || prop.description;
  if (description) row.description = description;
  if (prop.tags?.length) row.tags = prop.tags;
  return row;
}

function eventRow(event, override) {
  const row = { name: event.name, type: override.type ? asSignature(override.type) : eventType(event) };
  const description = override.description || event.description;
  if (description) row.description = description;
  if (event.tags?.length) row.tags = event.tags;
  return row;
}

function slotRow(slot, override) {
  const row = { name: slot.name };
  const type = override.type ?? (slot.type && slot.type !== "{}" ? slot.type : undefined);
  if (type) row.type = type;
  const description = override.description || slot.description;
  if (description) row.description = description;
  return row;
}

function exposeRow(expose, override) {
  const row = { name: expose.name, type: override.type ?? expose.type };
  const description = override.description || expose.description;
  if (description) row.description = description;
  return row;
}

/** Categoría = subcarpeta inmediata bajo `componentsDir` (o "" en la raíz). */
function categoryOf(abs, root, componentsDir) {
  const rel = posix(relative(resolve(root, componentsDir ?? "src/components"), abs));
  const parts = rel.split("/");
  return parts.length > 1 ? parts[0] : "";
}

/** Aplica `include`/`exclude` (por nombre) a una lista de filas. */
function filterRows(rows, item) {
  let out = rows;
  if (item.exclude?.length) {
    const drop = new Set(item.exclude);
    out = out.filter((row) => !drop.has(row.name));
  }
  if (item.include?.length) {
    const keep = new Set(item.include);
    out = out.filter((row) => keep.has(row.name));
  }
  return out;
}

/**
 * Extrae el contrato de un `.vue`.
 *
 * @param {string} filePath ruta (relativa a `root` o absoluta).
 * @param {object} [options]
 * @param {string} [options.root] raíz del proyecto.
 * @param {object} [options.config] config resuelta.
 * @param {Map<string,string>} [options.libIndex] `.vue` abs → tag.
 * @param {Set<string>} [options.componentNames] nombres válidos para deps.
 * @param {object|null} [options.sidecar] override curado.
 * @param {object} [options.item] `ComponentConfig` (include/exclude/extract).
 * @param {object} [options.checker] checker de vcm (default: singleton).
 */
export function extractComponent(filePath, options = {}) {
  const {
    root = process.cwd(),
    config = {},
    libIndex = new Map(),
    componentNames = new Set(),
    sidecar = null,
    item = {},
  } = options;

  const abs = resolve(root, filePath);
  const checker = options.checker ?? getChecker(root, config.tsconfig);
  const meta = checker.getComponentMeta(abs);
  const source = readFileSync(abs, "utf-8");
  const comp = complements(abs, source, config.base);

  const extract = {
    tokens: true,
    classes: true,
    interfaces: true,
    deps: true,
    ...(config.extract ?? {}),
    ...(item.extract ?? {}),
  };

  const name = basename(abs).replace(/\.vue$/, "");
  const tag = libIndex.get(abs);
  const overrides = sidecar ?? {};

  const props = filterRows(
    meta.props.filter((p) => !p.global).map((p) => propRow(p, overrideOf(overrides.props?.[p.name]))),
    item,
  );
  const events = filterRows(
    meta.events.map((e) => eventRow(e, overrideOf(overrides.events?.[e.name]))),
    item,
  );
  const slots = filterRows(
    meta.slots.map((s) => slotRow(s, overrideOf(overrides.slots?.[s.name]))),
    item,
  );
  const exposed = filterRows(
    meta.exposed.map((x) => exposeRow(x, overrideOf(overrides.exposes?.[x.name]))),
    item,
  );

  const deps = extract.deps
    ? comp.deps.filter((dep) => dep !== name && componentNames.has(dep))
    : [];

  const component = {
    name,
    category: categoryOf(abs, root, config.componentsDir),
    file: posix(relative(root, abs)),
    description: overrides.intro || meta.description || "",
    props,
    events,
    slots,
    exposed,
    tokens: extract.tokens ? comp.tokens : [],
    classes: extract.classes ? comp.classes : [],
    interfaces: extract.interfaces ? comp.interfaces : [],
    deps,
  };

  if (tag) component.tag = tag;
  if (overrides.notes && Object.keys(overrides.notes).length) component.notes = overrides.notes;
  if (overrides.sections?.length) component.sections = overrides.sections;

  return component;
}

/** Busca el `.vue` de un componente por nombre dentro de `componentsDir`. */
function findFile(root, componentsDir, name) {
  const matches = fg.sync(`${componentsDir}/**/${name}.vue`, {
    cwd: root,
    absolute: true,
    ignore: IGNORE,
  });
  return matches[0] ?? null;
}

/** Lista de componentes a procesar (config explícita o glob de fallback). */
function resolveList(root, config, components) {
  const componentsDir = config.componentsDir ?? "src/components";
  const configured = components ?? config.components ?? [];
  if (!configured.length) {
    return fg
      .sync(`${componentsDir}/**/*.vue`, { cwd: root, absolute: true, ignore: IGNORE })
      .map((file) => ({ name: basename(file).replace(/\.vue$/, ""), file }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }
  const out = [];
  for (const entry of configured) {
    if (entry.json === false) continue;
    const file = entry.file ? resolve(root, entry.file) : findFile(root, componentsDir, entry.name);
    if (file && existsSync(file)) out.push({ ...entry, file });
  }
  return out;
}

/** Carga el sidecar curado de un componente (`docsDir/componentes/<tag>.doc.json`). */
function loadSidecar(root, config, tag) {
  if (!tag) return null;
  const docsDir = config.docsDir ?? "docs/skills/use-comegen";
  const file = resolve(root, docsDir, "componentes", `${tag}.doc.json`);
  if (!existsSync(file)) return null;
  try {
    return JSON.parse(readFileSync(file, "utf-8"));
  } catch {
    return null;
  }
}

/**
 * Construye el índice completo (`KhadgarIndex`).
 *
 * @param {object} [options]
 * @param {string} [options.root] raíz del proyecto.
 * @param {object} [options.config] config resuelta.
 * @param {Array<object>} [options.components] lista explícita (si no, `config.components`).
 */
export function buildIndex(options = {}) {
  const { root = process.cwd(), config = {} } = options;
  const libIndex = options.libIndex ?? buildLibIndex(root, config.libDir ?? "src/lib");
  const checker = options.checker ?? getChecker(root, config.tsconfig);
  const list = resolveList(root, config, options.components);
  const componentNames = new Set(list.map((item) => item.name));

  const components = list.map((item) => {
    const abs = resolve(root, item.file);
    const sidecar = item.sidecar ?? loadSidecar(root, config, libIndex.get(abs));
    return extractComponent(item.file, {
      root,
      config,
      libIndex,
      componentNames,
      sidecar,
      item,
      checker,
    });
  });

  return {
    version: CONTRACT_VERSION,
    generatedAt: new Date().toISOString(),
    components,
  };
}
