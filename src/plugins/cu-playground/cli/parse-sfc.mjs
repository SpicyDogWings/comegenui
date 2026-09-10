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

function parseProps(source, compiled) {
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

  const props = [];
  for (const entry of splitTopLevel(block)) {
    const match = entry.match(/^\s*([\w$]+)\s*:\s*([\s\S]+)$/);
    if (!match) continue;
    const [, name, rest] = match;
    const validator = rest.match(/validator:[\s\S]*?\[([^\]]*)\]/);
    const union = rest.match(/PropType\s*<([^>]*)>/);
    const values = valuesOf(validator?.[1] ?? union?.[1] ?? "").filter(Boolean);
    const prop = { name, type: values.length ? values.join(" | ") : "—", kind: propKind(rest, values) };
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

function parseEmits(source, compiled) {
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

  return [...emits].map(([name, payload]) => ({ name, type: payload || "() => void" }));
}

// ── Exposes ─────────────────────────────────────────────────────────────────

function parseExposes(source) {
  const match = /defineExpose\s*\(/.exec(source);
  if (!match) return [];
  const start = source.indexOf("{", match.index);
  const balanced = start >= 0 ? readBalanced(source, start) : null;
  if (!balanced) return [];
  const inner = balanced.slice(1, -1);
  const names = new Set();
  for (const entry of splitTopLevel(inner)) {
    const key = entry.match(/^\s*(?:\.\.\.)?([\w$]+)/);
    if (key) names.add(key[1]);
  }
  return [...names].map((name) => ({ name: `${name}()`, type: "() => void" }));
}

// ── Slots ───────────────────────────────────────────────────────────────────

function parseSlots(descriptor) {
  const template = descriptor.template?.content ?? "";
  const names = new Set();
  for (const match of template.matchAll(/<template\s+([^>]*)>/g)) {
    const attrs = match[1];
    const named = attrs.match(/(?:#|v-slot:)([\w-]+)/);
    if (named) names.add(named[1]);
    else if (/#default|v-slot(?!=)/.test(attrs)) names.add("default");
  }
  for (const match of template.matchAll(/<slot\b([^>]*)>/g)) {
    const attrs = match[1];
    const named = attrs.match(/name\s*=\s*["']([\w-]+)["']/);
    if (named) names.add(named[1]);
    else if (!/\bname=/.test(attrs)) names.add("default");
  }
  return [...names].map((name) => ({ name }));
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

function parseComponentImports(source) {
  const deps = [];
  const seen = new Set();
  // Imports locales de componentes: `@/components/...` o relativos (`./Button.vue`).
  const re = /import\s+(\w+)\s+from\s+["'](?:@\/components\/|\.{1,2}\/)([^"']+)\.vue["']/g;
  let match;
  while ((match = re.exec(source))) {
    const [, name, spec] = match;
    if (spec.includes("icons") || spec.includes("customElements")) continue;
    const base = spec.split("/").pop();
    if (!base || name === "Icon" || seen.has(name)) continue;
    seen.add(name);
    deps.push({ label: name, path: `/playground/components/${kebab(base)}` });
  }
  return deps;
}

// ── API pública ─────────────────────────────────────────────────────────────

/**
 * Parsea un componente `.vue` y devuelve su contrato.
 *
 * @param {string} filePath ruta del `.vue`
 * @param {string} [source] contenido (si ya se leyó)
 */
export function parseComponent(filePath, source = readFileSync(filePath, "utf-8")) {
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
  const props = parseProps(script, compiled);
  const emits = parseEmits(script, compiled);

  // `defineModel` agrega una prop `modelValue` y un emit `update:modelValue`
  // que no aparecen en `defineProps`/`defineEmits`.
  if (/defineModel\b/.test(script)) {
    const model = /defineModel\s*<([^>]*)>/.exec(script);
    if (!props.some((prop) => prop.name === "modelValue")) {
      props.unshift({ name: "modelValue", type: model?.[1]?.trim() || "unknown", kind: "unknown" });
    }
    if (!emits.some((emit) => emit.name === "update:modelValue")) {
      emits.unshift({ name: "update:modelValue", type: "(value) => void" });
    }
  }

  return {
    props,
    emits,
    exposes: parseExposes(script),
    slots,
    tokens: parseTokens(descriptor, source),
    components: parseComponentImports(script),
    hasDefaultSlot: slots.some((slot) => slot.name === "default"),
  };
}
