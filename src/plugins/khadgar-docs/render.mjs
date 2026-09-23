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
 * @returns {string} markdown
 */
export function renderDoc(component) {
  const out = [];
  const notes = component.notes ?? {};

  out.push(`# \`<${component.tag}>\``, "");
  if (component.description) out.push(component.description, "");
  out.push("[← Volver](../SKILL.md)", "", "---", "");

  if (component.props.length) {
    const rows = component.props.map((prop) => [
      `\`${prop.name}\``,
      fmtType(prop.type),
      fmtDefault(prop.default),
      prop.description ?? "",
    ]);
    out.push(apiSection("Props", table(["Prop", "Tipo", "Default", "Descripción"], rows), notes.props), "");
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
      apiSection("Eventos", table(["Evento", "Payload (`e.detail`)", "Descripción"], rows), notes.events),
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

  for (const section of component.sections ?? []) {
    out.push("---", "", `## ${section.title}`, "", section.body.trim(), "");
  }

  return `${out.join("\n").replace(/\n{3,}/g, "\n\n").trimEnd()}\n`;
}
