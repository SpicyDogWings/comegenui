# Nota 04 — Eventos nativos vs eventos re-emitidos por el `.ce.vue`

**Fecha:** 2026-06-18
**Severidad:** Info (confusión común, ya documentada en `SKILL.md`)
**Estado:** Documentado (parcialmente superado el 2026-09-26: `cu-modal` suma `cancel`/`accept`; los `row-*` de `cu-table` se eliminaron por ser emits muertos)

## Problema

El Shadow DOM aísla los elementos internos. Sin embargo, los **eventos nativos** del DOM (`click`, `input`, `change`, `focus`, `blur`, `mouseenter`, `keydown`, etc.) tienen `composed: true` por defecto y **burbujean automáticamente** al elemento host del Custom Element. Esto significa que `<cu-button>.addEventListener('click', ...)` funciona sin que el `.ce.vue` haga nada.

Los **eventos custom** (`update:modelValue`, `select`, `open`, `close`, etc.) NO se re-emiten automáticamente. El `.ce.vue` debe hacerlo explícitamente con `ceEmit()` o `defineEmits`.

## Comportamiento por componente

| Componente | Eventos nativos que burbujean | Eventos custom re-emitidos |
|---|---|---|
| `<cu-alert>` | (no escucha nativos) | `close`, `open`, `update:show` |
| `<cu-autocomplete>` | `input`, `change`, `focus`, `blur` | `update:modelValue`, `select`, `blur` |
| `<cu-badge>` | todos | (ninguno) |
| `<cu-button>` | `click`, `focus`, `blur`, etc. | (ninguno) |
| `<cu-checkbox>` | `click`, `focus`, `blur` | `update:modelValue`, `change` |
| `<cu-dropdown-menu>` | `click` en items | `open`, `close` |
| `<cu-input>` | `input`, `change`, `focus`, `blur` | `update:modelValue` |
| `<cu-label>` | `click` | (ninguno) |
| `<cu-modal>` | (no escucha nativos) | `close`, `opened`, `closed`, `cancel`, `accept` |
| `<cu-pagination>` | `click` en botones | `update:currentPage`, `update:itemsPerPage` |
| `<cu-select>` | `focus`, `blur` | `update:modelValue`, `select`, `change`, `close`, `blur` |
| `<cu-switch>` | `click`, `focus`, `blur` | `update:modelValue`, `change` |
| `<cu-table>` | (clicks en celdas/filas NO se re-emiten como custom) | `update:currentPage`, `update:itemsPerPage`, `update:search`, `edit-start`, `edit-save`, `edit-cancel`, `edit-error` |
| `<cu-textarea>` | `input`, `change`, `focus`, `blur` | `update:modelValue` |

## Caso especial: `<cu-table>` (resuelto)

El `AdvancedTable.vue` interno **declaraba** `row-click`, `row-dblclick` y `cell-click` en
`defineEmits` pero nunca los emitía; el wrapper los reenviaba y la ficha los listaba por error. El
2026-09-26 se eliminaron del `.vue` y del `.ce.vue`, y las tablas generadas ya no los muestran. Para
clicks usá el `click` nativo (burbujea desde el shadow DOM) con `e.composedPath()`.

## Cómo se documenta actualmente

En `SKILL.md`, sección "Notas técnicas", se aclara:

> Los eventos nativos del DOM (`click`, `input`, `change`, `focus`, `blur`) **burbujean automáticamente** desde el Shadow DOM al elemento host, por lo que se pueden escuchar con `addEventListener` sobre el host sin configuración adicional. Los Custom Elements **no re-emiten** `input`/`change` salvo que la doc del componente lo indique explícitamente.

Y en cada `.md` se aclara por componente qué eventos custom existen y qué nativos se pueden escuchar.

## Posibles mejoras (no urgentes)

### A. Estandarizar la convención de re-emitir `change`

Algunos componentes (Input, Textarea) NO re-emiten `change` aunque internamente lo escuchen. Si se decide estandarizar, agregar `@change="ceEmit('change', $event)"` en cada `.ce.vue` correspondiente.

> **2026-10-06:** `<cu-select>` ya lo hace — emite `change` (valor nuevo) al elegir una
> opción y en `set()`/`reset()`, y el `.ce.vue` lo forwardea. Sirve de referencia para el
> resto de los componentes que aún no lo hacen.

### B. Re-emitir `click` en `<cu-button>`

Técnicamente el evento `click` nativo ya burbujea, por lo que `button.addEventListener('click', ...)` funciona. Pero si se quiere un evento `cu-button-click` semánticamente explícito, agregarlo.

### C. Exponer eventos de fila en `<cu-table>`

Ver "Caso especial" arriba.

## Recomendación

No hacer cambios hasta tener feedback concreto de usuarios. La convención actual (eventos custom para lógica de negocio, eventos nativos para interacción directa) es razonable y está documentada.
