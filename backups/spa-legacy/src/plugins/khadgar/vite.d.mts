// Tipos del plugin Vite de Khadgar (`vite.mjs`).
import type { Plugin } from "vite";

export interface KhadgarViteOptions {
  /** Raíz del proyecto. Default: `config.root` de Vite. */
  root?: string;
  /** Archivo de config. Default: `khadgar.config.json`. */
  configFile?: string;
  /** Ruta del extractor (relativa a `root`). */
  extract?: string;
  /** Ruta del checker (relativa a `root`). */
  checker?: string;
  /** Salida del estático. Default: `public/khadgar.json`. */
  out?: string;
  /** Si `false`, no escribe el estático en build. Default: `true`. */
  write?: boolean;
}

/** Plugin Vite: API on-demand en dev + estático en build. */
export default function khadgar(options?: KhadgarViteOptions): Plugin;
