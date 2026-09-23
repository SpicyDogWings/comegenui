/**
 * Contrato JSON de Khadgar (`khadgar.json`).
 *
 * Es la interfaz única entre el core (extractor) y los consumidores
 * (playground, `khadgar-docs`). Solo tipos: no hay runtime.
 */

/** Tag JSDoc de una fila (`@deprecated`, `@default`, …). */
export interface KhadgarTag {
  name: string;
  text?: string;
}

/** Una fila de la API (prop, event, slot o exposed). */
export interface KhadgarRow {
  name: string;
  /**
   * Tipo/firma. En props el tipo de la prop; en events el payload
   * (`e.detail`); en exposed la firma del método; en slots el tipo del slot prop.
   */
  type?: string;
  /** Default serializado (props). */
  default?: string;
  /** Solo props. */
  required?: boolean;
  description?: string;
  tags?: KhadgarTag[];
}

/** Una interfaz/type TS usada por la API del componente. */
export interface KhadgarInterface {
  name: string;
  code: string;
  description?: string;
}

/** Sección de prosa curada (ejemplos de uso). */
export interface KhadgarSection {
  title: string;
  body: string;
}

/** El contrato completo de un componente `.vue`. */
export interface KhadgarComponent {
  /** Nombre del archivo sin `.vue` (ej: `Button`). */
  name: string;
  /** Tag del custom element (`cu-button`). Ausente en componentes internos. */
  tag?: string;
  /** Subcarpeta bajo `componentsDir` (ej: `buttons`). */
  category: string;
  /** Ruta del `.vue` relativa a la raíz. */
  file: string;
  /** Descripción corta (intro curada o JSDoc). */
  description: string;
  props: KhadgarRow[];
  events: KhadgarRow[];
  slots: KhadgarRow[];
  exposed: KhadgarRow[];
  /** Tokens CSS (`--cu-*`, `--btn-*`, …) usados por el componente. */
  tokens: string[];
  /** Clases CSS `cu-*` que define. */
  classes: string[];
  interfaces: KhadgarInterface[];
  /** Sub-componentes propios que usa (nombres). */
  deps: string[];
  /** Notas curadas por sección (`events`, `exposes`, …). */
  notes?: Record<string, string>;
  /** Secciones de prosa curada. */
  sections?: KhadgarSection[];
}

/** Índice completo: metadata + todos los componentes. */
export interface KhadgarIndex {
  version: string;
  generatedAt: string;
  components: KhadgarComponent[];
}
