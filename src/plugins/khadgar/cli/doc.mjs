// src/plugins/khadgar/cli/doc.mjs — Fichas de API de la skill de uso.
//
// El plugin es el único que consulta al componente: resuelve el SFC que
// distribuye la lib (`X.ce.vue` si existe, si no el `X.vue`), lo parsea con
// `parse-sfc.mjs` y renderiza la ficha `componentes/cu-x.md`.
//
// La prosa curada (intro, descripciones, ejemplos) vive en un sidecar
// `componentes/cu-x.doc.json` que NUNCA se pisa; el `.md` se regenera de
// contrato + sidecar. `parseDocToSidecar()` migra una ficha existente al
// sidecar una sola vez.
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import fg from "fast-glob";

export function kebab(value) {
  return value
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();
}

/**
 * Resuelve el componente que distribuye la lib.
 *
 * Regla: el SFC que importa el entry point (`src/lib/**​/<kebab>.ts`) es la
 * fuente de verdad de la API pública. Si el entry no existe, el componente no
 * está en la lib y se cae al `.vue` real (queda marcado `inLib: false`).
 */
export function resolveDocTarget({ ROOT, componentName, componentsDir, libDir }) {
  const key = kebab(componentName);
  const tag = `cu-${key}`;
  const libEntry = fg
    .sync(`${libDir}/**/${key}.ts`)
    .find((file) => !/\/(index|tokens|colors)\.ts$/.test(file));

  let sfcPath = null;
  if (libEntry) {
    const source = readFileSync(resolve(ROOT, libEntry), "utf-8");
    const match = source.match(/from\s+["']([^"']+\.vue)["']/);
    if (match) sfcPath = match[1].replace(/^@\//, "src/");
  }
  if (!sfcPath) {
    sfcPath = fg.sync(`${componentsDir}/**/${componentName}.vue`, {
      ignore: ["**/customElements/**", "**/legacy/**", "**/archived/**"],
    })[0] ?? null;
  }

  return { key, tag, inLib: Boolean(libEntry), libEntry: libEntry ?? null, sfcPath };
}

/** Lista los componentes públicos (los que tienen entry point en la lib). */
export function listPublicComponents({ ROOT, libDir }) {
  const entries = fg
    .sync(`${libDir}/**/*.ts`)
    .filter((file) => !/\/(index|tokens|colors)\.ts$/.test(file));
  const names = new Set();
  for (const entry of entries) {
    const source = readFileSync(resolve(ROOT, entry), "utf-8");
    const match = source.match(/from\s+["']([^"']+\.vue)["']/);
    if (!match) continue;
    const base = match[1].split("/").pop().replace(/\.ce\.vue$/, "").replace(/\.vue$/, "");
    if (base) names.add(base);
  }
  return [...names].sort();
}

// ── Render de la ficha ───────────────────────────────────────────────────────

function sectionKey(title) {
  const slug = title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z]+/g, "");
  if (slug === "props") return "props";
  if (slug === "eventos" || slug === "events") return "events";
  if (slug === "slots") return "slots";
  if (slug.startsWith("metodo") || slug === "methods" || slug === "exposes" || slug === "api") {
    return "exposes";
  }
  return null;
}

function cell(value) {
  return String(value ?? "").replace(/\|/g, "\\|").trim();
}

function fmtType(value) {
  if (!value || value === "—") return "—";
  return `\`${value}\``;
}

function fmtDefault(prop) {
  if (prop.default === undefined) return "—";
  const value = String(prop.default);
  if (value === "true" || value === "false" || value === "null" || /^-?\d+(\.\d+)?$/.test(value)) {
    return `\`${value}\``;
  }
  if (/^[[{]/.test(value)) return `\`${value}\``;
  return `\`"${value}"\``;
}

function fmtPayload(type) {
  if (!type || type === "() => void") return "—";
  return `\`${type}\``;
}

function table(headers, rows) {
  const head = `| ${headers.join(" | ")} |`;
  const sep = `|${headers.map(() => "------").join("|")}|`;
  const body = rows.map((row) => `| ${row.map(cell).join(" | ")} |`);
  return [head, sep, ...body].join("\n");
}

/** Entrada del sidecar: string (descripción) u objeto `{ description, type, default }`. */
function override(sidecarMap, name) {
  const entry = sidecarMap?.[name];
  if (entry == null) return {};
  return typeof entry === "string" ? { description: entry } : entry;
}

/** Normaliza el nombre para el lookup del sidecar (saca `()` y parámetros). */
function keyOf(name) {
  return name.replace(/\(.*$/, "");
}

function apiSection(title, body, note) {
  const out = [`## ${title}`, "", body];
  if (note) out.push("", note.trim());
  return out.join("\n");
}

/**
 * Renderiza la ficha a partir del contrato (parse-sfc) + sidecar curado.
 *
 * @param {{ tag: string, inLib: boolean, contract: object, sidecar: object }} input
 */
export function renderDoc({ tag, inLib, contract, sidecar = {} }) {
  const out = [];
  out.push(`# \`<${tag}>\``, "");
  if (sidecar.intro) out.push(sidecar.intro, "");
  out.push("[← Volver](../SKILL.md)", "");
  out.push("---", "");

  const props = contract.props ?? [];
  if (props.length) {
    const rows = props.map((prop) => {
      const curated = override(sidecar.props, prop.name);
      return [
        `\`${prop.name}\``,
        fmtType(curated.type ?? prop.type),
        curated.default !== undefined ? fmtDefault({ default: curated.default }) : fmtDefault(prop),
        curated.description ?? prop.description ?? "",
      ];
    });
    out.push(
      apiSection("Props", table(["Prop", "Tipo", "Default", "Descripción"], rows), sidecar.notes?.props),
      "",
    );
  } else if (sidecar.notes?.props) {
    out.push(apiSection("Props", sidecar.notes.props), "");
  }

  const events = contract.emits ?? [];
  if (events.length) {
    const rows = events.map((event) => {
      const curated = override(sidecar.events, event.name);
      return [
        `\`${event.name}\``,
        fmtPayload(curated.type ?? event.type),
        curated.description ?? event.description ?? "",
      ];
    });
    out.push(
      apiSection(
        "Eventos",
        table(["Evento", "Payload (`e.detail`)", "Descripción"], rows),
        sidecar.notes?.events,
      ),
      "",
    );
  } else if (sidecar.notes?.events) {
    out.push(apiSection("Eventos", sidecar.notes.events), "");
  }

  const slots = contract.slots ?? [];
  if (slots.length) {
    const rows = slots.map((slot) => {
      const curated = override(sidecar.slots, slot.name);
      return [`\`${slot.name}\``, curated.description ?? slot.description ?? ""];
    });
    out.push(apiSection("Slots", table(["Slot", "Descripción"], rows), sidecar.notes?.slots), "");
  } else if (sidecar.notes?.slots) {
    out.push(apiSection("Slots", sidecar.notes.slots), "");
  }

  const exposes = contract.exposes ?? [];
  if (exposes.length) {
    const rows = exposes.map((expose) => {
      const curated = override(sidecar.exposes, keyOf(expose.name));
      return [`\`.${expose.name}\``, curated.description ?? expose.description ?? ""];
    });
    out.push(
      apiSection(
        "Métodos expuestos",
        table(["Método", "Descripción"], rows),
        sidecar.notes?.exposes,
      ),
      "",
    );
  } else if (sidecar.notes?.exposes) {
    out.push(apiSection("Métodos expuestos", sidecar.notes.exposes), "");
  }

  if (!inLib) {
    out.push("> **No está en la lib**: este componente es interno; su API puede cambiar sin aviso.", "");
  }

  for (const section of sidecar.sections ?? []) {
    out.push("---", "", `## ${section.title}`, "", section.body.trim(), "");
  }

  return `${out.join("\n").replace(/\n{3,}/g, "\n\n").trimEnd()}\n`;
}

// ── Migración: ficha `.md` existente → sidecar ───────────────────────────────

function splitRow(line) {
  return line
    .replace(/^\s*\|/, "")
    .replace(/\|\s*$/, "")
    .split("|")
    .map((part) => part.trim());
}

function isSeparatorRow(line) {
  return /^\s*\|?[\s:|-]+\|?\s*$/.test(line) && line.includes("-");
}

function unquoteName(value) {
  return value.replace(/^`|`$/g, "").replace(/^\./, "").replace(/\(.*$/, "").trim();
}

/** Filas de datos de todas las tablas de un bloque (salta header/separador). */
function extractTableRows(lines) {
  const rows = [];
  let i = 0;
  while (i < lines.length) {
    if (!lines[i].trim().startsWith("|")) {
      i++;
      continue;
    }
    const block = [];
    while (i < lines.length && lines[i].trim().startsWith("|")) {
      block.push(lines[i]);
      i++;
    }
    // Header solo si la segunda línea es el separador (`|---|`).
    if (block.length >= 2 && isSeparatorRow(block[1])) block.splice(0, 2);
    rows.push(...block.filter((line) => !isSeparatorRow(line)));
  }
  return rows;
}

/** Quita separadores `---` y líneas vacías de los bordes. */
function cleanNote(text) {
  const lines = text.split("\n");
  while (lines.length && (lines[0].trim() === "" || /^-{3,}$/.test(lines[0].trim()))) lines.shift();
  while (lines.length && (lines[lines.length - 1].trim() === "" || /^-{3,}$/.test(lines[lines.length - 1].trim()))) lines.pop();
  return lines.join("\n").replace(/\n{3,}/g, "\n\n").trim();
}

/**
 * Convierte una ficha `.md` existente en el sidecar curado. Es best-effort:
 * la primera tabla de cada sección de API se vuelve descripciones; todo lo
 * demás (blockquotes, sub-secciones, código, tablas propias) se preserva.
 */
export function parseDocToSidecar(markdown) {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const sidecar = { props: {}, events: {}, slots: {}, exposes: {}, notes: {}, sections: [] };

  // Intro: texto entre el H1 y el link "← Volver".
  let index = 0;
  while (index < lines.length && !lines[index].startsWith("# ")) index++;
  index++;
  const intro = [];
  for (; index < lines.length; index++) {
    if (/\[← Volver\]/.test(lines[index]) || lines[index].trim() === "---") break;
    intro.push(lines[index]);
  }
  const introText = intro.join("\n").trim();
  if (introText) sidecar.intro = introText;

  // Secciones `## X`.
  const body = lines.slice(index).join("\n");
  const chunks = body.split(/\n(?=## )/);
  for (const chunk of chunks) {
    const match = /^##\s+(.+)\n?/.exec(chunk);
    if (!match) continue;
    const title = match[1].trim();
    const content = chunk.slice(match[0].length).replace(/^\n+|\n+$/g, "");
    const key = sectionKey(title);
    if (!key) {
      sidecar.sections.push({ title, body: cleanNote(content) });
      continue;
    }

    // La tabla de API es todo lo que está antes de la primera sub-sección
    // (`### …`); cada sub-sección y su contenido se preservan verbatim.
    const contentLines = content.split("\n");
    const subIndex = contentLines.findIndex((line) => /^###\s/.test(line));
    const apiLines = subIndex >= 0 ? contentLines.slice(0, subIndex) : contentLines;
    const tailLines = subIndex >= 0 ? contentLines.slice(subIndex) : [];

    const rows = extractTableRows(apiLines);
    for (const row of rows) {
      const cells = splitRow(row);
      if (!cells[0]) continue;
      const name = unquoteName(cells[0]);
      if (!name) continue;

      if (key === "events") {
        const payload = cells.length >= 3 ? cells[cells.length - 2] : "";
        const description = cells.length > 1 ? cells[cells.length - 1] : "";
        const entry = {};
        if (payload && payload !== "—") entry.type = payload.replace(/^`|`$/g, "");
        if (description) entry.description = description;
        if (Object.keys(entry).length) sidecar.events[name] = entry;
      } else {
        const description = cells.length > 1 ? cells[cells.length - 1] : "";
        if (description) sidecar[key][name] = description;
      }
    }

    const note = cleanNote(
      [...apiLines.filter((line) => !line.trim().startsWith("|")), ...tailLines].join("\n"),
    );
    if (note) sidecar.notes[key] = note;
  }

  return sidecar;
}
