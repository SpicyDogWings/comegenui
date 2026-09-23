/**
 * Configuración de Khadgar (`khadgar.config.json`).
 *
 * Solo describe la **fábrica** (qué componentes extraer y cómo categorizarlos) y
 * el scope `docs` que consume `khadgar-docs`. Khadgar no sabe de render, de
 * markdown ni de VitePress.
 */

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

/** Scope `docs`: lo consume `khadgar-docs` para generar el sitio VitePress. */
export interface DocsConfig {
  /** Directorio raíz del sitio. Default: `docs/site`. */
  site?: string;
  /** Título del sitio. */
  title?: string;
  /** Descripción del sitio. */
  description?: string;
  /** Base de las rutas de las fichas. Default: `/componentes`. */
  routeBase?: string;
  /** Label del primer item del nav. Default: `Componentes`. */
  navLabel?: string;
  /** Items extra del nav (ej: Theme Builder). */
  navExtra?: Array<{ text: string; link: string }>;
  /** Mapa categoría → label visible. */
  groups?: Record<string, string>;
  /** Orden de los grupos. */
  order?: string[];
}

export interface KhadgarConfig {
  /**
   * Lista explícita de componentes a procesar (la entrada de la fábrica).
   * Si se omite/vacía, el CLI cae al glob de `componentsDir`.
   */
  components?: ComponentConfig[];
  /** Directorio de componentes reales. Default: `src/components`. */
  componentsDir?: string;
  /** Directorio de entry points de la lib (para el tag). Default: `src/lib`. */
  libDir?: string;
  /** Directorio de salida de las fichas `.md`. Default: `docs/skills/use-comegen`. */
  docsDir?: string;
  /** Directorio del build estático del JSON. Default: `public`. */
  outDir?: string;
  /** tsconfig del proyecto (para `vue-component-meta`). Default: `tsconfig.app.json`. */
  tsconfig?: string;
  /** Flags globales de extracción (default: todo true). */
  extract?: { tokens?: boolean; classes?: boolean; interfaces?: boolean; deps?: boolean };
  /** Nombres/categorías a excluir. */
  exclude?: string[];
  /** Configuración del sitio de documentación. */
  docs?: DocsConfig;
}
