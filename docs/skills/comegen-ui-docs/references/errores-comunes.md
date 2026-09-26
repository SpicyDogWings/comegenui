# Errores comunes al documentar ComegenUI

Lista de errores frecuentes al crear o actualizar la documentación de un componente. Evitalos.

## 1. Documentar desde el `.vue` en vez del `.ce.vue`

**Síntoma:** la doc lista props, eventos o slots que están en `MiComponente.vue` pero el `.ce.vue` no los expone al host.

**Por qué pasa:** el `.vue` interno es más fácil de leer (sin `ceEmit`, sin wrappers de tema). Pero lo que el usuario final consume es el `.ce.vue`.

**Cómo evitarlo:** siempre empezar leyendo `MiComponente.ce.vue`. Si una prop no está en `defineProps` del `.ce.vue`, no la documentes.

**Caso real:** `<cu-table>` no re-emite `row-click`, `row-dblclick`, `cell-click` aunque `AdvancedTable.vue` los emita. La doc anterior los listaba por error.

## 2. Listar eventos que el `.ce.vue` no re-emite

**Síntoma:** la doc tiene un evento que parece lógico (`input`, `change`, `row-click`) pero al hacer `addEventListener` no se dispara.

**Por qué pasa:** los eventos custom no cruzan Shadow DOM por defecto. Si el `.ce.vue` no llama a `ceEmit(...)` o `defineEmits` con el evento, el usuario no puede escucharlo.

**Cómo evitarlo:** confirmar que el evento está en `defineEmits` o en algún `ceEmit(...)` del `.ce.vue`. Si no, **no lo listes**.

**Excepción:** los eventos nativos del DOM (`click`, `input`, `change`, `focus`, `blur`) sí burbujean automáticamente. Pero **no se llaman `input` o `change` en el Custom Element** — son los eventos nativos del `<input>` interno que burbujean al host. Si los listás, aclará que son nativos.

## 3. Documentar slots que el `.ce.vue` no forwardea

**Síntoma:** la doc menciona un slot (ej: `cell-{key}` en `<cu-table>`) pero al usarlo no aparece.

**Por qué pasa:** el `.vue` interno acepta ese slot, pero el `.ce.vue` no lo reenvía. El usuario solo ve los slots que el `.ce.vue` explícitamente menciona en su `<template>`.

**Cómo evitarlo:** verificar que el slot aparece como `<slot name="...">` o `slot="..."` en el `<template>` del `.ce.vue`.

**Caso real:** `<cu-table>` solo forwardea `header`, `header-{key}` y `empty`. No `cell-{key}` ni `search`.

## 4. Inventar props que el `.ce.vue` no tiene

**Síntoma:** la doc tiene una prop que parece útil pero el componente la ignora silenciosamente.

**Cómo evitarlo:** verificar cada prop contra `defineProps` del `.ce.vue`. Si no está, no la listes.

**Caso real:** la doc vieja de `<cu-checkbox>` mencionaba `checked` como prop alternativa a `modelValue`. No existe.

## 5. Confundir `variant` con el default

**Síntoma:** la doc dice "default `ghost`" pero el `.ce.vue` tiene `default: "none"`.

**Cómo evitarlo:** copiar el `default: X` literal del `defineProps` del `.ce.vue`. No asumir.

**Caso real:** `<cu-checkbox>` y `<cu-input>` tienen `variant: "none"` por default, no `"ghost"`. La doc anterior se equivocaba.

## 6. Confundir `color` con el default

**Síntoma:** la doc dice "default `neutral`" pero el `.ce.vue` tiene `default: "primary"`.

**Cómo evitarlo:** ídem anterior, copiar del `.ce.vue`.

**Caso real:** `<cu-select>` tiene `color: "primary"` por default, no `"neutral"`.

## 7. Asumir camelCase y no aclarar kebab-case

**Síntoma:** la doc muestra `itemsPerPage="5"` como atributo HTML, pero el navegador lo ignora porque espera `items-per-page`.

**Cómo evitarlo:** listar las props que cambian de forma y agregar una nota. Ver la tabla en [convenciones.md](convenciones.md#camelcase--kebab-case-en-html).

## 8. Omitir la nota de "asignar como propiedad JS"

**Síntoma:** el usuario pone `<cu-select items="...">` como atributo HTML y no funciona.

**Cómo evitarlo:** para toda prop que sea `array` u `object`, agregar la nota:

> `xxx` se asigna como propiedad JS, no como atributo HTML.

## 9. Documentar props heredadas que no se exponen

**Síntoma:** la doc lista props que el `.vue` interno acepta (ej: `menu-bg`, `tableMaxHeight`) pero el `.ce.vue` no las declara.

**Cómo evitarlo:** verificar en `defineProps` del `.ce.vue`. Si no está, no la listes aunque esté en el `.vue` interno.

**Caso real:** `<cu-table>` no expone `tableMaxHeight` aunque `AdvancedTable.vue` la acepte. Si se quiere documentar, hay que agregarla al `.ce.vue` primero.

## 10. Documentar `defineProps` "tipadas" en el `.ce.vue` como si fuesen la API completa

**Síntoma:** la interface TypeScript del `.ce.vue` no incluye `sortable`, `width`, `align` para `Column` de `<cu-table>`, pero esos campos funcionan. La doc los ignora por error.

**Cómo evitarlo:** verificar también el `.vue` interno (en este caso `AdvancedTable.vue`) para ver qué campos acepta. Si el `.ce.vue` los pasa tal cual, documentarlos en una sección "Campos extendidos (forwarded)" con la advertencia de que no están tipados en el `.ce.vue`.

## 11. Olvidar el `e.detail` en la documentación de eventos

**Síntoma:** el usuario lee "Se emite al cambiar" pero no sabe qué viene en el payload.

**Cómo evitarlo:** siempre incluir la columna "Payload (`e.detail`)" en la tabla de eventos, con la forma del objeto.

## 12. Mezclar HTML y Vue en el archivo equivocado

**Síntoma:** la ficha vanilla mete `<cu-button>` dentro de un `<template>` de Vue, o importa el `.vue`; la ficha Vue usa `<script src="dist/...">`.

**Por qué pasa:** son dos archivos del mismo componente y es fácil escribir la forma del otro.

**Cómo evitarlo:** una forma por archivo. Vanilla (`docs/componentes/<tag>.md`) = HTML plano + UMD (`<script src="dist/...">` + `<cu-x>`); Vue (`docs/componentes/vue/<kebab>.md`) = `<script setup lang="ts">` + `<template>` con el import del `.vue` (`@/components/...`). Ver [convenciones.md](convenciones.md#secciones-curadas-dos-archivos).

## 13. Asumir que un componente en `archived/` o `labs/` no se distribuye

**Síntoma:** la doc no incluye `<cu-select>` (en `labs/`) o incluye `<cu-select-native>` (en `archived/`) como si no existieran.

**Cómo evitarlo:** el build toma `src/lib/**/*.ts` (un entry por componente). Si no hay entry, no se distribuye. Ver `docs/notes/01-build-glob.md`.

## 14. Duplicar la ficha dentro de la página del sitio

**Síntoma:** la página (`docs/site/componentes/...`) repite el contenido de la ficha en vez de incluirla.

**Cómo evitarlo:** la página sólo tiene frontmatter (`title`/`group`) + `<!--@include-->` de **una** ficha (y los demos, si es la de Vue). El cuerpo vive en un solo lugar: la ficha.

## 15. Olvidar documentar variantes que sí acepta el componente

**Síntoma:** la doc lista solo algunas variantes pero el `.ce.vue` tiene más en su `validator`.

**Cómo evitarlo:** copiar los valores del `validator` del `.ce.vue`. Si el validador dice `["outlined", "soft", "ghost", "subtle", "none"]`, listar las cinco.

**Caso real:** `<cu-checkbox>` acepta `none`, pero algunas fichas viejas no la listaban.

## 16. Confundir `event` nativo con `evento` custom en el payload

**Síntoma:** la doc dice que el evento `change` en `<cu-checkbox>` tiene `e.detail` con `e.target.checked`, pero en realidad el `.ce.vue` lo re-emite con un boolean.

**Cómo evitarlo:** leer el template del `.ce.vue` y ver qué se pasa a `ceEmit` o `emit`. Si es `$event`, ver qué emite el `.vue` interno en ese `@evento`.

## 17. Omitir la versión HTML de las props booleanas

**Síntoma:** la doc dice `disabled` como prop, pero no aclara que en HTML se usa sin valor.

**Cómo evitarlo:** agregar una nota general al inicio de la sección de props:

> Atributos booleanos: en HTML se usan sin valor: `<cu-NOMBRE disabled>`

## 18. No documentar el default de `variant` y `color`

**Síntoma:** la ficha lista la prop pero no su default real (que varía por componente).

**Cómo evitarlo:** cada ficha lista el default de `color` y `variant` en su tabla de props, tal como está en el `.ce.vue`/`.vue`. No hay matriz central.

## 19. Documentar props que vienen de `interface Column` del `AdvancedTable.vue`

**Síntoma:** la doc de `<cu-table>` lista `select.options`, `autocomplete.items`, `textarea`, `input` como sub-objetos de `Column`.

**Por qué pasa:** copiar la interface de `AdvancedTable.vue` (interno) en vez de la del `.ce.vue`.

**Cómo evitarlo:** la interface que va en el `.md` es la del `.ce.vue`. Los campos adicionales del interno van en "Campos extendidos".

## 20. Inventar descripciones

**Síntoma:** la columna "Descripción" de las props dice "..." sin decir nada útil.

**Cómo evitarlo:** si no podés inferir una descripción clara, poné algo genérico pero honesto ("Valor X" en vez de inventar). Si el nombre de la prop es autoexplicativo (`disabled`, `placeholder`), la descripción puede ser mínima o ausente.
