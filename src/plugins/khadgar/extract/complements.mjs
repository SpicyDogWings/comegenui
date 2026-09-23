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
 */
export function complements(filePath, source) {
  const parsed = parseComponent(filePath, source);
  return {
    tokens: parsed.tokens,
    classes: parsed.classes,
    interfaces: parsed.interfaces.map(({ name, code, description }) => ({
      name,
      code,
      ...(description ? { description } : {}),
    })),
    deps: parsed.components.map((dep) => dep.label),
    // vcm no ve los `validator`; parse-sfc sí. Se usa como fallback del tipo.
    props: parsed.props.map(({ name, type, values }) => ({ name, type, values })),
    // vcm no ve los eventos del wrapper CE (`ceEmit`/`CustomEvent`); parse-sfc sí.
    emits: parsed.emits.map(({ name, type, description }) => ({ name, type, description })),
    // vcm pierde nombres de `defineExpose` que colisionan con props (ej: `close`);
    // parse-sfc lee el objeto literal y es la lista fiable.
    exposes: parsed.exposes.map(({ name, type, description }) => ({ name, type, description })),
    // Los slots se documentan con un comentario HTML antes del `<slot>` (parse-sfc).
    slots: parsed.slots.map(({ name, description }) => ({ name, description })),
  };
}
