// src/plugins/khadgar/extract/checker.mjs — Checker de `vue-component-meta`.
//
// Es caro de crear (levanta un programa de TS completo) y solo corre en Node.
// Se cachea un singleton por proceso.
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { createChecker } from "vue-component-meta";

let cached = null;

/**
 * Devuelve (y cachea) el checker de `vue-component-meta` para el proyecto.
 *
 * @param {string} [root] raíz del proyecto. Default: `process.cwd()`.
 * @param {string} [tsconfig] tsconfig relativo a `root`. Default: `tsconfig.app.json`.
 */
export function getChecker(root = process.cwd(), tsconfig = "tsconfig.app.json") {
  if (cached) return cached;
  const path = resolve(root, tsconfig);
  if (!existsSync(path)) {
    throw new Error(`khadgar: no encuentro "${tsconfig}" en ${root}`);
  }
  // `schema: false` desactiva la expansión de tipos (no la usamos y es costosa).
  cached = createChecker(path, { schema: false });
  return cached;
}

/** Invalida el checker cacheado (tests / watch). */
export function resetChecker() {
  cached = null;
}
