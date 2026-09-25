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
  /** Nombre lógico del componente (label en el sitio y las fichas). Requerido. */
  name: string;
  /** Ruta del `.vue` real, relativa a la raíz. Requerido. */
  file: string;
  /** Grupo visible del componente en el sitio. Default: `""` (→ "Otros"). */
  group?: string;
  /**
   * Override de custom element. `true` exige un tag en `src/lib` (si no hay,
   * warning y se ignora); `false` lo desactiva aunque exista el tag. Si se omite,
   * se deriva de la presencia del tag.
   */
  customElement?: boolean;
  /** Emitir la ficha de uso pública (skill). Independiente de `customElement`. */
  skill?: boolean;
  /**
   * Deps a incluir (componentes usados): `true` = todos los detectados,
   * `string[]` = solo esos, `false` = ninguno.
   */
  deps?: boolean | string[];
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
  /** Nav del sitio: label del primer item (default `Componentes`) + items extra. */
  nav?: {
    label?: string;
    extras?: Array<{ text: string; link: string }>;
  };
  /** Orden de los grupos (por su nombre). Los no listados van al final, alfabéticos. */
  order?: string[];
}

export interface KhadgarConfig {
  /**
   * Lista explícita de componentes a procesar (la entrada de la fábrica).
   * Cada entrada apunta a un `.vue` real via `file`.
   */
  components?: ComponentConfig[];
  /** Directorio de entry points de la lib (para el tag). Default: `src/lib`. */
  libDir?: string;
  /** Directorio de salida de las fichas `.md`. Default: `docs/skills/use-comegen`. */
  docsDir?: string;
  /** tsconfig del proyecto (para `vue-component-meta`). Default: `tsconfig.app.json`. */
  tsconfig?: string;
  /** Flags globales de extracción (default: todo true). */
  extract?: { tokens?: boolean; classes?: boolean; interfaces?: boolean; deps?: boolean };
  /** Configuración del sitio de documentación. */
  docs?: DocsConfig;
}
