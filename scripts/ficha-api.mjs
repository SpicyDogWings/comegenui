#!/usr/bin/env node
// scripts/ficha-api.mjs — lee las tablas de API de una ficha Vue.
//
// La ficha (`docs/componentes/vue/<kebab>.md`) declara la API entre marcadores:
//
//   <!-- @api:props -->   | Prop | Tipo | Default | Descripción |   <!-- /@api:props -->
//   <!-- @api:emits -->   | Evento | Payload | Descripción |       <!-- /@api:emits -->
//   <!-- @api:slots -->   | Slot | Descripción |                   <!-- /@api:slots -->
//   <!-- @api:expose -->  | Método | Descripción |                 <!-- /@api:expose -->
//
// Esto es la especificación que los tests de contrato hacen cumplir en runtime.
// `gen-api.mjs` mantiene las tablas sincronizadas con el SFC; acá sólo se leen.
import { readFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

export const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const FICHA_DIR = resolve(ROOT, "docs/componentes/vue");

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
function rows(source, name) {
  const re = new RegExp(`<!-- @api:${name} -->([\\s\\S]*?)<!-- /@api:${name} -->`);
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

/** Especificación de un componente: props, emits, slots y expose de su ficha. */
export function fichaSpec(kebab) {
  const file = resolve(FICHA_DIR, `${kebab}.md`);
  if (!existsSync(file)) return null;
  const source = readFileSync(file, "utf-8");

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
  return readFileSync(file, "utf-8")
    .replace(/<!-- @api:[\s\S]*?\/@api:\w+ -->/g, "")
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
