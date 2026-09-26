// docs/site/.vitepress/sidebar.ts — Construye el sidebar de componentes leyendo
// `title`/`group` del frontmatter de las páginas. Sin dependencias ni pipeline:
// los `.md` de `docs/site/componentes/` son la única fuente de verdad.
import { readdirSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const componentesDir = resolve(here, "../componentes");

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

/** Sidebar de componentes, agrupado y ordenado según `GROUP_ORDER`. */
export function buildSidebar(routeBase = "/componentes"): SidebarGroup[] {
  const entries: { text: string; link: string; group: string }[] = [];
  for (const file of readdirSync(componentesDir)) {
    if (!file.endsWith(".md")) continue;
    const source = readFileSync(resolve(componentesDir, file), "utf-8");
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
