// docs/site/.vitepress/sidebar.ts — Construye los sidebars de componentes
// leyendo `title`/`group` del frontmatter. Sin dependencias ni pipeline: los
// `.md` de `docs/site/componentes/` son la única fuente de verdad.
//
// Hay **dos familias** de páginas, y cada una tiene su propio sidebar:
//   /componentes/<tag>        → la doc del Custom Element (vanilla)
//   /componentes/vue/<kebab>  → la doc del componente Vue
// Ambas familias usan el mismo `title` por componente, así que el switch de modo
// puede encontrar la contraparte comparando títulos.
import { readdirSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const componentesDir = resolve(here, "../componentes");
const vueDir = resolve(componentesDir, "vue");

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

/** Lee un campo escalar del frontmatter (soporta `title`/`group` sin YAML). */
function frontmatterField(source: string, field: string): string | null {
  const block = /^---\r?\n([\s\S]*?)\r?\n---/.exec(source);
  if (!block) return null;
  const line = new RegExp(`^${field}:\\s*(.+?)\\s*$`, "m").exec(block[1]!);
  return line ? line[1]!.replace(/^["']|["']$/g, "") : null;
}

/** Entradas de un directorio de páginas, agrupadas y ordenadas. */
function buildFamily(dir: string, routeBase: string): SidebarGroup[] {
  const entries: { text: string; link: string; group: string }[] = [];
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

  const rank = (group: string) => {
    const position = GROUP_ORDER.indexOf(group);
    return position < 0 ? GROUP_ORDER.length : position;
  };
  const byGroup = new Map<string, typeof entries>();
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
  return buildFamily(componentesDir, routeBase);
}

/** Sidebar de la doc Vue (`/componentes/vue/x`). */
export function buildVueSidebar(routeBase = "/componentes/vue"): SidebarGroup[] {
  return buildFamily(vueDir, routeBase);
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
