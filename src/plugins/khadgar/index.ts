import type { App } from "vue";
import type { Router } from "vue-router";
import StoryPage from "./runtime/StoryPage.vue";
import type { ComponentStory } from "./contract";
import { chromeKey, defaultTokenDescription, resolveChrome, type PlaygroundChrome } from "./chrome";
import {
  playgroundKey,
  type NavGroup,
  type PlaygroundLibStatus,
  type PlaygroundRegistry,
  type StoryEntry,
} from "./keys";
import { resolvePlaygroundConfig, type PlaygroundConfig } from "./config";

export type { PlaygroundConfig } from "./config";
export type { NavGroup, NavLeaf, PlaygroundRegistry, PlaygroundLibStatus, StoryEntry } from "./keys";
export { playgroundKey } from "./keys";
export { resolvePlaygroundConfig } from "./config";
export type { PlaygroundChrome, ResolvedChrome } from "./chrome";
export { chromeKey, DEFAULT_CHROME, resolveChrome, defaultTokenDescription } from "./chrome";

export interface KhadgarOptions {
  /** Router de la app (el plugin agrega la ruta `components/:name`). */
  router: Router;
  /**
   * Módulos de stories (carga perezosa recomendada). En el host:
   * `import.meta.glob("./stories/**\/*.stories.ts")`.
   */
  stories: Record<string, unknown>;
  /**
   * Páginas físicas opcionales que overriden la página genérica. En el host:
   * `import.meta.glob("./playground/**\/*.vue")`.
   */
  pages?: Record<string, unknown>;
  /** Configuración (`khadgar.config.json`). */
  config?: PlaygroundConfig;
  /** Componentes de chrome (UI) del runtime. Sin esto se usan fallbacks. */
  chrome?: PlaygroundChrome;
  /** Resuelve la descripción de un token CSS. Default: genérica. */
  getTokenDescription?: (name: string) => string;
  /** Estado "En lib / No en lib" del layout. Sin esto, no se muestra el badge. */
  libStatus?: PlaygroundLibStatus;
  /** Base de las rutas de componentes. Override de `config.base`. */
  base?: string;
  /** Nombre de la ruta generada. Default: 'Component playground'. */
  routeName?: string;
}

function isStory(value: unknown): value is ComponentStory {
  return Boolean(value && typeof value === "object" && "component" in value && "sections" in value);
}

function storyOf(module: unknown): ComponentStory | undefined {
  if (!module || typeof module !== "object") return undefined;
  return Object.values(module as Record<string, unknown>).find(isStory);
}

async function loadStory(value: unknown): Promise<ComponentStory | undefined> {
  const module = typeof value === "function" ? await (value as () => Promise<unknown>)() : value;
  return storyOf(module);
}

function kebab(value: string): string {
  return value
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();
}

function normalize(value: string): string {
  return value.replace(/[^a-z0-9]/gi, "").toLowerCase();
}

function capitalize(value: string): string {
  return value ? value.charAt(0).toUpperCase() + value.slice(1) : value;
}

/** Extrae nombre de archivo y categoría del path de un glob. */
function splitPath(path: string): { file: string; category: string } {
  const clean = path.replace(/^\.[/\\]/, "");
  const parts = clean.split("/");
  const file = parts.pop() ?? "";
  // La categoría es la subcarpeta inmediata del dir de stories.
  const category = parts.length > 1 ? parts[parts.length - 1] ?? "" : "";
  return { file: file.replace(/\.stories\.ts$/, "").replace(/\.vue$/, ""), category };
}

/**
 * Construye las entradas del registry a partir del glob de stories. No carga
 * el contenido de las stories: solo deriva nombre, kebab y categoría del path.
 */
export function buildStoryEntries(
  modules: Record<string, unknown>,
  base: string,
): StoryEntry[] {
  const entries: StoryEntry[] = [];
  for (const [path, module] of Object.entries(modules)) {
    const { file, category } = splitPath(path);
    if (!file) continue;
    const kebabFile = kebab(file);
    entries.push({
      name: file,
      kebab: kebabFile,
      category,
      route: `${base.replace(/\/+$/, "")}/${kebabFile}`,
      load: () => loadStory(module),
    });
  }
  return entries;
}

/** Construye el árbol del nav desde las entradas y la config. */
export function buildNav(entries: StoryEntry[], config: PlaygroundConfig): NavGroup[] {
  const navConfig = config.nav ?? {};
  const excluded = new Set([
    ...(config.exclude ?? []),
    ...(navConfig.exclude ?? []),
  ]);
  const visible = entries.filter(
    (entry) => !excluded.has(entry.name) && !excluded.has(entry.category) && !excluded.has(entry.kebab),
  );

  const groups = new Map<string, StoryEntry[]>();
  for (const entry of visible) {
    const list = groups.get(entry.category) ?? [];
    list.push(entry);
    groups.set(entry.category, list);
  }

  const order = navConfig.order ?? [];
  const rank = (category: string) => {
    const index = order.indexOf(category);
    return index < 0 ? 999 : index;
  };
  const categories = [...groups.keys()].sort((a, b) => {
    const diff = rank(a) - rank(b);
    return diff !== 0 ? diff : a.localeCompare(b);
  });

  return categories.map((category) => ({
    label: navConfig.groups?.[category] ?? (category ? capitalize(category) : "Root"),
    children: (groups.get(category) ?? [])
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((entry) => ({ label: entry.name, path: entry.route })),
  }));
}

/**
 * Plugin Vue del playground: registra la ruta genérica `components/:name`,
 * provee el registry (stories, nav y páginas físicas de override).
 *
 * Uso: `app.use(Khadgar, { router, stories, pages, config })`.
 */
const Khadgar = {
  install(app: App, options: KhadgarOptions): void {
    const config = resolvePlaygroundConfig(options.config);
    const base = (options.base ?? config.base).replace(/\/+$/, "");
    const entries = buildStoryEntries(options.stories, base);

    const chrome = resolveChrome(options.chrome ?? config.chrome);
    const getTokenDescription =
      options.getTokenDescription ?? config.getTokenDescription ?? defaultTokenDescription;
    const libStatus = options.libStatus ?? config.libStatus;

    const byKey = new Map<string, StoryEntry>();
    for (const entry of entries) {
      for (const key of [entry.name, entry.name.toLowerCase(), entry.kebab, normalize(entry.name)]) {
        if (!byKey.has(key)) byKey.set(key, entry);
      }
    }

    const pagesByName = new Map<string, () => Promise<unknown>>();
    for (const [path, page] of Object.entries(options.pages ?? {})) {
      const { file } = splitPath(path);
      const loader = typeof page === "function" ? (page as () => Promise<unknown>) : async () => page;
      pagesByName.set(normalize(file), loader);
      pagesByName.set(kebab(file), loader);
    }

    const registry: PlaygroundRegistry = {
      base,
      getStory: (name) => byKey.get(name) ?? byKey.get(name.toLowerCase()) ?? byKey.get(normalize(name)),
      entries: () => entries,
      nav: () => buildNav(entries, config),
      getPage: (name) => pagesByName.get(normalize(name)) ?? pagesByName.get(kebab(name)),
      getTokenDescription,
      libStatus,
    };

    app.provide(playgroundKey, registry);
    app.provide(chromeKey, chrome);
    app.component("StoryPage", StoryPage);
    options.router.addRoute({
      path: `${base}/:name`,
      name: options.routeName ?? "Component playground",
      component: StoryPage,
    });
  },
};

export default Khadgar;
