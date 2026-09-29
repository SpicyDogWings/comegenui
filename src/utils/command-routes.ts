import type { CommandItem } from "@/components/overlay/CommandPalette.vue";

/**
 * Comandos de navegación del CommandPalette del layout.
 *
 * En el sitio VitePress no hay un router propio del SPA: la lista es estática
 * (Home, componentes, Theme Builder). La navegación es por URL.
 */
function go(path: string) {
  if (typeof window !== "undefined") window.location.href = path;
}

export function navigationCommands(): CommandItem[] {
  return [
    { id: "home", label: "Inicio", description: "/", category: "Páginas", action: () => go("/") },
    {
      id: "components",
      label: "Componentes",
      description: "/componentes",
      category: "Playground",
      action: () => go("/componentes/cu-button"),
    },
    {
      id: "theme-builder",
      label: "Theme Builder",
      description: "/theme-builder",
      category: "Herramientas",
      action: () => go("/theme-builder"),
    },
  ];
}
