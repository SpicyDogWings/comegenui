// src/plugins/khadgar/extract/complements.mjs — Datos que `vue-component-meta`
// no da: tokens CSS, clases `cu-*`, interfaces/types y deps (sub-componentes).
//
// Reusa el parser de SFC existente (`cli/parse-sfc.mjs`), que ya cubre estos
// casos y está validado contra las fichas.
import { parseComponent } from "../cli/parse-sfc.mjs";

/**
 * Extrae los complementos de un `.vue`.
 *
 * @param {string} filePath ruta del `.vue`.
 * @param {string} [source] contenido (si ya se leyó).
 * @param {string} [base] base de las rutas del playground (para deps).
 */
export function complements(filePath, source, base) {
  const parsed = parseComponent(filePath, source, base);
  return {
    tokens: parsed.tokens,
    classes: parsed.classes,
    interfaces: parsed.interfaces.map(({ name, code, description }) => ({
      name,
      code,
      ...(description ? { description } : {}),
    })),
    deps: parsed.components.map((dep) => dep.label),
  };
}
