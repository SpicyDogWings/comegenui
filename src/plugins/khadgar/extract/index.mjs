// src/plugins/khadgar/extract/index.mjs — Extractor de Khadgar.
//
// Dado un `.vue`, devuelve el contrato JSON (`KhadgarComponent`): props, events,
// slots y exposed vía `vue-component-meta`; tokens, clases, interfaces y deps
// vía complementos propias; y overrides curados vía un sidecar opcional.
//
// Es puro: no renderiza, no genera `.md`, no conoce el playground.
import { existsSync, readFileSync } from "node:fs";
import { basename, relative, resolve, sep } from "node:path";
import { getChecker } from "./checker.mjs";
import { buildLibTargetsByVue } from "./lib-index.mjs";
import { complements } from "./complements.mjs";

/** Versión del contrato JSON. */
export const CONTRACT_VERSION = "2.0.0";

const posix = (p) => p.split(sep).join("/");

/** `DatePicker` → `date-picker`. */
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

/** Payload de un evento (vcm da `[payload]` para tipados y `any[]` para sueltos). */
function eventPayload(event) {
  const type = event.type ?? "";
  if (!type || type === "any[]") return undefined;
  const inner = type.replace(/^\[|\]$/g, "").trim();
  return inner || undefined;
}

/** Normaliza una entrada del sidecar: string → `{ description }`. */
function overrideOf(entry) {
  if (entry == null) return {};
  if (typeof entry === "string") return { description: entry };
  return entry;
}

/** Posición de la declaración de una prop en el SFC (respeta el orden fuente). */
function declPos(prop, file) {
  try {
    const decl = prop.getDeclarations?.().find((item) => item.file === file);
    return decl?.range?.[0] ?? Number.MAX_SAFE_INTEGER;
  } catch {
    return Number.MAX_SAFE_INTEGER;
  }
}

/** Tipos primitivos que vcm devuelve cuando no puede resolver un `validator`. */
function isBare(type) {
  return type === "string" || type === "number" || type === "boolean";
}

function propRow(prop, override, fallback) {
  let type = override.type ?? stripUndefined(prop.type);
  // vcm no ve los `validator`; si el tipo quedó primitivo y parse-sfc tiene la
  // unión de valores válidos, se prefiere esa.
  if (!override.type && isBare(type) && fallback?.values?.length) {
    type = fallback.values.map((value) => `"${value}"`).join(" | ");
  }
  const row = {
    name: prop.name,
    type,
    required: Boolean(prop.required),
  };
  const def = override.default ?? cleanDefault(prop.default);
  if (def !== undefined) row.default = def;
  // JSDoc primario (vive en el SFC); el sidecar solo como fallback.
  const description = prop.description || override.description;
  if (description) row.description = description;
  if (prop.tags?.length) row.tags = prop.tags;
  return row;
}

function eventRow(event, override) {
  const payload = override.type ?? eventPayload(event);
  const row = { name: event.name };
  if (payload) row.type = payload;
  const description = override.description || event.description;
  if (description) row.description = description;
  if (event.tags?.length) row.tags = event.tags;
  return row;
}

/** Fila de un evento detectado por parse-sfc (wrapper CE: `ceEmit`), no por vcm. */
function complementEventRow(event, override) {
  const payload = override.type ?? (event.type && event.type !== "() => void" ? event.type : undefined);
  const row = { name: event.name };
  if (payload) row.type = payload;
  const description = override.description || event.description;
  if (description) row.description = description;
  return row;
}

/** Base name de un expose de parse-sfc (`set(value)` → `set`). */
function exposeName(name) {
  return name.replace(/\(.*$/, "").trim();
}

/**
 * Filas de `exposed`: la lista fiable es la de parse-sfc (lee el objeto
 * `defineExpose`); vcm aporta el tipo. Se agregan los de vcm que falten.
 */
function exposeRows(metaExposed, compExposes, overrides, item) {
  const byName = new Map(metaExposed.map((entry) => [entry.name, entry]));
  const rows = [];
  const seen = new Set();
  const push = (name, type, description) => {
    if (!name || seen.has(name)) return;
    seen.add(name);
    const row = { name, type: type ?? "() => void" };
    if (description) row.description = description;
    rows.push(row);
  };
  for (const entry of compExposes) {
    const name = exposeName(entry.name);
    const meta = byName.get(name);
    const override = overrideOf(overrides[name]);
    push(
      name,
      override.type ?? meta?.type ?? entry.type,
      entry.description || meta?.description || override.description,
    );
  }
  for (const meta of metaExposed) {
    const override = overrideOf(overrides[meta.name]);
    push(meta.name, override.type ?? meta.type, meta.description || override.description);
  }
  return filterRows(rows, item);
}

/**
 * Filas de `slots`: la lista fiable es la de parse-sfc (comentario HTML antes
 * del `<slot>`); vcm aporta el tipo del slot prop. Se agregan los de vcm que falten.
 */
function slotRows(metaSlots, compSlots, overrides, item) {
  const byName = new Map(metaSlots.map((slot) => [slot.name, slot]));
  const rows = [];
  const seen = new Set();
  const push = (name, type, description) => {
    if (!name || seen.has(name)) return;
    seen.add(name);
    const row = { name };
    if (type && type !== "{}") row.type = type;
    if (description) row.description = description;
    rows.push(row);
  };
  for (const entry of compSlots) {
    const meta = byName.get(entry.name);
    const override = overrideOf(overrides[entry.name]);
    push(
      entry.name,
      override.type ?? meta?.type,
      entry.description || meta?.description || override.description,
    );
  }
  for (const meta of metaSlots) {
    const override = overrideOf(overrides[meta.name]);
    push(meta.name, override.type ?? meta.type, meta.description || override.description);
  }
  return filterRows(rows, item);
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
  const comp = complements(abs, source);

  const extract = {
    tokens: true,
    classes: true,
    interfaces: true,
    deps: true,
    ...(config.extract ?? {}),
    ...(item.extract ?? {}),
  };

  const name =
    options.name ?? basename(abs).replace(/\.ce\.vue$/, "").replace(/\.vue$/, "");
  const tag = options.tag ?? libIndex.get(abs);
  const overrides = sidecar ?? {};

  const fallbackProps = new Map(comp.props.map((prop) => [prop.name, prop]));
  const props = filterRows(
    meta.props
      .filter((prop) => !prop.global)
      .slice()
      .sort((a, b) => declPos(a, abs) - declPos(b, abs))
      .map((prop) =>
        propRow(prop, overrideOf(overrides.props?.[prop.name]), fallbackProps.get(prop.name)),
      ),
    item,
  );
  const seenEvents = new Set(meta.events.map((event) => event.name));
  const events = filterRows(
    [
      ...meta.events.map((event) => eventRow(event, overrideOf(overrides.events?.[event.name]))),
      ...comp.emits
        .filter((event) => !seenEvents.has(event.name))
        .map((event) => complementEventRow(event, overrideOf(overrides.events?.[event.name]))),
    ],
    item,
  );
  const slots = slotRows(meta.slots, comp.slots, overrides.slots ?? {}, item);
  const exposed = exposeRows(meta.exposed, comp.exposes, overrides.exposes ?? {}, item);

  const deps = extract.deps
    ? comp.deps.filter((dep) => dep !== name && componentNames.has(dep))
    : [];

  const component = {
    name,
    slug: tag ?? kebab(name),
    group: options.group ?? "",
    file: posix(relative(root, abs)),
    description: overrides.intro || meta.description || "",
    customElement: options.customElement ?? Boolean(tag),
    skill: options.skill === true,
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

/** Lista de componentes a procesar (cada entrada apunta a un `.vue` via `file`). */
function resolveList(root, config, components) {
  const configured = components ?? config.components ?? [];
  const out = [];
  for (const entry of configured) {
    if (entry.json === false) continue;
    const file = entry.file ? resolve(root, entry.file) : null;
    if (file && existsSync(file)) out.push({ ...entry, file });
  }
  return out;
}

/**
 * Carga el sidecar curado de un componente (`docsDir/componentes/<slug>.doc.json`).
 * El `slug` es el tag (`cu-button`) si tiene custom element, o el kebab del nombre
 * (`dropdown`) para los componentes internos.
 */
function loadSidecar(root, config, slug) {
  if (!slug) return null;
  const docsDir = config.docsDir ?? "docs/skills/use-comegen";
  const file = resolve(root, docsDir, "componentes", `${slug}.doc.json`);
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
  const libDir = config.libDir ?? "src/lib";
  // `targetsByVue` guarda también el `sfc` distribuido (`.ce.vue` cuando existe):
  // de ahí sale el contrato vanilla, distinto del contrato Vue del `.vue`.
  const targetsByVue = options.targetsByVue ?? buildLibTargetsByVue(root, libDir);
  const libIndex =
    options.libIndex ?? new Map([...targetsByVue].map(([vue, target]) => [vue, target.tag]));
  const checker = options.checker ?? getChecker(root, config.tsconfig);
  const list = resolveList(root, config, options.components);
  const componentNames = new Set(list.map((item) => item.name));

  const components = list.map((item) => {
    const vueAbs = resolve(root, item.file);
    const target = targetsByVue.get(vueAbs);
    const tag = libIndex.get(vueAbs);
    const slug = tag ?? kebab(item.name);
    const sidecar = item.sidecar ?? loadSidecar(root, config, slug);
    // `customElement` del config es override; si se omite, se deriva del tag.
    let customElement = item.customElement ?? Boolean(tag);
    if (item.customElement === true && !tag) {
      console.warn(
        `khadgar: ${item.name} declara customElement:true pero no tiene tag en ${libDir}; se ignora.`,
      );
      customElement = false;
    }
    const component = extractComponent(vueAbs, {
      root,
      config,
      libIndex,
      componentNames,
      sidecar,
      item,
      checker,
      name: item.name,
      tag,
      group: item.group ?? "",
      customElement,
      skill: item.skill === true,
    });

    // El entry de la lib puede distribuir un `.ce.vue` distinto del `.vue` real
    // (otro ecosistema, otra API). Ese es el contrato vanilla.
    const sfc = target?.sfc;
    if (sfc && sfc !== vueAbs) {
      const vanilla = extractComponent(sfc, {
        root,
        config,
        libIndex,
        componentNames,
        sidecar,
        item,
        checker,
        name: item.name,
        tag,
        group: item.group ?? "",
        customElement: true,
        skill: false,
      });
      component.vanilla = {
        props: vanilla.props,
        events: vanilla.events,
        slots: vanilla.slots,
        exposed: vanilla.exposed,
        interfaces: vanilla.interfaces,
      };
    }

    return component;
  });

  return {
    version: CONTRACT_VERSION,
    generatedAt: new Date().toISOString(),
    components,
  };
}
