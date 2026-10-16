#!/usr/bin/env node
// scripts/ficha-api.mjs — lee las tablas de API de una ficha Vue.
//
// La API se declara entre marcadores:
//
//   <!-- @api:props -->   | Prop | Tipo | Default | Descripción |   <!-- /@api:props -->
//   <!-- @api:emits -->   | Evento | Payload | Descripción |       <!-- /@api:emits -->
//   <!-- @api:slots -->   | Slot | Descripción |                   <!-- /@api:slots -->
//   <!-- @api:expose -->  | Método | Descripción |                 <!-- /@api:expose -->
//
// Los marcadores no tienen por qué estar en la ficha: el modelo vigente compone las secciones
// desde partials (`<!--@include: ../../partials/<kebab>/props-vue.md-->` en
// `docs/componentes/vue/<kebab>.md`), así que antes de leerlos se expanden los `@include` —con
// la misma resolución relativa que hace VitePress— y recién ahí se buscan. Un partial
// **compartido** por las dos APIs conserva el nombre vanilla del marcador
// (`@api:atributos`/`@api:eventos`/`@api:metodos`), así que cada sección acepta sus dos alias.
//
// Una versión **congelada** (`docs-freeze.mjs`) ya no tiene marcadores: sus tablas quedaron
// materializadas en texto plano. En ese caso, la fuente es la sección del markdown final
// (`## Props`/`## Atributos`, `## Emits`/`## Eventos`, `## Slots`, `## Expose`/`## Métodos
// expuestos`) y se lee la primera tabla cuya primera columna sea la de la API (`Prop`/`Atributo`,
// `Evento`, `Slot`, `Método`). Los `@include` se expanden antes, así que da igual si el parcial es
// compartido o propio. Primero se intentan los marcadores; si una sección no los tiene, se cae a la
// sección materializada.
//
// Esto es la especificación que los tests de contrato hacen cumplir en runtime.
// `gen-api.mjs` mantiene las tablas sincronizadas con el SFC; acá sólo se leen.
import { readFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

export const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

// La doc es la fuente y está versionada: `docs/versiones/<id>/` (id = la `latest` del manifiesto).
const DOC_ID = JSON.parse(readFileSync(resolve(ROOT, "docs/versions.json"), "utf-8")).versions.find(
  (v) => v.latest,
)?.id;
const FICHA_DIR = resolve(ROOT, "docs/versiones", DOC_ID, "componentes/vue");

/** Tope de recursión de `@include` (un partial que se incluya a sí mismo no cuelga la lectura). */
const MAX_INCLUDE_DEPTH = 10;

/**
 * Fuente con los `<!--@include: <ruta>-->` resueltos, recursivamente. La ruta es relativa al
 * archivo que contiene el include (igual que VitePress). Un include a un archivo inexistente se
 * descarta sin ruido: quien avisa de eso es `check-docs.mjs`.
 */
export function expandIncludes(file, depth = 0) {
  if (depth > MAX_INCLUDE_DEPTH || !existsSync(file)) return "";
  const source = readFileSync(file, "utf-8");
  return source.replace(/<!--\s*@include:\s*(\S+?)\s*-->/g, (_, relative) =>
    expandIncludes(resolve(dirname(file), relative), depth + 1),
  );
}

/** Quita el backtick con que la tabla envuelve cada celda. */
function unquote(cell) {
  const text = String(cell ?? "").trim();
  const m = /^`([\s\S]*)`$/.exec(text);
  return m ? m[1].trim() : text;
}

/**
 * Divide una fila `| a | b |` en celdas. Los `|` de los tipos llegan escapados
 * (`\|`) y hay que tratarlos como contenido, no como separador. La cantidad de
 * columnas se conoce por el encabezado, así que el corte es por posición.
 */
function splitRow(line, expected) {
  const inner = line.trim().replace(/^\||\|$/g, "");
  const cells = [];
  let current = "";
  for (let i = 0; i < inner.length; i++) {
    const char = inner[i];
    if (char === "\\" && inner[i + 1] === "|") {
      current += "|";
      i++;
    } else if (char === "|") {
      cells.push(current);
      current = "";
    } else {
      current += char;
    }
  }
  cells.push(current);
  // Si sobran celdas, un `|` de un tipo quedó sin escapar: re-unimos las del medio.
  while (expected && cells.length > expected) {
    const i = 1;
    cells.splice(i, 2, `${cells[i]}|${cells[i + 1]}`);
  }
  return cells.map((c) => c.trim());
}

/** Filas de datos de una sección `@api:<name>` (sin encabezado ni separador). */
function rowsOf(source, name) {
  const re = new RegExp(`<!--\\s*@api:${name}\\s*-->([\\s\\S]*?)<!--\\s*/@api:${name}\\s*-->`);
  const block = re.exec(source);
  if (!block) return [];
  const lines = block[1]
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.startsWith("|") && !/^\|[\s\-:|]+\|$/.test(l));
  if (lines.length < 2) return [];
  const header = splitRow(lines[0]);
  return lines
    .slice(1)
    .map((l) => splitRow(l, header.length))
    .filter((cells) => cells.length > 0 && cells[0] !== "");
}

/**
 * Marcadores de cada sección, en orden de preferencia. El primero es el de la API Vue; el
 * segundo, el vanilla, que es el que queda en un partial **compartido** por las dos fichas
 * (mismo cuerpo de tabla, así que sirve igual para el contrato de la `.vue`).
 */
const MARKERS = {
  props: ["props", "atributos"],
  emits: ["emits", "eventos"],
  slots: ["slots"],
  expose: ["expose", "metodos"],
};

/**
 * Secciones materializadas (doc congelada): encabezado(s) `## X` con que puede aparecer la
 * sección y primera celda del encabezado de su tabla. Los alias ya contemplan la ficha vanilla
 * (`Atributos`/`Eventos`/`Métodos expuestos`) por si se lee una CE, pero el encabezado de la
 * tabla puede ser el del partial **compartido** (`Atributo`/`Método`) aunque la ficha sea Vue.
 */
const SECTIONS = {
  props: { headings: ["Props", "Atributos"], columns: ["Prop", "Atributo"] },
  emits: { headings: ["Emits", "Eventos"], columns: ["Evento"] },
  slots: { headings: ["Slots"], columns: ["Slot"] },
  expose: { headings: ["Expose", "Métodos expuestos", "Métodos"], columns: ["Método"] },
};

/**
 * Tablas markdown de un cuerpo de sección (sin las vallas de código): cada una con su
 * encabezado y sus filas de datos. Se ignora lo que esté dentro de ``` o ~~~.
 */
function tablesIn(body) {
  const lines = body.split("\n").map((l) => l.trim());
  const tables = [];
  let fenced = false;
  for (let i = 0; i < lines.length; i++) {
    if (/^(```|~~~)/.test(lines[i])) {
      fenced = !fenced;
      continue;
    }
    if (fenced || !lines[i].startsWith("|")) continue;
    const block = [];
    while (i < lines.length && lines[i].startsWith("|")) block.push(lines[i++]);
    i--;
    if (block.length < 2 || !/^\|[\s\-:|]+\|$/.test(block[1])) continue;
    const header = splitRow(block[0]);
    const rows = block
      .slice(2)
      .map((l) => splitRow(l, header.length))
      .filter((cells) => cells.length > 0 && cells[0] !== "");
    tables.push({ header, rows });
  }
  return tables;
}

/**
 * Filas de una sección materializada: recorre todos los `## <encabezado>` que matcheen un alias
 * y devuelve las de la primera tabla cuya primera columna sea la de la API. Se corta en el
 * próximo `## ` (los `### ` intermedios —p. ej. «Items»— siguen dentro de la sección, pero su
 * tabla no matchea el encabezado).
 */
function sectionRows(source, section) {
  const { headings, columns } = SECTIONS[section];
  const lines = source.split("\n");
  for (let i = 0; i < lines.length; i++) {
    const heading = /^##\s+(.+?)\s*$/.exec(lines[i]);
    if (!heading) continue;
    if (!headings.some((alias) => alias.toLowerCase() === heading[1].toLowerCase())) continue;
    let end = i + 1;
    while (end < lines.length && !/^##\s/.test(lines[end])) end++;
    for (const { header, rows } of tablesIn(lines.slice(i + 1, end).join("\n"))) {
      if (columns.includes(header[0])) return rows;
    }
  }
  return [];
}

/** Filas de una sección: primero los marcadores `@api:*`; si no hay, la tabla materializada. */
function rows(source, section) {
  for (const name of MARKERS[section]) {
    const cells = rowsOf(source, name);
    if (cells.length) return cells;
  }
  return sectionRows(source, section);
}

/** Especificación de un componente: props, emits, slots y expose de su ficha. */
export function fichaSpec(kebab) {
  const file = resolve(FICHA_DIR, `${kebab}.md`);
  if (!existsSync(file)) return null;
  const source = expandIncludes(file);

  const props = rows(source, "props").map((cells) => ({
    name: unquote(cells[0]),
    type: unquote(cells[1]),
    default: unquote(cells[2]),
    description: cells[3] ?? "",
  }));
  const emits = rows(source, "emits").map((cells) => ({
    name: unquote(cells[0]),
    payload: unquote(cells[1]),
  }));
  const slots = rows(source, "slots").map((cells) => unquote(cells[0]));
  const expose = rows(source, "expose").map((cells) => unquote(cells[0]));

  return { kebab, file, props, emits, slots, expose };
}

/** Prosa de la ficha (sin tablas generadas), por si hace falta citarla. */
export function fichaProse(kebab) {
  const file = resolve(FICHA_DIR, `${kebab}.md`);
  if (!existsSync(file)) return "";
  return expandIncludes(file)
    .replace(/<!--\s*@api:[\s\S]*?\/@api:\w+\s*-->/g, "")
    .trim();
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const name = process.argv[2];
  if (!name) {
    console.error("uso: node scripts/ficha-api.mjs <kebab>");
    process.exit(1);
  }
  console.log(JSON.stringify(fichaSpec(name), null, 2));
}
