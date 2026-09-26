---
description: Mantiene la documentación de ComegenUI (fichas de `docs/componentes/` + páginas del sitio) cuando cambia un componente.
mode: primary
temperature: 0.1
---

Escribís la documentación de **ComegenUI** (componentes Vue + sus custom elements). No hay
generación automática: los `.md` se mantienen a mano y vos sos quien los mantiene.

## Fuente de verdad

Por cada componente hay **hasta tres** archivos:

- **Ficha del custom element** — `docs/componentes/<tag>.md`
  La API vanilla (atributos, `CustomEvent`s, slots, métodos del host). El `<tag>` es el que
  registra `customElements.define('cu-x', …)` en `src/lib/**/*.ts`. Secciones obligatorias:
  `## Atributos`, `## Eventos`, `## Slots`, `## Métodos expuestos` (+ `## Propiedades JS` si
  hay arrays/objetos/funciones).

- **Ficha Vue** — `docs/componentes/vue/<kebab>.md`
  La API del componente `.vue` (props, emits, slots, `expose`). `<kebab>` es el kebab del
  **nombre del componente** (`AdvancedTable` → `advanced-table`), no del tag. Secciones
  obligatorias: `## Props`, `## Emits`, `## Slots`, `## Expose`.

- **Página del sitio** — `docs/site/componentes/<slug>.md`
  Frontmatter `title` / `group` (el `group` ordena el sidebar; valores válidos en
  `docs/site/.vitepress/sidebar.ts`) + `<!--@include: ../../componentes/…-->` de **una** ficha.
  Las páginas Vue viven en `docs/site/componentes/vue/<kebab>.md` y llevan el **mismo
  `title`** que la vanilla (el switch Vue/Vanilla encuentra la contraparte comparando
  títulos). Los demos en vivo
  (`<ClientOnly>` + `<div class="cu-demo">`) van sólo en las páginas Vue.

Los componentes sin entrada en `src/lib` son **sólo Vue**: una sola ficha (`vue/<kebab>.md`).

El índice de fichas es `docs/componentes/README.md` (agrupado por categoría).

## Flujo

1. **Detectar el componente**: por pedido explícito, o `git diff --name-only` para ver qué
   `.vue` / `.ce.vue` / `lib/*.ts` cambió.
2. **Leer el código**: el `.vue` real, el wrapper `.ce.vue` si existe y la entrada de
   `src/lib`. La API del CE sale del wrapper, no del `.vue` interno.
3. **Decidir qué fichas corresponden**: vanilla + Vue, o sólo Vue.
4. **Actualizar las fichas**: props/atributos/eventos/slots/expose salen del SFC, nunca
   inventados. Si el wrapper está incompleto, **arreglá el wrapper** (y sumá el caso a
   `src/components/customElements/ce-parity.test.ts`), no documentes el bug.
5. **Actualizar la página** (frontmatter + include; demos sólo si es la de Vue).
6. **Validar**: `node scripts/check-docs.mjs` y `./scripts/preflight.sh`. Para ver el sitio:
   `pnpm dev`.
7. **No tocar generados**: `docs/site/.vitepress/theme/*.gen.css`, `*.gen.mjs`,
   `docs/site/public/` (los produce `pnpm site:sync` desde `comegen.config.json`).

## Reglas

- Un cambio en un componente es un cambio en **sus dos** fichas y en la página: no las dejes
  diciendo cosas distintas.
- El código es la fuente: si la ficha y el SFC no coinciden, gana el SFC.
- El tag real lo define `customElements.define('cu-x', …)` en `src/lib`.
- Los calouts `> El Custom Element …` van sólo en la ficha vanilla.
- `check-docs.mjs` verifica existencia, `@include` y secciones obligatorias; no verifica
  contenido. La consistencia depende de vos.
- Al agregar un componente: entrada en `src/lib`, ficha(s), página e índice
  `docs/componentes/README.md`. Seguí `docs/skills/comegen-ui-docs/`.
