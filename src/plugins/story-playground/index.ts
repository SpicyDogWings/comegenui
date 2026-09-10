import type { App } from "vue";
import type { Router } from "vue-router";
import StoryPage from "@/pages/playground/StoryPage.vue";
import type { ComponentStory } from "@/stories/types";
import { storyRegistryKey, type GetStory, type StoryEntry } from "./keys";

export type { GetStory, StoryEntry } from "./keys";
export { storyRegistryKey } from "./keys";

export interface StoryPlaygroundOptions {
  /** Router de la app (el plugin agrega la ruta `components/:name`). */
  router: Router;
  /**
   * Módulos de stories. En el host:
   * `import.meta.glob("./stories/**\/*.stories.ts", { eager: true })`
   */
  stories: Record<string, unknown>;
  /** Base de las rutas de componentes. Default: '/playground/components'. */
  base?: string;
  /** Nombre de la ruta generada. Default: 'Component playground'. */
  routeName?: string;
}

function storyOf(module: unknown): ComponentStory | undefined {
  if (!module || typeof module !== "object") return undefined;
  return Object.values(module as Record<string, unknown>).find(
    (value): value is ComponentStory =>
      Boolean(value && typeof value === "object" && "component" in value && "sections" in value),
  );
}

/** Construye el mapa de stories: nombre de archivo, kebab, tag y tag sin `cu-`. */
export function buildStoryRegistry(modules: Record<string, unknown>): Map<string, StoryEntry> {
  const entries = new Map<string, StoryEntry>();
  for (const [path, module] of Object.entries(modules)) {
    const story = storyOf(module);
    if (!story) continue;
    const file = path.split("/").pop()?.replace(/\.stories\.ts$/, "") ?? "";
    const kebabFile = file.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
    const entry = { name: file, story };
    entries.set(file, entry);
    entries.set(file.toLowerCase(), entry);
    entries.set(kebabFile, entry);
    entries.set(story.component, entry);
    entries.set(story.component.replace(/^cu-/, ""), entry);
  }
  return entries;
}

/**
 * Plugin Vue del playground de stories: registra la ruta genérica
 * `components/:name` y provee el registry (`getStory`).
 *
 * Uso: `app.use(StoryPlayground, { router, stories })`.
 */
const StoryPlayground = {
  install(app: App, options: StoryPlaygroundOptions): void {
    const registry = buildStoryRegistry(options.stories);
    const getStory: GetStory = (name) => registry.get(name) ?? registry.get(name.toLowerCase());
    const base = (options.base ?? "/playground/components").replace(/\/+$/, "");

    app.provide(storyRegistryKey, getStory);
    app.component("StoryPage", StoryPage);
    options.router.addRoute({
      path: `${base}/:name`,
      name: options.routeName ?? "Component playground",
      component: StoryPage,
    });
  },
};

export default StoryPlayground;
