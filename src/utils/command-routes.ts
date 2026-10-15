import type { CommandItem } from "@/components/overlay/CommandPalette.vue";
import { slugify } from "@/utils/slugify";

/**
 * Comandos de navegación del CommandPalette del layout.
 *
 * En el sitio VitePress no hay un router propio del SPA: la lista es estática
 * (Home, componentes, guías, Theme Builder). La navegación es por URL.
 */
function go(base: string, path: string) {
  if (typeof window !== "undefined") window.location.href = `${base}${path}`;
}

export function navigationCommands(base = ""): CommandItem[] {
  return [
    { id: "home", label: "Inicio", description: "/", category: "Páginas", action: () => go(base, "/") },
    {
      id: "components",
      label: "Componentes",
      description: "/componentes",
      category: "Playground",
      action: () => go(base, "/componentes/cu-button"),
    },
    {
      id: "instalacion",
      label: "Instalación",
      description: "/instalacion",
      category: "Páginas",
      action: () => go(base, "/instalacion"),
    },
    {
      id: "personalizacion",
      label: "Personalización",
      description: "/personalizacion",
      category: "Páginas",
      action: () => go(base, "/personalizacion"),
    },
    {
      id: "configuracion",
      label: "Configuración",
      description: "/configuracion",
      category: "Páginas",
      action: () => go(base, "/configuracion"),
    },
    {
      id: "theme-builder",
      label: "Theme Builder",
      description: "/theme-builder",
      category: "Herramientas",
      action: () => go(base, "/theme-builder"),
    },
    {
      id: "versionado",
      label: "Versionado y metadatos",
      description: "/versionado",
      category: "Páginas",
      action: () => go(base, "/versionado"),
    },
  ];
}

/** Una entrada del sidebar de VitePress: `{ text, link }`. */
export interface SidebarItem {
  text: string;
  link: string;
}

/** Un grupo del sidebar de VitePress: un título y sus entradas. */
export interface SidebarGroup {
  text: string;
  items: SidebarItem[];
}

/** Config de `sidebar` de VitePress: grupos por prefijo de ruta. */
export type SidebarConfig = Record<string, SidebarGroup[]>;

const VUE_PREFIX = "/componentes/vue/";
const VANILLA_PREFIX = "/componentes/";

/**
 * Comandos de los componentes documentados, derivados del sidebar de VitePress.
 *
 * Lista cada componente una sola vez (dedup por `text`) y navega a la página del
 * modo de la ruta actual: `/componentes/vue/…` usa la familia Vue, cualquier otro
 * path usa la vanilla. Si el componente no existe en el modo actual, cae a la otra
 * familia (vanilla por defecto). El `id` sale del título, así que es estable.
 */
export function componentCommands(
  sidebar: SidebarConfig | undefined | null,
  currentPath: string,
  base = "",
): CommandItem[] {
  const config = sidebar ?? {};
  const mode = currentPath.startsWith(VUE_PREFIX) ? "vue" : "vanilla";
  const primary = config[mode === "vue" ? VUE_PREFIX : VANILLA_PREFIX] ?? [];
  const fallback = config[mode === "vue" ? VANILLA_PREFIX : VUE_PREFIX] ?? [];

  // Un componente por título: el link lo aporta el modo actual y, si no existe, la
  // otra familia (para el modo Vue el fallback es vanilla, como pide el default).
  const links = new Map<string, string>();
  for (const group of [...primary, ...fallback]) {
    for (const item of group.items) {
      if (!links.has(item.text)) links.set(item.text, item.link);
    }
  }

  const seenIds = new Set<string>();
  const commands: CommandItem[] = [];
  for (const [text, link] of links) {
    let id = `component-${slugify(text)}`;
    while (seenIds.has(id)) id += "-2";
    seenIds.add(id);
    commands.push({
      id,
      label: `Componente: ${text}`,
      description: link,
      category: "Componentes",
      action: () => go(base, link),
    });
  }
  return commands;
}
