/**
 * Configuración de `cu-playground`.
 *
 * Se lee de `cu-playground.config.json` (raíz del proyecto). El mismo archivo
 * lo consumen el runtime (vía `main.ts`) y el CLI (`cli/generate.mjs`).
 *
 * `chrome`, `getTokenDescription` y `libStatus` no son serializables (componentes
 * y funciones): se pasan por las opciones del plugin en `main.ts`, no por JSON.
 */
import type { PlaygroundChrome } from "./chrome";
import type { PlaygroundLibStatus } from "./keys";

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
  /** Directorio de entry points de la lib (para snippets vanilla). Default: 'src/lib'. */
  libDir?: string;
  /** Nombres/categorías a excluir del generador y del nav. */
  exclude?: string[];
  /** Componentes de chrome (UI) del runtime. Sin esto se usan fallbacks. */
  chrome?: PlaygroundChrome;
  /** Resuelve la descripción de un token CSS. Default: genérica. */
  getTokenDescription?: (name: string) => string;
  /** Estado "En lib / No en lib" del layout. Sin esto, no se muestra el badge. */
  libStatus?: PlaygroundLibStatus;
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
  libDir: "src/lib",
  pages: false,
} as const;

export function resolvePlaygroundConfig(config: PlaygroundConfig = {}) {
  return {
    componentsDir: config.componentsDir ?? PLAYGROUND_DEFAULTS.componentsDir,
    storiesDir: config.storiesDir ?? PLAYGROUND_DEFAULTS.storiesDir,
    playgroundDir: config.playgroundDir ?? PLAYGROUND_DEFAULTS.playgroundDir,
    base: config.base ?? PLAYGROUND_DEFAULTS.base,
    libDir: config.libDir ?? PLAYGROUND_DEFAULTS.libDir,
    pages: config.pages ?? PLAYGROUND_DEFAULTS.pages,
    exclude: config.exclude ?? [],
    chrome: config.chrome,
    getTokenDescription: config.getTokenDescription,
    libStatus: config.libStatus,
    nav: config.nav ?? {},
  };
}
