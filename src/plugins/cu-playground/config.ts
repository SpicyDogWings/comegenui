/**
 * Configuración de `cu-playground`.
 *
 * Se lee de `cu-playground.config.json` (raíz del proyecto). El mismo archivo
 * lo consumen el runtime (vía `main.ts`) y el CLI (`cli/generate.mjs`).
 */
export interface PlaygroundConfig {
  /** Directorio de componentes reales. Default: 'src/components'. */
  componentsDir?: string;
  /** Directorio de stories/tests. Default: 'src/stories'. */
  storiesDir?: string;
  /** Directorio de páginas físicas opcionales. Default: 'src/playground'. */
  playgroundDir?: string;
  /** Base de las rutas de componentes. Default: '/playground/components'. */
  base?: string;
  /** Si `true`, el CLI genera páginas físicas por defecto. Default: false. */
  pages?: boolean;
  /** Nombres/categorías a excluir del generador y del nav. */
  exclude?: string[];
  /** Ajustes del nav lateral. */
  nav?: {
    /** Mapa categoría → label visible. Default: capitalizar la categoría. */
    groups?: Record<string, string>;
    /** Orden de los grupos. Los no listados van al final. */
    order?: string[];
    /** Categorías o nombres a ocultar del nav. */
    exclude?: string[];
  };
}

export const PLAYGROUND_DEFAULTS = {
  componentsDir: "src/components",
  storiesDir: "src/stories",
  playgroundDir: "src/playground",
  base: "/playground/components",
  pages: false,
} as const;

export function resolvePlaygroundConfig(config: PlaygroundConfig = {}) {
  return {
    componentsDir: config.componentsDir ?? PLAYGROUND_DEFAULTS.componentsDir,
    storiesDir: config.storiesDir ?? PLAYGROUND_DEFAULTS.storiesDir,
    playgroundDir: config.playgroundDir ?? PLAYGROUND_DEFAULTS.playgroundDir,
    base: config.base ?? PLAYGROUND_DEFAULTS.base,
    pages: config.pages ?? PLAYGROUND_DEFAULTS.pages,
    exclude: config.exclude ?? [],
    nav: config.nav ?? {},
  };
}
