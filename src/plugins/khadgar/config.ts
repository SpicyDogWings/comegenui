/**
 * Configuración de `khadgar`.
 *
 * Se lee de `khadgar.config.json` (raíz del proyecto). El mismo archivo
 * lo consumen el runtime (vía `main.ts`) y el CLI (`cli/generate.mjs`).
 *
 * `chrome`, `getTokenDescription` y `libStatus` no son serializables (componentes
 * y funciones): se pasan por las opciones del plugin en `main.ts`, no por JSON.
 */
import type { PlaygroundChrome } from "./chrome";
import type { PlaygroundLibStatus } from "./keys";

/** Override de una fila de la API (descripción/tipo/default). */
export interface RowOverride {
  description?: string;
  type?: string;
  default?: string;
}

/** Configuración de un componente en la "fábrica" de Khadgar. */
export interface ComponentConfig {
  /** Nombre del componente (archivo `.vue` sin extensión). Requerido. */
  name: string;
  /** Ruta explícita al `.vue` (si no está en `componentsDir`). */
  file?: string;
  /** Categoría forzada (si no, la subcarpeta). */
  category?: string;
  /**
   * Deps a incluir (componentes usados): `true` = todos los detectados,
   * `string[]` = solo esos, `false` = ninguno.
   */
  deps?: boolean | string[];
  /** Emitir la ficha `.md` de este componente. */
  md?: boolean;
  /** Incluir este componente en el JSON. */
  json?: boolean;
  /** Incluir este componente en el playground. */
  playground?: boolean;
  /** Override de los flags globales de extracción. */
  extract?: { tokens?: boolean; classes?: boolean; interfaces?: boolean; deps?: boolean };
  /** Props/events/slots/exposed a omitir. */
  exclude?: string[];
  /** Si está, solo se incluyen estos (por nombre). */
  include?: string[];
  /** Overrides de la API. */
  override?: {
    description?: string;
    props?: Record<string, RowOverride>;
    events?: Record<string, RowOverride>;
    slots?: Record<string, RowOverride>;
    exposed?: Record<string, RowOverride>;
  };
}

export interface PlaygroundConfig {
  /**
   * Lista explícita de componentes a procesar (la entrada de la fábrica).
   * Si se omite/vacía, el CLI cae al glob de `componentsDir` (compat).
   */
  components?: ComponentConfig[];
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
  /** Directorio de salida de las fichas `.md`. Default: 'docs/skills/use-comegen'. */
  docsDir?: string;
  /** Directorio del build estático del JSON. Default: 'public'. */
  outDir?: string;
  /** Flags globales de extracción (default: todo true). */
  extract?: { tokens?: boolean; classes?: boolean; interfaces?: boolean; deps?: boolean };
  /**
   * Emitir snippets Vanilla (custom elements) al generar las stories. Se emiten
   * solo si el componente tiene entry UMD en `libDir`. Default: true.
   */
  vanilla?: boolean;
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
  docsDir: "docs/skills/use-comegen",
  outDir: "public",
  vanilla: true,
  pages: false,
} as const;

export function resolvePlaygroundConfig(config: PlaygroundConfig = {}) {
  return {
    components: config.components ?? [],
    componentsDir: config.componentsDir ?? PLAYGROUND_DEFAULTS.componentsDir,
    storiesDir: config.storiesDir ?? PLAYGROUND_DEFAULTS.storiesDir,
    playgroundDir: config.playgroundDir ?? PLAYGROUND_DEFAULTS.playgroundDir,
    base: config.base ?? PLAYGROUND_DEFAULTS.base,
    libDir: config.libDir ?? PLAYGROUND_DEFAULTS.libDir,
    docsDir: config.docsDir ?? PLAYGROUND_DEFAULTS.docsDir,
    outDir: config.outDir ?? PLAYGROUND_DEFAULTS.outDir,
    extract: config.extract ?? {},
    vanilla: config.vanilla ?? PLAYGROUND_DEFAULTS.vanilla,
    pages: config.pages ?? PLAYGROUND_DEFAULTS.pages,
    exclude: config.exclude ?? [],
    chrome: config.chrome,
    getTokenDescription: config.getTokenDescription,
    libStatus: config.libStatus,
    nav: config.nav ?? {},
  };
}
