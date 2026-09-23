# 07 — Documentación del componente

La doc pública de un componente es **obligatoria** en la DoD. El trabajo de escribirla/auditarla se hace con la skill **`comegen-ui-docs`**; este archivo es solo el puntero y el mínimo.

## Qué generar

1. **Doc del componente** (canonical): `docs/skills/use-comegen/componentes/cu-x.md`.
   - Fuente de verdad: el **`.ce.vue`** (API pública), no el `.vue` interno.
   - Props (kebab-case), eventos, slots, métodos expuestos y ejemplos de uso en **HTML plano** (no Vue).
2. **Índices** (el tag `<cu-x>` debe aparecer en TODOS o en ninguno):
   - `docs/skills/use-comegen/SKILL.md` (tablas de archivos/variantes/índice).
   - `docs/DOCS.md`, `COMPONENTS-GUIDE.md` y `docs/skills/use-comegen/` (docs para humanos).
   - `.opencode/skills/comegen-ui/` y `.agents/skills/use-comegen/` son symlinks del canonical: no se editan aparte.

## Regla de oro

> **El `.ce.vue` siempre gana.** Si la doc dice algo distinto a lo que el `.ce.vue` expone, la doc está mal.

## Delegación

No reescribas las convenciones acá: cargá la skill **`comegen-ui-docs`**, que tiene la guía de extracción, la plantilla, las convenciones y el checklist de auditoría.
