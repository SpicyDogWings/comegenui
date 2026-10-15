# Nota 10 — Ficha unificada (piloto: Button)

**Fecha:** 2026-10-14
**Severidad:** Info (decisión de arquitectura, piloto con un solo componente)

> **Estado: revertido (2026-10-15).** Button volvió a **dos fichas** (`cu-button.md` +
> `vue/button.md`) y la API se comparte por **partials** (`docs/versiones/5.1.1/partials/button/`). El modelo
> vigente es «siempre 2 fichas, compuestas por partials» — ver la skill `documenter` y la
> **nota 11**. Lo de abajo queda como registro del piloto: el conteo de descripciones vacías que
> menciona (469 en 64 fichas) ya no aplica — hoy lo mide `gen-api --check` sobre los partials,
> con el tope en `scripts/docs-baseline.txt`.

## Decisión

Hasta ahora cada componente tenía **dos fichas** (`docs/versiones/5.1.1/componentes/<tag>.md` y
`docs/versiones/5.1.1/componentes/vue/<kebab>.md`) y **dos páginas**. En la práctica la ficha Vue era una copia
de la vanilla que se quedaba atrás: las tablas de API se generan del SFC, pero la prosa y los
ejemplos había que mantenerlos dos veces, y la prosa "de uso" (cuándo usarlo, límites) no
pertenece a ninguna de las dos.

Ahora:

- **Docs = referencia** (para humanos): qué es, sus variantes / tamaños / estados, sus ejemplos
  vivos y su API. Es una **ficha unificada**: una sola página por componente, con el código de
  las dos APIs en tabs `Vanilla | Vue` y el **custom element real** (build `esm-shared`) abajo
  de cada bloque.
- **Recipe = procedimiento** (para agentes): cuándo usarlo, pasos, qué puede y qué no puede.
  Vive en `skills/use-comegen/references/<kebab>.md` y es el lugar canónico de los límites.

Docs y recipe **dejan de decir lo mismo**: la ficha ya no lleva `## Uso en HTML plano` /
`## Uso en Vue`, `## Cuándo usarlo` ni `## Qué puede y qué no puede`.

## Cómo queda armado (mecánica)

- **Marcadores.** La ficha unificada lleva los dos juegos: `@api:atributos` / `@api:eventos` /
  `@api:metodos` (custom element) y `@api:props` / `@api:emits` / `@api:expose` (Vue). `## Slots`
  es **una sola sección** (el wrapper forwardea los slots del componente) y la inyecta el bloque
  del CE.
- **`scripts/gen-api.mjs`** detecta la ficha unificada (no existe `docs/versiones/5.1.1/componentes/vue/<kebab>.md`)
  e inyecta las tablas Vue en la ficha del CE.
- **`scripts/check-docs.mjs`** tiene `UNIFIED_VUE` (hoy `new Set(["button"])`). Un componente
  unificado: no necesita ficha Vue, no puede tener página `vue/<kebab>`, y su ficha vanilla
  **tiene** que llevar `@api:props` (si no, la API Vue se perdería en silencio).
- **`docs/site/.vitepress/sidebar.ts`** agrega las páginas unificadas **también al sidebar Vue**
  (la marca es el mismo `@api:props`): si no, el componente desaparecería del sidebar estando en
  modo Vue.
- **El switch de modo las ignora.** La página unificada aparece en las dos familias apuntando a
  la misma URL, así que no hay contraparte: `buildModeMap()` (`config.ts`) saltea los pares que
  apuntan al mismo link (no se auto-redirige) y `DocsModeSelect.vue` los trata como sin
  contraparte, así que el select se oculta.
- **Demos.** Un `.vue` por sección en `docs/site/examples/<componente>/<id>.vue` con el `<cu-x>`
  real dentro de `<VanillaDemo :use="['CuX']">` (receta: `docs/notes/09-demos-vanilla.md`) y su
  marcador `<!-- demo:id -->` debajo del bloque.

## Qué se borró con el piloto

- `docs/versiones/5.1.1/componentes/vue/button.md` y `docs/versiones/5.1.1/paginas/componentes/vue/button.md`.
- Los ejemplos Vue de Button (`ButtonVariantsExample.vue`, `ButtonStatesExample.vue`,
  `ButtonFormExample.vue`): la página única muestra el CE real, así que quedaban sin uso.

## De paso: el extractor ahora lee el JSDoc que ya estaba

`scripts/gen-api.mjs` salía en `—` en tres casos donde el JSDoc **ya existía** en el SFC:

- **emits**: el meta de `vue-component-meta` no llena la descripción de un evento, ni con el
  comentario puesto (se verificó con la versión instalada). Ahora la resuelve del SFC, igual
  que los métodos expuestos.
- **métodos expuestos como `const x = () => …`**: el patrón sólo miraba `function x()` y
  `x:`/`x,`/`x}`, así que los `const` quedaban afuera.
- **CE sin `ceEmit`** (`cu-button`, `cu-floating-button`, `cu-badge`, que registran el `.vue`
  directo): la tabla de eventos caía al meta crudo, sin descripción.

Con eso se llenaron ~61 celdas (métodos y emits de input, textarea, file-input, switch,
collapse, modal, theme-manager-modal, …) sin tocar un solo componente.

## Pendiente (cuando se generalice)

- `AGENTS.md` (regla 13) y la skill `documenter` siguen describiendo el esquema de **dos**
  fichas: hay que actualizarlos cuando el piloto se extienda.
- Quedan **469 celdas de descripción vacías en 64 fichas** (`scripts/docs-baseline.txt`): casi
  todas son props de los `.vue` **sin JSDoc** (el JSDoc es la fuente de la tabla). El chequeo
  de `check-docs.mjs` ya no deja que empeore, y el paso `guard.sh --docs` las reporta:
  `pendiente: 469 descripción(es) vacía(s) en 64 ficha(s)`.
- Los 50 componentes restantes siguen con el par de fichas. Al unificarlos, el trabajo por
  componente es: escribir la ficha unificada, borrar la ficha/página Vue, sumar el kebab a
  `UNIFIED_VUE` y revisar sus demos (los `.vue` PascalCase de la página Vue quedan sin uso).

## Si algo de esto se revierte

Volver al par de fichas de Button es restaurar dos archivos y borrar el kebab de `UNIFIED_VUE`
(la ficha unificada sigue siendo válida como ficha vanilla: los marcadores Vue quedarían sin
destino y `check-docs` lo marcaría).
