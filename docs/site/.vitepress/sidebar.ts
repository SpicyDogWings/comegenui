// docs/site/.vitepress/sidebar.ts — Construye los sidebars de componentes
// leyendo `title`/`group` del frontmatter. Sin dependencias ni pipeline: los
// `.md` de `docs/site/componentes/` son la única fuente de verdad.
//
// Hay **dos familias** de páginas, y cada una tiene su propio sidebar:
//   /componentes/<tag>        → la doc del Custom Element (vanilla)
//   /componentes/vue/<kebab>  → la doc del componente Vue
// Ambas familias usan el mismo `title` por componente, así que el switch de modo
// puede encontrar la contraparte comparando títulos.
//
// Con **ficha unificada** (ver `docs/notes/10-ficha-unificada.md`) sólo existe la página
// vanilla, con las dos APIs en tabs: esa página se agrega también al sidebar Vue para que
// el componente no desaparezca estando en modo Vue. El switch de modo la ignora (no tiene
// contraparte: el título no está en la otra familia).
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const componentesDir = resolve(here, "../componentes");
const vueDir = resolve(componentesDir, "vue");
// Fichas (fuente de verdad de la API): `docs/componentes/<tag>.md`.
const fichasDir = resolve(here, "../../componentes");

/** Orden de los grupos en el sidebar (los no listados van al final, A-Z). */
const GROUP_ORDER = [
  "Buttons",
  "Formularios",
  "Controles",
  "Información",
  "Markdown",
  "Overlay",
  "Navegación",
  "Datos",
  "Theme",
  "Otros",
];

export interface SidebarGroup {
  text: string;
  items: { text: string; link: string }[];
}

interface Entry {
  text: string;
  link: string;
  group: string;
}

/** Lee un campo escalar del frontmatter (soporta `title`/`group` sin YAML). */
function frontmatterField(source: string, field: string): string | null {
  const block = /^---\r?\n([\s\S]*?)\r?\n---/.exec(source);
  if (!block) return null;
  const line = new RegExp(`^${field}:\\s*(.+?)\\s*$`, "m").exec(block[1]!);
  return line ? line[1]!.replace(/^["']|["']$/g, "") : null;
}

/** Entradas de un directorio de páginas. */
function entriesOf(dir: string, routeBase: string): Entry[] {
  const entries: Entry[] = [];
  for (const file of readdirSync(dir)) {
    if (!file.endsWith(".md")) continue;
    const source = readFileSync(resolve(dir, file), "utf-8");
    const title = frontmatterField(source, "title");
    const group = frontmatterField(source, "group");
    if (!title || !group) {
      console.warn(`[sidebar] ${file} no tiene title/group en el frontmatter`);
      continue;
    }
    entries.push({ text: title, link: `${routeBase}/${file.slice(0, -3)}`, group });
  }
  return entries;
}

/**
 * Páginas con ficha unificada: una sola página (en `/componentes/<tag>`) con las dos APIs.
 * La marca es el marcador `@api:props` de la ficha, el mismo que valida `check-docs.mjs`.
 */
function unifiedEntries(): Entry[] {
  const entries: Entry[] = [];
  for (const file of readdirSync(fichasDir)) {
    if (!file.endsWith(".md") || file === "README.md") continue;
    if (!readFileSync(resolve(fichasDir, file), "utf-8").includes("<!-- @api:props -->")) continue;
    const pageFile = resolve(componentesDir, file);
    if (!existsSync(pageFile)) continue;
    const source = readFileSync(pageFile, "utf-8");
    const title = frontmatterField(source, "title");
    const group = frontmatterField(source, "group");
    if (!title || !group) continue;
    entries.push({ text: title, link: `/componentes/${file.slice(0, -3)}`, group });
  }
  return entries;
}

/** Agrupa y ordena las entradas de una familia. */
function assemble(entries: Entry[]): SidebarGroup[] {
  const rank = (group: string) => {
    const position = GROUP_ORDER.indexOf(group);
    return position < 0 ? GROUP_ORDER.length : position;
  };
  const byGroup = new Map<string, Entry[]>();
  for (const entry of entries) {
    const list = byGroup.get(entry.group) ?? [];
    list.push(entry);
    byGroup.set(entry.group, list);
  }

  return [...byGroup.entries()]
    .sort((a, b) => rank(a[0]) - rank(b[0]) || a[0].localeCompare(b[0]))
    .map(([group, items]) => ({
      text: group,
      items: [...items]
        .sort((a, b) => a.text.localeCompare(b.text))
        .map(({ text, link }) => ({ text, link })),
    }));
}

/** Sidebar de la doc del Custom Element (`/componentes/cu-x`). */
export function buildVanillaSidebar(routeBase = "/componentes"): SidebarGroup[] {
  return assemble(entriesOf(componentesDir, routeBase));
}

/** Sidebar de la doc Vue (`/componentes/vue/x`) + las fichas unificadas. */
export function buildVueSidebar(routeBase = "/componentes/vue"): SidebarGroup[] {
  return assemble([...entriesOf(vueDir, routeBase), ...unifiedEntries()]);
}

/**
 * Config de `sidebar` de VitePress: objeto por prefijo de ruta. VitePress elige
 * el prefijo más específico, así que estando en `/componentes/vue/x` el sidebar
 * muestra sólo la familia Vue y estando en `/componentes/cu-x` sólo la vanilla.
 */
export function buildSidebars(): Record<string, SidebarGroup[]> {
  return {
    "/componentes/vue/": buildVueSidebar(),
    "/componentes/": buildVanillaSidebar(),
  };
}
