import router from "@/router";
import type { CommandItem } from "@/components/overlay/CommandPalette.vue";

function prettyLabel(name: string): string {
  return name
    .replace(/\s+playground$/i, "")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .trim();
}

function categoryOf(path: string): string {
  if (path === "/") return "Páginas";
  if (path === "/playground/theme-builder") return "Herramientas";
  if (path.startsWith("/playground/components")) return "Playground";
  return "Otras";
}

export function navigationCommands(): CommandItem[] {
  const routes = router.getRoutes();

  return routes
    .filter((r) => r.name && r.path && r.path !== "/:pathMatch(.*)*" && r.path !== "/playground" && r.path !== "/playground/components")
    .map((r) => ({
      id: String(r.name),
      label: prettyLabel(String(r.name)),
      description: r.path,
      category: categoryOf(r.path),
      action: () => router.push(r.path),
    }));
}