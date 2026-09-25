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
 * Resuelve una sección para una vista. `vanilla` usa `title`/`body`; `vue` usa
 * `titleVue`/`bodyVue` con fallback a los de vanilla.
 */
function sectionFor(section, view) {
  if (view === "vue") {
    return {
      title: section.titleVue ?? section.title,
      body: section.bodyVue ?? section.body,
    };
  }
  return { title: section.title, body: section.body };
}

/**
 * ¿La sección se pinta en la vista Vue? Sí si trae variante propia
 * (`titleVue`/`bodyVue`) o si es prosa sin bloques de código (donde el cuerpo
 * vanilla sirve igual). Las secciones con código y sin `bodyVue` se omiten, así
 * una ficha sin migrar no filtra ejemplos HTML.
 */
function hasVueVariant(section) {
  if (section.bodyVue || section.titleVue) return true;
  return !/```/.test(section.body ?? "");
}

/** ¿Alguna sección trae cuerpo Vue? Si no, la vista Vue usa el uso autogenerado. */
function isMigrated(sections) {
  return sections.some((section) => Boolean(section.bodyVue));
}

/** Secciones resueltas para la vista Vue. */
function vueSectionsOf(sections) {
  return sections.filter(hasVueVariant).map((section) => sectionFor(section, "vue"));
}

/**
 * Bloque ```vue de uso autogenerado: import + ejemplo con props mínimas. Solo se
 * usa como fallback cuando el componente no trae secciones Vue curadas.
 */
export function vueUsageBlock(component) {
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
  return ["```vue", ...lines, "```"].join("\n");
}

/** Sección "Uso en Vue" autogenerada. */
function vueUsage(component) {
  return ["## Uso en Vue", "", vueUsageBlock(component)].join("\n");
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
 * Sección de API: tabla si hay filas; si no, la nota curada o "Ninguno.". Así la
 * ficha siempre trae la plantilla base completa aunque falten filas.
 */
function apiOrEmpty(title, rows, tableMarkdown, note, empty = "Ninguno.") {
  if (rows.length) return apiSection(title, tableMarkdown, note);
  return apiSection(title, note ?? empty);
}

/**
 * Renderiza la ficha de un componente.
 *
 * @param {import("../khadgar/api").KhadgarComponent} component
 * @param {object} [options]
 * @param {"vue"|"vanilla"|"vanilla+vue"} [options.mode] Tipo de ficha. `vanilla`
 *   pinta las secciones curadas en su forma UMD; `vue` pinta la vista Vue (uso
 *   autogenerado como fallback + `bodyVue`/`titleVue`); `vanilla+vue` pinta
 *   vanilla y agrega un apartado "Vista Vue" (ficha canónica del zip).
 * @param {string} [options.backlink] Link "volver". `null` lo omite.
 *   Default: `../SKILL.md`.
 * @param {boolean} [options.includeSections] Forzar secciones. Default: `mode !== "vue"`.
 * @returns {string} markdown
 */
export function renderDoc(component, options = {}) {
  const mode = options.mode ?? "vanilla";
  const vueView = mode === "vue";
  const includeSections = options.includeSections ?? mode !== "vue";
  const backlink = options.backlink === undefined ? "../SKILL.md" : options.backlink;
  const out = [];
  const notes = component.notes ?? {};
  const sections = component.sections ?? [];

  const title = vueView ? component.name : `<${component.tag}>`;
  out.push(`# \`${title}\``, "");
  if (component.description) out.push(component.description, "");
  if (backlink) out.push(`[← Volver](${backlink})`, "");
  out.push("---", "");

  if (!includeSections) {
    // Vista Vue: secciones curadas en su forma Vue. Si la ficha aún no tiene
    // ningún `bodyVue`, se usa el uso autogenerado (no se filtra prosa suelta).
    if (isMigrated(sections)) {
      for (const view of vueSectionsOf(sections)) {
        out.push("---", "", `## ${view.title}`, "", (view.body ?? "").trim(), "");
      }
    } else {
      out.push(vueUsage(component), "");
    }
  } else {
    // Vanilla: secciones curadas en su forma UMD.
    for (const section of sections) {
      out.push("---", "", `## ${section.title}`, "", (section.body ?? "").trim(), "");
    }
    // Modo combinado (ficha canónica del zip): apartado Vue con las variantes Vue.
    if (mode === "vanilla+vue") {
      out.push("---", "");
      if (isMigrated(sections)) {
        out.push("## Vista Vue", "");
        for (const view of vueSectionsOf(sections)) {
          out.push(`### ${view.title}`, "", (view.body ?? "").trim(), "");
        }
      } else {
        out.push(vueUsage(component), "");
      }
    }
  }

  const payloadHeader = vueView ? "Payload" : "Payload (`e.detail`)";
  const propsHeader = vueView ? "Prop" : "Atributo";

  const propRows = component.props.map((prop) => [
    `\`${prop.name}\``,
    fmtType(prop.type),
    fmtDefault(prop.default),
    prop.description ?? "",
  ]);
  out.push(
    apiOrEmpty(
      "Props",
      component.props,
      table([propsHeader, "Tipo", "Default", "Descripción"], propRows),
      notes.props,
    ),
    "",
  );

  const eventRows = component.events.map((event) => [
    `\`${event.name}\``,
    fmtPayload(event.type),
    event.description ?? "",
  ]);
  out.push(
    apiOrEmpty(
      "Eventos",
      component.events,
      table(["Evento", payloadHeader, "Descripción"], eventRows),
      notes.events,
    ),
    "",
  );

  const slotRows = component.slots.map((slot) => [`\`${slot.name}\``, slot.description ?? ""]);
  out.push(
    apiOrEmpty("Slots", component.slots, table(["Slot", "Descripción"], slotRows), notes.slots),
    "",
  );

  const exposedRows = component.exposed.map((item) => [methodLabel(item), item.description ?? ""]);
  out.push(
    apiOrEmpty(
      "Métodos expuestos",
      component.exposed,
      table(["Método", "Descripción"], exposedRows),
      notes.exposes,
    ),
    "",
  );

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
