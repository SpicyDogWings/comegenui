// src/plugins/cu-playground/cli/parse-sfc.mjs — Parser de un componente `.vue`.
//
// Extrae props, emits, exposes, slots, tokens (CSS vars) y sub-componentes
// importados. Usa `vue/compiler-sfc` para resolver los macros (`defineProps`,
// `defineEmits`, `defineExpose`, `defineModel`) y regex para template/style.
import { readFileSync } from "node:fs";
import { parse, compileScript } from "vue/compiler-sfc";

const PAIRS = { "[": "]", "{": "}", "(": ")" };

function skipQuoted(src, start, quote) {
  for (let i = start + 1; i < src.length; i++) {
    if (src[i] === "\\") {
      i++;
      continue;
    }
    if (src[i] === quote) return i;
  }
  return src.length;
}

/** Devuelve el substring desde `start` (un bracket) hasta su cierre, inclusive. */
function readBalanced(src, start) {
  const close = PAIRS[src[start]];
  if (!close) return null;
  const stack = [];
  for (let i = start; i < src.length; i++) {
    const char = src[i];
    if (char === "`") {
      i = skipQuoted(src, i, "`");
      continue;
    }
    if (char === '"' || char === "'") {
      i = skipQuoted(src, i, char);
      continue;
    }
    if (PAIRS[char]) stack.push(PAIRS[char]);
    else if (stack.length && char === stack[stack.length - 1]) {
      stack.pop();
      if (!stack.length) return src.slice(start, i + 1);
    }
  }
  return null;
}

/** Separa un bloque por comas de primer nivel. */
function splitTopLevel(block) {
  const parts = [];
  let depth = 0;
  let current = "";
  let quote = null;
  for (let i = 0; i < block.length; i++) {
    const char = block[i];
    if (quote) {
      current += char;
      if (char === "\\") {
        current += block[++i] ?? "";
        continue;
      }
      if (char === quote) quote = null;
      continue;
    }
    if (char === '"' || char === "'" || char === "`") {
      quote = char;
      current += char;
      continue;
    }
    if (PAIRS[char]) depth++;
    else if ("}])".includes(char)) depth--;
    if (char === "," && depth === 0) {
      parts.push(current);
      current = "";
    } else {
      current += char;
    }
  }
  if (current.trim()) parts.push(current);
  return parts;
}

/** Todos los strings entrecomillados de un fragmento. */
function valuesOf(text) {
  return [...text.matchAll(/'([^']*)'|"([^"]*)"/g)].map((m) => m[1] ?? m[2]);
}

/** Extrae el valor de `key:` de un texto de opciones (`type`, `default`, …). */
function optionValue(rest, key) {
  const match = new RegExp(`${key}\\s*:\\s*`).exec(rest);
  if (!match) return undefined;
  const start = match.index + match[0].length;
  const trimmed = rest.slice(start);
  const offset = trimmed.search(/\S/);
  if (offset < 0) return undefined;
  const valueStart = start + offset;
  const first = rest[valueStart];
  if (first === '"' || first === "'" || first === "`") {
    const end = skipQuoted(rest, valueStart, first);
    return rest.slice(valueStart, end + 1);
  }
  if ("[{(".includes(first)) {
    const balanced = readBalanced(rest, valueStart);
    if (balanced) return balanced;
  }
  return rest.slice(valueStart).split(/[,\n}]/)[0].trim();
}

// ── JSDoc ───────────────────────────────────────────────────────────────────

/** Limpia un bloque JSDoc: saca `*`, tags y colapsa el primer párrafo. */
function cleanJsDoc(raw) {
  const lines = raw.split("\n").map((line) => line.replace(/^\s*\*+\s?/, "").trim());
  const paragraph = [];
  for (const line of lines) {
    if (/^@\w/.test(line)) break;
    if (!line) {
      if (paragraph.length) break;
      continue;
    }
    paragraph.push(line);
  }
  return paragraph.join(" ").trim();
}

/**
 * Mapa nombre → descripción JSDoc. Cubre miembros de objeto/TS
 * (`/** … *​/ color?:`), firmas de emit (`/** … *​/ (e: 'save')`) y
 * declaraciones (`/** … *​/ export interface X`).
 */
function parseJsDocs(script) {
  const docs = new Map();
  const put = (raw, name) => {
    const text = cleanJsDoc(raw);
    if (text && name && !docs.has(name)) docs.set(name, text);
  };
  const member =
    /\*\*((?:(?!\*\/)[\s\S])*)\*\/\s*(?:export\s+)?(?:function\s+|const\s+|let\s+|var\s+)?(?:readonly\s+)?([\w$]+)\s*[?:(:=,}]/g;
  for (const match of script.matchAll(member)) put(match[1], match[2]);
  const emitSig = /\*\*((?:(?!\*\/)[\s\S])*)\*\/\s*\(\s*e\s*:\s*['"]([^'"]+)['"]/g;
  for (const match of script.matchAll(emitSig)) put(match[1], match[2]);
  const emitEntry = /\*\*((?:(?!\*\/)[\s\S])*)\*\/\s*['"]([\w:.-]+)['"]\s*[,)\]]/g;
  for (const match of script.matchAll(emitEntry)) put(match[1], match[2]);
  const decl = /\*\*((?:(?!\*\/)[\s\S])*)\*\/\s*(?:export\s+)?(?:interface|type)\s+([\w$]+)/g;
  for (const match of script.matchAll(decl)) put(match[1], match[2]);
  return docs;
}

// ── Interfaces / types ───────────────────────────────────────────────────────

/** Texto de los macros de API (`defineProps`/`defineEmits`/…) para saber qué tipos son públicos. */
function apiSurfaceText(script) {
  const parts = [];
  for (const match of script.matchAll(/define(Props|Emits|Model|Expose|Slots)\b/g)) {
    const brace = script.indexOf("{", match.index);
    const paren = script.indexOf("(", match.index);
    const candidates = [brace, paren].filter((i) => i >= 0 && i < match.index + 800);
    if (!candidates.length) continue;
    const balanced = readBalanced(script, Math.min(...candidates));
    if (balanced) parts.push(balanced);
  }
  return parts.join("\n");
}

/** Interfaces y type-aliases con cuerpo de objeto, en orden de aparición. */
function parseInterfaces(script, docs) {
  const surface = apiSurfaceText(script);
  const decls = [];
  const seen = new Set();
  const re = /(?:^|\n)[ \t]*(export[ \t]+)?(interface|type)[ \t]+([\w$]+)/g;
  for (const match of script.matchAll(re)) {
    const name = match[3];
    if (seen.has(name)) continue;
    const declStart = match.index + (match[0].startsWith("\n") ? 1 : 0) + (match[0].match(/^[ \t]*/)?.[0].length ?? 0);
    const open = script.indexOf("{", match.index);
    if (open < 0) continue;
    const head = script.slice(declStart, open).trimEnd();
    const isInterface = /^(?:export\s+)?interface\s+[\w$]+/.test(head);
    const isObjectType = /^(?:export\s+)?type\s+[\w$]+\s*(?:<[^>]*>)?\s*=\s*$/.test(head);
    if (!isInterface && !isObjectType) continue;
    const body = readBalanced(script, open);
    if (!body) continue;
    seen.add(name);
    decls.push({
      name,
      code: `${head} ${body}`,
      description: docs.get(name),
      exported: /^export\b/.test(head),
    });
  }

  // Solo tipos que son parte de la API: exportados, documentados o usados en un
  // macro; se expande a los tipos referenciados por esos (ej. FooterCell).
  const included = new Set();
  const queue = decls.filter(
    (item) =>
      item.exported || item.description || new RegExp(`\\b${item.name}\\b`).test(surface),
  );
  while (queue.length) {
    const item = queue.shift();
    if (included.has(item.name)) continue;
    included.add(item.name);
    for (const other of decls) {
      if (!included.has(other.name) && new RegExp(`\\b${other.name}\\b`).test(item.code)) {
        queue.push(other);
      }
    }
  }
  return decls.filter((item) => included.has(item.name));
}

// ── Clases CSS ───────────────────────────────────────────────────────────────

/** Clases `cu-*` definidas en los `<style>` del componente. */
function parseClasses(descriptor) {
  const classes = new Set();
  for (const style of descriptor.styles ?? []) {
    for (const match of (style.content ?? "").matchAll(/\.(-?cu-[\w-]+)/g)) classes.add(match[1]);
  }
  return [...classes].sort();
}

// ── Props ───────────────────────────────────────────────────────────────────

function propKind(rest, values) {
  if (values.length) return "enum";
  if (/\bBoolean\b/.test(rest)) return "boolean";
  if (/\bNumber\b/.test(rest)) return "number";
  if (/\bArray\b/.test(rest)) return "array";
  if (/\bObject\b/.test(rest)) return "object";
  if (/\bString\b/.test(rest)) return "string";
  return "unknown";
}

function parseProps(source, compiled, docs) {
  let block = null;
  const compiledMatch = compiled ? /props\s*:\s*\{/.exec(compiled) : null;
  if (compiledMatch) {
    const start = compiled.indexOf("{", compiledMatch.index);
    block = readBalanced(compiled, start);
    if (block) block = block.slice(1, -1);
  }
  if (!block) {
    const idx = source.indexOf("defineProps");
    if (idx >= 0) {
      const paren = source.indexOf("(", idx);
      const start = source.indexOf("{", paren);
      const balanced = start >= 0 ? readBalanced(source, start) : null;
      if (balanced) block = balanced.slice(1, -1);
    }
  }
  if (!block) return [];
  block = block.replace(/\/\*[\s\S]*?\*\//g, "");

  const props = [];
  for (const entry of splitTopLevel(block)) {
    const match = entry.match(/^\s*([\w$]+)\s*:\s*([\s\S]+)$/);
    if (!match) continue;
    const [, name, rest] = match;
    const validator = rest.match(/validator:[\s\S]*?\[([^\]]*)\]/);
    const union = rest.match(/PropType\s*<([^>]*)>/);
    const values = valuesOf(validator?.[1] ?? union?.[1] ?? "").filter(Boolean);
    const prop = { name, type: values.length ? values.join(" | ") : "—", kind: propKind(rest, values) };
    const description = docs?.get(name);
    if (description) prop.description = description;
    if (values.length) prop.values = values;
    if (/required\s*:\s*true/.test(rest)) prop.required = true;
    const def = optionValue(rest, "default");
    if (def !== undefined && !def.startsWith("(")) {
      prop.default = def.replace(/^["'`]|["'`]$/g, "");
    }
    const type = rest.match(/type\s*:\s*([^,\n]+)/);
    if (type && !values.length) {
      const raw = type[1].trim();
      prop.type = { String: "string", Number: "number", Boolean: "boolean", Array: "array", Object: "object" }[raw] ?? raw;
    }
    props.push(prop);
  }
  return props;
}

// ── Emits ───────────────────────────────────────────────────────────────────

function parseEmits(source, compiled, docs) {
  const emits = new Map();
  const add = (name, payload) => {
    if (name && !emits.has(name)) emits.set(name, payload);
  };

  // compiled: emits: ["a", "b"] | emits: { a: null, b: ... }
  const match = compiled ? /emits\s*:\s*(\[[\s\S]*?\]|\{[\s\S]*?\})/.exec(compiled) : null;
  if (match) {
    if (match[0].includes("[")) {
      valuesOf(match[0]).forEach((name) => add(name));
    } else {
      const inner = match[0].slice(match[0].indexOf("{") + 1, match[0].lastIndexOf("}"));
      for (const entry of splitTopLevel(inner)) {
        const key = entry.match(/^\s*["']?([\w:.-]+)["']?\s*:/);
        if (key) add(key[1]);
      }
    }
  }

  // source: defineEmits<{ (e: 'x', value: number): void }>() | defineEmits(['x'])
  const typed = /defineEmits\s*<([\s\S]*?)>\s*\(/g;
  let t;
  while ((t = typed.exec(source))) {
    for (const sig of t[1].matchAll(/\(?\s*e\s*:\s*['"]([^'"]+)['"]([^)]*)\)?/g)) {
      const payload = sig[2]
        .replace(/^[^:]*:/, "")
        .replace(/\)\s*=>\s*void.*$/, "")
        .trim();
      if (sig[1]) add(sig[1], payload && !payload.startsWith(")") ? payload : undefined);
    }
  }
  const arrays = /defineEmits(?!\s*<)\s*\(\s*\[([^\]]*)\]/.exec(source);
  if (arrays) valuesOf(arrays[1]).forEach((name) => add(name));

  return [...emits].map(([name, payload]) => {
    const row = { name, type: payload || "() => void" };
    const description = docs?.get(name);
    if (description) row.description = description;
    return row;
  });
}

// ── Exposes ─────────────────────────────────────────────────────────────────

function parseExposes(source, docs) {
  const match = /defineExpose\s*\(/.exec(source);
  if (!match) return [];
  const start = source.indexOf("{", match.index);
  const balanced = start >= 0 ? readBalanced(source, start) : null;
  if (!balanced) return [];
  const inner = balanced.slice(1, -1).replace(/\/\*[\s\S]*?\*\//g, "");
  const names = new Set();
  for (const entry of splitTopLevel(inner)) {
    const key = entry.match(/^\s*(?:\.\.\.)?([\w$]+)/);
    if (key) names.add(key[1]);
  }
  return [...names].map((name) => {
    const row = { name: `${name}()`, type: "() => void" };
    const description = docs?.get(name);
    if (description) row.description = description;
    return row;
  });
}

// ── Slots ───────────────────────────────────────────────────────────────────

/**
 * Slots declarados por el componente (`<slot>`), no los `<template #x>` que
 * pasan contenido a un hijo. Un comentario HTML inmediatamente anterior
 * (`<!-- descripción -->`) se usa como descripción del slot.
 */
function parseSlots(descriptor) {
  const template = descriptor.template?.content ?? "";
  const slots = new Map();
  for (const match of template.matchAll(/(?:<!--([\s\S]*?)-->\s*)?<slot\b([^>]*)>/g)) {
    const comment = match[1] ? match[1].replace(/\s+/g, " ").trim() : undefined;
    const attrs = match[2];
    if (/[:@]name\s*=/.test(attrs)) continue; // nombre dinámico: no inferible
    const literal = attrs.match(/\bname\s*=\s*["']([\w-]+)["']/);
    const name = literal ? literal[1] : "default";
    if (!slots.has(name) || comment) slots.set(name, comment);
  }
  return [...slots].map(([name, description]) => ({
    name,
    ...(description ? { description } : {}),
  }));
}

// ── Tokens (CSS vars) ───────────────────────────────────────────────────────

function parseTokens(descriptor, source) {
  const tokens = new Set();
  const collect = (css) => {
    for (const match of css.matchAll(/var\(\s*(--[\w-]+)/g)) tokens.add(match[1]);
    for (const match of css.matchAll(/(^|[;{\s])(--[\w-]+)\s*:/g)) tokens.add(match[2]);
  };
  for (const style of descriptor.styles ?? []) collect(style.content ?? "");
  collect(source);
  return [...tokens].filter((token) => !token.endsWith("-")).sort();
}

// ── Sub-componentes importados ──────────────────────────────────────────────

function kebab(value) {
  return value
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();
}

function parseComponentImports(source, base) {
  const deps = [];
  const seen = new Set();
  const routeBase = (base ?? "/playground/components").replace(/\/+$/, "");
  // Imports locales de componentes: `@/components/...` o relativos (`./Button.vue`).
  const re = /import\s+(\w+)\s+from\s+["'](?:@\/components\/|\.{1,2}\/)([^"']+)\.vue["']/g;
  let match;
  while ((match = re.exec(source))) {
    const [, name, spec] = match;
    if (spec.includes("icons") || spec.includes("customElements")) continue;
    const fileBase = spec.split("/").pop();
    if (!fileBase || name === "Icon" || seen.has(name)) continue;
    seen.add(name);
    deps.push({ label: name, path: `${routeBase}/${kebab(fileBase)}` });
  }
  return deps;
}

// ── API pública ─────────────────────────────────────────────────────────────

/**
 * Parsea un componente `.vue` y devuelve su contrato.
 *
 * @param {string} filePath ruta del `.vue`
 * @param {string} [source] contenido (si ya se leyó)
 * @param {string} [base] base de las rutas del playground (para deps)
 */
export function parseComponent(filePath, source = readFileSync(filePath, "utf-8"), base) {
  const { descriptor } = parse(source, { filename: filePath });
  const script = [
    descriptor.script?.content ?? "",
    descriptor.scriptSetup?.content ?? "",
  ].join("\n");

  let compiled = "";
  try {
    compiled = compileScript(descriptor, { id: "cu-playground" }).content;
  } catch {
    compiled = "";
  }

  const slots = parseSlots(descriptor);
  const docs = parseJsDocs(script);
  const props = parseProps(script, compiled, docs);
  const emits = parseEmits(script, compiled, docs);

  // `defineModel` agrega una prop y un emit `update:...` que no aparecen en
  // `defineProps`/`defineEmits`. El nombre sale del primer argumento
  // (`defineModel('query')` → `query`) y la descripción del JSDoc.
  if (/defineModel\b/.test(script)) {
    const call = /defineModel\s*(?:<([^>]*)>)?\s*\(\s*(?:['"]([\w$]+)['"])?/.exec(script);
    const modelType = call?.[1]?.trim() || "unknown";
    const modelName = call?.[2] || "modelValue";
    const assigned = /(?:const|let|var)\s+([\w$]+)\s*=\s*defineModel/.exec(script);
    const modelDoc = (assigned?.[1] && docs.get(assigned[1])) || docs.get(modelName);
    if (!props.some((prop) => prop.name === modelName)) {
      props.unshift({
        name: modelName,
        type: modelType,
        kind: "unknown",
        ...(modelDoc ? { description: modelDoc } : {}),
      });
    }
    if (!emits.some((emit) => emit.name === `update:${modelName}`)) {
      emits.unshift({
        name: `update:${modelName}`,
        type: "(value) => void",
        ...(modelDoc ? { description: modelDoc } : {}),
      });
    }
  }

  return {
    props,
    emits,
    exposes: parseExposes(script, docs),
    slots,
    interfaces: parseInterfaces(script, docs),
    classes: parseClasses(descriptor),
    tokens: parseTokens(descriptor, source),
    components: parseComponentImports(script, base),
    hasDefaultSlot: slots.some((slot) => slot.name === "default"),
  };
}
