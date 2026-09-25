// src/plugins/khadgar-docs-custom-elements/index.mjs — Documentación de **custom
// elements** (uso vanilla/UMD) de ComegenUI.
//
// Consumidor de Khadgar, hermano de `khadgar-docs`: donde ese genera la ficha
// **Vue** del `.vue`, este genera la ficha del **custom element** (uso en HTML
// plano: `<cu-x>`, `<script src>` …). Aplica a los componentes con
// `customElement: true` (los registrados en `src/lib`).
//
// No asume `.ce.vue`: usa el tag del custom element, que envuelve al `.vue`.
import { buildIndex } from "../khadgar/extract/index.mjs";
import { renderDoc } from "../khadgar-docs/render.mjs";

/** Fichas vanilla (custom element) de los componentes con `customElement: true`. */
export function buildCustomElementDocs(root, config, options = {}) {
  const index = buildIndex({ root, config });
  const components = index.components.filter((component) => component.customElement);
  return components.map((component) => ({
    tag: component.tag,
    name: component.name,
    markdown: renderDoc(component, { mode: "vanilla", ...options }),
  }));
}
