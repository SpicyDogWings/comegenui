// src/plugins/khadgar-docs-vanilla/index.mjs — Documentación **vanilla/UMD** de
// los componentes de ComegenUI.
//
// Consumidor de Khadgar, hermano de `khadgar-docs`: donde ese genera la ficha
// **Vue** del `.vue`, este genera la ficha del **custom element** (uso en HTML
// plano: `<cu-x>`, `<script src>` …) y la skill `use-comegen` que viaja en el zip.
//
// Trabaja sobre los componentes con `vanilla: true`. No asume `.ce.vue`: usa el
// tag del custom element (registrado en `src/lib`), que envuelve al `.vue`.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { buildIndex } from "../khadgar/extract/index.mjs";
import { renderDoc } from "../khadgar-docs/render.mjs";

/** Fichas vanilla (canónicas) de los componentes `vanilla: true`. */
export function buildVanillaDocs(root, config) {
  const index = buildIndex({ root, config });
  const components = index.components.filter((component) => component.tag && component.vanilla);
  return components.map((component) => ({
    tag: component.tag,
    name: component.name,
    markdown: renderDoc(component, { mode: "vanilla" }),
  }));
}
