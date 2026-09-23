// src/plugins/khadgar-docs/render.mjs — Render de una ficha `.md` desde el
// contrato JSON de Khadgar (`KhadgarComponent`).
//
// Consumidor puro: no lee SFCs ni el filesystem. Toma el componente ya extraído
// (con la prosa curada mergeada) y devuelve el markdown.

function cell(value) {
  return String(value ?? "").replace(/\|/g, "\\|").trim();
}

function fmtType(value) {
  if (!value || value === "—") return "—";
  return `\`${value}\``;
}

function fmtDefault(value) {
  if (value === undefined) return "—";
  const text = String(value);
  if (text === "true" || text === "false" || text === "null" || /^-?\d+(\.\d+)?$/.test(text)) {
    return `\`${text}\``;
  }
  if (/^[[{]/.test(text)) return `\`${text}\``;
  return `\`"${text}"\``;
}

function fmtPayload(value) {
  if (!value || value === "() => void") return "—";
  return `\`${value}\``;
}

/** Parámetros de una firma `(a, b) => ...` (paréntesis balanceados). */
function paramsOf(type) {
  if (!type || type[0] !== "(") return null;
  let depth = 0;
  for (let i = 0; i < type.length; i++) {
    if (type[i] === "(") depth++;
    else if (type[i] === ")") {
      depth--;
      if (depth === 0) return type.slice(1, i).trim();
    }
  }
  return null;
}

/** ``.set(value: string)`` a partir de `name` + firma `(value: string) => void`. */
function methodLabel(row) {
  const params = paramsOf(row.type);
  return `\`.${row.name}${params ? `(${params})` : "()"}\``;
}

/** Valores de una unión de literales: `"a" | "b"` → `["a", "b"]`. */
function enumValues(type) {
  if (!type) return null;
  const parts = type.split("|").map((part) => part.trim());
  if (parts.length && parts.every((part) => /^"[^"]*"$/.test(part))) {
    return parts.map((part) => part.slice(1, -1));
  }
  return null;
}

/** Valor de ejemplo para un prop (para el snippet de uso en Vue). */
function sampleValue(prop) {
  const type = prop.type ?? "";
  const dflt = prop.default;
  const isQuoted = dflt !== undefined && !/^(true|false|null|-?\d)/.test(String(dflt));
  if (isQuoted) return String(dflt).replace(/^"|"$/g, "");
  const values = enumValues(type);
  if (values) return values[0];
  if (type === "boolean") return "true";
  if (type === "number") return "0";
  if (/\bstring\b/.test(type)) return "…";
  if (/Array|\[\]/.test(type)) return "[]";
  if (/Record|object/.test(type)) return "{}";
  return "…";
}

/** ¿El tipo es una estructura compleja (array/objeto)? */
function isComplex(type) {
  return /\b(Array|Record|object)\b|\[\]/.test(type ?? "");
}

/**
 * Bloque "Uso en Vue" autogenerado: import + ejemplo con props mínimas. Se
 * combina con las secciones `sectionsVue` curadas del sidecar.
 */
function vueUsage(component) {
  const file = component.file ?? "";
  const dir = file.replace(/^src\/components\//, "").replace(/\/[^/]+\.vue$/, "");
  const importPath = `@/components/${dir ? `${dir}/` : ""}${component.name}.vue`;
  const model = component.props.find((prop) => prop.name === "modelValue");
  const attrs = [];
  const complex = [];
  for (const prop of component.props) {
    if (prop.name === "modelValue") continue;
    // Booleanos: solo si son `true` por default.
    if (prop.type === "boolean") {
      if (prop.default === "true") attrs.push(prop.name);
      continue;
    }
    // Complejas (array/objeto): no se inventan en el ejemplo; van comentadas.
    if (isComplex(prop.type)) {
      complex.push(prop.name);
      continue;
    }
    // Enums y required sí (muestran las props relevantes); el resto de defaults
    // se omite para no ensuciar el ejemplo.
    if (enumValues(prop.type)) {
      attrs.push(`${prop.name}="${sampleValue(prop)}"`);
    } else if (prop.required) {
      attrs.push(`${prop.name}="${sampleValue(prop)}"`);
    }
  }
  const open = `<${component.name}${model ? ' v-model="value"' : ""}${attrs.length ? ` ${attrs.join(" ")}` : ""}>`;
  const lines = [
    `<script setup lang="ts">`,
    `import ${component.name} from "${importPath}";`,
  ];
  if (model) lines.push(`import { ref } from "vue";`, ``, `const value = ref("");`);
  if (complex.length) lines.push(`// props: ${complex.join(", ")}`);
  lines.push(
    `</script>`,
    ``,
    `<template>`,
    `  ${open}`,
    `    ${component.name}`,
    `  </${component.name}>`,
    `</template>`,
  );
  return ["## Uso en Vue", "", "```vue", ...lines, "```"].join("\n");
}

function table(headers, rows) {
  const head = `| ${headers.join(" | ")} |`;
  const sep = `|${headers.map(() => "------").join("|")}|`;
  const body = rows.map((row) => `| ${row.map(cell).join(" | ")} |`);
  return [head, sep, ...body].join("\n");
}

function apiSection(title, body, note) {
  const out = [`## ${title}`, "", body];
  if (note) out.push("", note.trim());
  return out.join("\n");
}

/**
 * Renderiza la ficha de un componente.
 *
 * @param {import("../khadgar/api").KhadgarComponent} component
 * @param {object} [options]
 * @param {"vue"|"vanilla"} [options.mode] Tipo de ficha. `vanilla` incluye las
 *   secciones curadas (ej. "Uso en HTML plano"); `vue` solo la API.
 * @param {string} [options.backlink] Link "volver". `null` lo omite.
 *   Default: `../SKILL.md`.
 * @param {boolean} [options.includeSections] Forzar secciones. Default: `mode === "vanilla"`.
 * @returns {string} markdown
 */
export function renderDoc(component, options = {}) {
  const mode = options.mode ?? "vanilla";
  const includeSections = options.includeSections ?? mode === "vanilla";
  const backlink = options.backlink === undefined ? "../SKILL.md" : options.backlink;
  const out = [];
  const notes = component.notes ?? {};

  const title = mode === "vue" ? component.name : `<${component.tag}>`;
  out.push(`# \`${title}\``, "");
  if (component.description) out.push(component.description, "");
  if (backlink) out.push(`[← Volver](${backlink})`, "");
  out.push("---", "");

  if (includeSections) {
    for (const section of component.sections ?? []) {
      out.push("---", "", `## ${section.title}`, "", section.body.trim(), "");
    }
  } else {
    // Vista Vue: bloque de uso autogenerado + secciones curadas de Vue.
    out.push(vueUsage(component), "");
    for (const section of component.sectionsVue ?? []) {
      out.push("---", "", `## ${section.title}`, "", section.body.trim(), "");
    }
  }

  const payloadHeader = mode === "vanilla" ? "Payload (`e.detail`)" : "Payload";
  const propsHeader = mode === "vanilla" ? "Atributo" : "Prop";

  if (component.props.length) {
    const rows = component.props.map((prop) => [
      `\`${prop.name}\``,
      fmtType(prop.type),
      fmtDefault(prop.default),
      prop.description ?? "",
    ]);
    out.push(apiSection("Props", table([propsHeader, "Tipo", "Default", "Descripción"], rows), notes.props), "");
  } else if (notes.props) {
    out.push(apiSection("Props", notes.props), "");
  }

  if (component.events.length) {
    const rows = component.events.map((event) => [
      `\`${event.name}\``,
      fmtPayload(event.type),
      event.description ?? "",
    ]);
    out.push(
      apiSection("Eventos", table(["Evento", payloadHeader, "Descripción"], rows), notes.events),
      "",
    );
  } else if (notes.events) {
    out.push(apiSection("Eventos", notes.events), "");
  }

  if (component.slots.length) {
    const rows = component.slots.map((slot) => [`\`${slot.name}\``, slot.description ?? ""]);
    out.push(apiSection("Slots", table(["Slot", "Descripción"], rows), notes.slots), "");
  } else if (notes.slots) {
    out.push(apiSection("Slots", notes.slots), "");
  }

  if (component.exposed.length) {
    const rows = component.exposed.map((item) => [methodLabel(item), item.description ?? ""]);
    out.push(
      apiSection("Métodos expuestos", table(["Método", "Descripción"], rows), notes.exposes),
      "",
    );
  } else if (notes.exposes) {
    out.push(apiSection("Métodos expuestos", notes.exposes), "");
  }

  if (component.interfaces?.length) {
    out.push("## Interfaces", "");
    for (const item of component.interfaces) {
      out.push(`### \`${item.name}\``, "");
      if (item.description) out.push(item.description, "");
      out.push("```ts", item.code.trim(), "```", "");
    }
  }

  return `${out.join("\n").replace(/\n{3,}/g, "\n\n").trimEnd()}\n`;
}
