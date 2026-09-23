// Tipos del extractor (`extract/index.mjs`) para consumidores TS.
import type { KhadgarComponent, KhadgarIndex } from "../api";

export type {
  KhadgarComponent,
  KhadgarIndex,
  KhadgarInterface,
  KhadgarRow,
  KhadgarSection,
  KhadgarTag,
} from "../api";

/** Versión del contrato JSON. */
export declare const CONTRACT_VERSION: string;

export interface ExtractComponentOptions {
  /** Raíz del proyecto. Default: `process.cwd()`. */
  root?: string;
  /** Config resuelta (`khadgar.config.json`). */
  config?: Record<string, unknown>;
  /** Índice `.vue` (absoluto) → tag. */
  libIndex?: Map<string, string>;
  /** Nombres válidos para deps. */
  componentNames?: Set<string>;
  /** Override curado del componente. */
  sidecar?: Record<string, unknown> | null;
  /** `ComponentConfig` (include/exclude/extract). */
  item?: Record<string, unknown>;
  /** Checker de `vue-component-meta` (default: singleton). */
  checker?: unknown;
}

export interface BuildIndexOptions {
  root?: string;
  config?: Record<string, unknown>;
  components?: Array<Record<string, unknown>>;
  libIndex?: Map<string, string>;
  checker?: unknown;
}

/** Extrae el contrato de un `.vue`. */
export declare function extractComponent(
  filePath: string,
  options?: ExtractComponentOptions,
): KhadgarComponent;

/** Construye el índice completo. */
export declare function buildIndex(options?: BuildIndexOptions): KhadgarIndex;
