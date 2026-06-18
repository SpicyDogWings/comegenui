# Cómo extraer la API pública de un `.ce.vue`

Esta guía explica paso a paso cómo leer un archivo `*.ce.vue` y obtener toda la información necesaria para escribir su `.md` correspondiente.

> **Antes de empezar:** abrí el `.ce.vue` y mantenelo abierto durante todo el proceso. No lo cierres hasta haber terminado el `.md`.

## Paso 1 — Identificar el tag

Mirá el archivo `*.ts` correspondiente. El tag está en `customElements.define("...", ...)`.

```ts
// Alert.ts
customElements.define("cu-alert", ...);
//             ^^^^^^^^^
```

Anotá: `cu-alert`. Es el nombre del tag en HTML.

## Paso 2 — Extraer props

En el `<script setup>` del `.ce.vue`, buscá `defineProps({...})`. Cada entrada es una prop pública.

```ts
defineProps({
  theme: { type: String, required: false, default: "", validator: isValidTheme },
  color: { type: String, required: false, default: "neutral" },
  variant: { type: String, required: false, default: "soft", validator: (v) => [...] },
  close: { type: Boolean, required: false, default: false },
  // ...
});
```

Para cada prop, anotá:

| Campo | Cómo obtenerlo |
|-------|----------------|
| Nombre | La clave del objeto |
| Tipo | `type: X` (convertir tipos Vue a tipos TS legibles: `String` → `string`, `Boolean` → `boolean`, `Number` → `number`, `Array` → `array`, `Object` → `object`) |
| Default | `default: X` (o `default: () => [...]` para arrays/objetos) |
| Valores válidos | Si hay un `validator` con un array literal, extraer los valores |
| Descripción | **No está en el código.** Tenés que inferirla del contexto. Si no es claro, dejá la descripción vacía o genérica. |

> **Props con `Object` como tipo:** casi siempre son objetos con keys de tema. Documentá la forma inferida o poné `object` y un ejemplo.

> **Prop `startValue`:** existe en componentes de formulario (`Input`, `Textarea`, `Checkbox`, `Switch`). Sirve para el método `.reset()`. Documentá su rol.

> **Prop `hightContrast` (typo intencional):** está mal escrita, pero es la que está expuesta. Documentá con `hightContrast`, no con `highContrast`. Ver `doc/notes/02-hightcontrast.md` en la skill principal.

### Props que se pasan pero no se documentan

Si en el template del `.ce.vue` ves una prop que **no** está en `defineProps` (ej: `getColorMap(...).surface` que se pasa como `menu-bg`), eso es una prop **interna** que el `.vue` usa. No la listes en el `.md` salvo que sea visible para el usuario.

## Paso 3 — Extraer eventos custom

Buscá dos cosas en el `.ce.vue`:

### 3a. `defineEmits([...])`

```ts
const emit = defineEmits(["open", "close", "edit-save"]);
```

Estos eventos **se re-emiten directamente** con `emit('nombre', $event)`. El payload es lo que llegue del `.vue` interno.

### 3b. Helper `ceEmit(...)` o `host.dispatchEvent(...)`

```ts
function ceEmit(event: string, payload: unknown) { ... }
// ...
@update:currentPage="ceEmit('update:currentPage', $event)"
```

El primer argumento de `ceEmit` es el nombre del evento. El payload es `$event` o un valor hardcodeado.

> **Si un evento aparece en el `.vue` interno (ej: `row-click` en `AdvancedTable.vue`) pero no se reenvía en el `.ce.vue`, no lo documentes.** El usuario final no puede escucharlo.

Para cada evento, anotá:

| Campo | Cómo obtenerlo |
|-------|----------------|
| Nombre | El string que se pasa a `emit()` o `ceEmit()` |
| Payload | Mirar el template: `ceEmit('save', $event)` → el payload es lo que el `.vue` interno pasó al `$event`. Si es un literal (ej: `ceEmit('close', $event)` con `$event` siendo algo concreto), documentá el tipo |
| Descripción | Inferirla del nombre o del contexto |

## Paso 4 — Extraer slots

Buscá en el `<template>` del `.ce.vue` los slots que se forwardean:

```html
<template>
  <Inner>
    <template #icon>
      <slot name="icon"></slot>     <!-- slot "icon" -->
    </template>
    <slot></slot>                    <!-- slot default -->

    <template #footer>
      <slot name="footer"></slot>    <!-- slot "footer" -->
    </template>
  </Inner>
</template>
```

> **Solo se documentan los slots que el `.ce.vue` explícitamente forwardea.** Si el `.vue` interno acepta un slot que el `.ce.vue` no menciona, ese slot **no está disponible** para el usuario final.

Caso especial: en el `.ce.vue` de `<cu-table>`, hay un patrón con slots anidados:

```html
<template #header="{ column }">
  <slot name="header" :column="column" :color="props.color" :variant="props.variant">
    <slot :name="`header-${column.key}`" :column="column" ...>
      {{ column.label || column.key }}
    </slot>
  </slot>
</template>
```

Esto significa que el usuario puede usar tanto `slot="header"` como `slot="header-{key}"`, y el interno recibe `{ column, color, variant }` como props de slot. Documentá los bindings en una columna aparte.

## Paso 5 — Extraer métodos

Buscá `defineExpose({...})` en el `.ce.vue`. Cada entrada es un método público.

```ts
defineExpose({
  open: () => modalRef.value?.open(),
  close: () => modalRef.value?.close(),
  toggle: () => modalRef.value?.toggle(),
  get isOpen() { return modalRef.value?.isOpen || false },
});
```

Para cada método:

| Campo | Cómo obtenerlo |
|-------|----------------|
| Nombre | La clave del objeto (con `get`/`set` si es getter/setter) |
| Args | Mirar la firma de la función |
| Descripción | Inferirla del nombre o del comentario si hay |

> **Si el `.ce.vue` no llama a `defineExpose`, el componente no expone métodos.** Aunque el `.vue` interno los tenga, no son accesibles para el usuario.

## Paso 6 — Extraer el default de `color` y `variant`

Esto suele estar en `defineProps`:

```ts
color: { type: String, required: false, default: "neutral" },
variant: { type: String, required: false, default: "soft" },
```

Anotá ambos. Son necesarios para la tabla de variantes en `SKILL.md`.

## Paso 7 — Verificar props forwardeadas (slots y Column)

Algunos `.ce.vue` reenvían **todo** sin filtrar (ej: `<cu-table>` pasa `columns` tal cual al `AdvancedTable.vue`). En esos casos:

1. Documentá la interface que está **tipada en el `.ce.vue`**.
2. Si el `.vue` interno acepta campos adicionales, **mencionálos en una sección separada** ("Campos extendidos / forwarded") con la advertencia de que no están tipados en el `.ce.vue` pero funcionan.

Ver `componentes/cu-table.md` para el ejemplo concreto de cómo se documenta esto.

## Paso 8 — Verificar tipos de props complejas

Para props que aceptan arrays u objetos (ej: `items`, `options`, `columns`, `data`, `filters`):

1. **No se pueden pasar como atributo HTML** (se reciben como `string` y los validadores fallan).
2. Se asignan como **propiedad JS** sobre el elemento host:

   ```js
   const select = document.getElementById('miSelect');
   select.options = [{ value: 'a', label: 'A' }];
   ```

3. **Excepción:** `<cu-table>` acepta `search-fields` como atributo HTML en formato JSON:

   ```html
   <cu-table search-fields='["nombre","email"]'></cu-table>
   ```

Esto debe quedar documentado en el `.md` (ver [convenciones.md](convenciones.md#arrays-y-objetos-como-propiedades-js)).

## Paso 9 — Leer la vista de la skill principal

Antes de escribir el `.md`, leé el archivo `.md` **existente** del mismo componente (si hay). Te da:

- El estilo de redacción del proyecto.
- La estructura de secciones (títulos, orden, etc.).
- Ejemplos de uso típicos que se pueden reutilizar.

No copies ciegamente: si el `.md` viejo tiene datos incorrectos (verificado en pasos anteriores), corregilos.

## Paso 10 — Escribir el `.md`

Usá la [plantilla](plantilla.md). Llená cada sección con los datos extraídos. Después, pasá el [checklist de auditoría](checklist-auditoria.md).

---

## Resumen: qué leer y qué ignorar

| Archivo | ¿Leer para docs? | ¿Por qué? |
|---------|-------------------|------------|
| `<Nombre>.ce.vue` | **Sí, siempre** | Fuente de verdad de la API |
| `<Nombre>.vue` | Solo para entender semántica | No es la API pública |
| `<Nombre>.ts` | Solo para confirmar el tag | Trivial |
| `AdvancedTable.vue` | Solo para entender `Column` extendido | No es accesible directamente |
| `EditableTableCell.vue` | No | Detalle interno |
| `useTableData`, `useSearch`, etc. (composables) | No | Detalle interno |
