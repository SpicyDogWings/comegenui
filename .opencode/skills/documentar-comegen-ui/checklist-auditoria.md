# Checklist de auditoría

Usá esta lista cada vez que revises un `.md` contra su `.ce.vue`. Marcar cada ítem.

## Pre-auditoría

- [ ] Tengo abierto el `.md` a auditar.
- [ ] Tengo abierto el `.ce.vue` correspondiente.
- [ ] Tengo abierto el archivo `.ts` (para confirmar el tag).
- [ ] (Opcional) Tengo abierto el `.vue` interno para entender semántica, **pero no para documentar**.

---

## 1. Tag y metadatos

- [ ] El título del `.md` es `# \`<cu-xxx>\`` con el tag correcto (verificar en `.ts`).
- [ ] El archivo se llama `cu-xxx.md` (kebab-case, igual que el tag).
- [ ] El archivo está en `.opencode/skills/comegen-ui/componentes/`.
- [ ] Hay un link `[← Volver](../SKILL.md)` después de la descripción.
- [ ] Hay un `---` separando encabezado del cuerpo.
- [ ] La descripción es funcional (1 línea), no técnica.

---

## 2. Props

### Cobertura

- [ ] Cada prop en `defineProps` del `.ce.vue` está listada en la tabla de props del `.md`.
- [ ] Ninguna prop listada en el `.md` falta en `defineProps` del `.ce.vue`.

### Datos correctos por prop

Para **cada** prop listada, verificar:

- [ ] El nombre coincide exactamente (respetar `camelCase`).
- [ ] El tipo es el correcto (`type: String` → `string`, etc.).
- [ ] El `default` es el correcto (especialmente `color` y `variant`).
- [ ] Si hay `validator` con array de strings, los valores válidos están listados en la descripción.
- [ ] Si la prop es `array` u `object`, hay una nota explícita: "se asigna como propiedad JS, no como atributo HTML".
- [ ] Si la prop es `boolean`, está claro que se usa sin valor en HTML.

### Props camelCase → kebab-case

- [ ] Si la prop cambia de forma en HTML (ej: `readOnly` → `readonly`, `itemsPerPage` → `items-per-page`), hay una nota al respecto.
- [ ] Los ejemplos de uso en HTML usan la forma kebab-case.

### Props específicas de tema

- [ ] Si el componente tiene `theme`, `color`, `variant`, `hightContrast`, están en la tabla con los defaults correctos.
- [ ] `hightContrast` está escrito con el typo (no corregido a `highContrast`).
- [ ] El default de `color` no es siempre "neutral" — verificar el `.ce.vue` (ej: `<cu-select>` tiene `primary`).

---

## 3. Eventos

### Cobertura

- [ ] Cada evento en `defineEmits` del `.ce.vue` está listado.
- [ ] Cada `ceEmit(...)` en el `.ce.vue` está listado.
- [ ] **No** hay eventos listados en el `.md` que no aparezcan en el `.ce.vue` (ni en `defineEmits` ni en `ceEmit`).
- [ ] Los eventos nativos del DOM (`click`, `input`, `change`, `focus`, `blur`, `mouseenter`, `keydown`) **no** están listados como eventos custom, salvo que haya aclaración.

### Datos correctos por evento

Para **cada** evento listado, verificar:

- [ ] El nombre coincide con el string pasado a `defineEmits` o `ceEmit`.
- [ ] El payload está bien tipado en la columna "Payload (`e.detail`)". Verificar en el `.ce.vue` qué se pasa a `$event`.
- [ ] Si el payload es `—` (sin detail), la columna lo dice.

### Eventos nativos vs custom

- [ ] Si el `.md` menciona que un evento nativo (`input`, `change`) está disponible, verifica que efectivamente burbujee o que esté re-emitido.
- [ ] Si hay ambigüedad, agregar una nota: "Los eventos nativos del DOM burbujean automáticamente al host desde el Shadow DOM."

### Eventos no re-emitidos (caso `<cu-table>`)

- [ ] `row-click`, `row-dblclick`, `cell-click` **no** están listados (no se re-emiten).
- [ ] Si se mencionan, es con la advertencia explícita: "AdvancedTable.vue los emite pero el .ce.vue no los re-emite al host".

---

## 4. Slots

### Cobertura

- [ ] Cada `<slot name="...">` o `slot="..."` en el `<template>` del `.ce.vue` está listado.
- [ ] **No** hay slots listados en el `.md` que no aparezcan en el `<template>` del `.ce.vue`.
- [ ] Si el `.ce.vue` usa `slot="nombre"` (HTML nativo) en su template, el `.md` dice "slot HTML nativo, usar `slot=\"nombre\"`".

### Datos correctos por slot

Para **cada** slot listado, verificar:

- [ ] El nombre coincide (default = `default`).
- [ ] Si el slot tiene bindings (caso de `<cu-table>` con `header-{key}`), están en una columna aparte "Bindings".
- [ ] La descripción explica qué se espera que el usuario ponga dentro.

### Slots forwarded (caso `<cu-table>`)

- [ ] `<cu-table>` solo forwardea: `header`, `header-{key}`, `empty`. Verificar que no se listen `cell-{key}` ni `search`.
- [ ] Si aparecen `cell-{key}` o `search`, agregar advertencia de que no funcionan vía el `.ce.vue`.

---

## 5. Métodos

### Cobertura

- [ ] Cada entrada en `defineExpose` del `.ce.vue` está listada.
- [ ] **No** hay métodos listados en el `.md` que no estén en `defineExpose` del `.ce.vue`.

### Datos correctos por método

Para **cada** método listado, verificar:

- [ ] El nombre coincide (incluyendo `get`/`set` para getters/setters).
- [ ] Si es getter (sin paréntesis en JS), está marcado como `(getter)`.
- [ ] Los argumentos están en la firma (ej: `updateRow(index, newData)`).
- [ ] La descripción es clara.

### Métodos típicos

- [ ] Si el componente es de formulario y tiene `.get`/`.set`/`.reset`/`.focus`, están los cuatro (excepto `Autocomplete` que no tiene `.reset()`).
- [ ] Si el componente tiene overlay y tiene `.open`/`.close`/`.toggle`/`.isOpen`, están los cuatro.

---

## 6. Variantes y colores

- [ ] La columna "Default" de `variant` en la tabla de props coincide con el `default` del `.ce.vue`.
- [ ] Los valores válidos de `variant` en la descripción coinciden con el `validator` del `.ce.vue` (si lo hay).
- [ ] Si el `.ce.vue` no tiene `validator` para `variant` (caso de `<cu-dropdown-menu>`), la doc debe aclarar que pasa por defecto al `Button` interno.
- [ ] La tabla de variantes en `SKILL.md` está sincronizada con lo que dice cada `.md`.

### Tabla matriz de `SKILL.md`

- [ ] Las celdas de la matriz de `SKILL.md` reflejan los validadores reales de cada `.ce.vue`.
- [ ] Los defaults de `variant` por componente están en la tabla de `SKILL.md`.

---

## 7. Ejemplos de uso

- [ ] Hay al menos un ejemplo de uso en HTML plano con `<script src="dist/...">`.
- [ ] Los ejemplos **no** importan Vue ni usan sintaxis Vue (template, ref, reactive, etc.).
- [ ] Si hay props complejas (arrays/objetos), el ejemplo las asigna con `element.property = ...` (no como atributo).
- [ ] Si hay eventos, el ejemplo usa `addEventListener` con `e.detail`.
- [ ] Los ejemplos son copy-pasteables (sin partes truncadas con `...` sin contexto).

---

## 8. Estilo y convenciones

- [ ] Descripción en español.
- [ ] Sin emojis (salvo pedido explícito).
- [ ] Sin mención a Vue 3, `defineComponent`, ni detalles internos.
- [ ] Sin links a archivos del código fuente.
- [ ] Las props booleanas tienen nota sobre el uso sin valor en HTML.
- [ ] Las props `array`/`object` tienen nota sobre asignación como propiedad JS.
- [ ] Los slots usan sintaxis HTML `slot="nombre"` (no `#nombre` de Vue) en los ejemplos.

---

## 9. Verificación cruzada con `SKILL.md`

- [ ] El componente está listado en el índice de `SKILL.md`.
- [ ] El nombre del tag en `SKILL.md` coincide con el del archivo `.ts`.
- [ ] El tamaño de bundle en `SKILL.md` (si está) coincide aproximadamente con el real (puede ser aproximado).

---

## 10. Verificación de regresiones

- [ ] Buscar `hightContrast` en el `.md` (debe estar, no `highContrast`).
- [ ] Buscar `modelValue` (en camelCase en la tabla).
- [ ] Buscar referencias a eventos no re-emitidos (`row-click`, `cell-click` para `Table`).
- [ ] Buscar props inexistentes (`checked` para `Checkbox`/`Switch`, `cell-{key}` para `Table`).

---

## Resultado

Si marcaste todas las casillas, el `.md` está alineado con el `.ce.vue`.

Si encontraste discrepancias, **el `.md` se corrige**, no el `.ce.vue` (salvo que el `.ce.vue` tenga un bug real, lo cual se registra en `doc/notes/`).

## Resumen rápido por componente

| Componente | Tag | Verificaciones especiales |
|------------|-----|---------------------------|
| `Alert` | `cu-alert` | NO documentar métodos `open`/`close`/`toggle` (no existen). SÍ documentar evento `update:show`. |
| `Badge` | `cu-badge` | No emite eventos, no expone métodos. |
| `Button` | `cu-button` | No re-emite eventos; aclarar que `click` es nativo. |
| `Checkbox` | `cu-checkbox` | NO prop `checked`. Default `variant: "none"`. |
| `DropdownMenu` | `cu-dropdown-menu` | `position`/`align`/`placement` separados. Sin validador en `variant`. |
| `Input` | `cu-input` | Default `variant: "none"`. NO eventos custom `input`/`change`. |
| `Label` | `cu-label` | No tiene `variant`. Slot por defecto (envuelve al input). |
| `Modal` | `cu-modal` | No tiene `color`/`variant`. Distinguir `close` vs `closed`. |
| `Pagination` | `cu-pagination` | Atributos con kebab-case: `current-page`, `items-per-page`, etc. |
| `Select` | `cu-select` | Default `color: "primary"` (NO neutral). Variante `link` SÍ es válida. |
| `Switch` | `cu-switch` | NO prop `checked`. NO prop `variant`. Tiene `size` con `sm`/`md`. |
| `Table` | `cu-table` | NO re-emite `row-click`/`row-dblclick`/`cell-click`. Slots solo `header`/`header-{key}`/`empty`. Interface `Column` del `.ce.vue` (no del `AdvancedTable.vue`). |
| `Textarea` | `cu-textarea` | Default `variant: "none"`. NO eventos custom `input`/`change`. `noResize` → `no-resize`. |
| `Autocomplete` | `cu-autocomplete` | NO `.reset()`. `readOnly` → `readonly` en HTML. `minChars` → `min-chars`. |
