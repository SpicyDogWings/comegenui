# AdvancedTable — `<cu-table>` / `<AdvancedTable>`

Tabla de datos con búsqueda, filtros, ordenamiento, paginación, edición inline y badges/botones por
celda.

## Cuándo usarlo

Para mostrar y operar colecciones de filas: listados con búsqueda/paginación, ordenamiento, edición
in-place o botones por fila. Si sólo necesitás una grilla estática, alcanza un `<table>` de HTML.

## Receta

1. Las columnas y las filas van **como propiedad JS**: `tabla.columns = [...]` y `tabla.data = [...]`.
   No funcionan como atributo (la única excepción es `search-fields`, que sí acepta un JSON string).
2. Búsqueda y paginación se habilitan **por atributo**: `search-enabled` y `pagination` (en el CE
   vienen apagadas), más `show-page-size` / `items-per-page` si las querés.
3. Cada columna es `{ key, label, ... }`. Para habilitar la edición: `editable: true` (se abre con
   click) o `inlineEdit: true` (editor siempre visible). El editor se elige con `inputType`:
   `'input' | 'textarea' | 'select' | 'autocomplete' | 'date' | 'switch'`.
4. Escuchás `edit-save` para persistir y `edit-error` para validar. Los clicks de fila se leen del
   `click` nativo (los eventos `row-click`/`cell-click` no se emiten).
5. Por código: `updateRow(index, patch)`, `getData()`, `getRow(index)`, `removeRow(index)`,
   `addRow(row)`, `pushData(rows)`.

```html
<!-- HTML plano (UMD) -->
<script src="dist/CuTable.core.umd.js"></script>

<cu-table id="t" color="primary" variant="soft" search-enabled pagination show-page-size items-per-page="5"></cu-table>

<script>
  const t = document.getElementById('t');

  t.columns = [
    { key: 'nombre', label: 'Nombre', editable: true },
    { key: 'email',  label: 'Correo', editable: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
    { key: 'rol',    label: 'Rol', sortable: 'string' },
    { key: 'acciones', label: '', buttons: (row) => [
      { label: 'Eliminar', color: 'danger', variant: 'ghost', onClick: (r) => t.removeRow(t.getData().indexOf(r)) },
    ]},
  ];
  t.data = [
    { nombre: 'Juan Pérez', email: 'juan@ejemplo.com', rol: 'Admin' },
    { nombre: 'María García', email: 'maria@ejemplo.com', rol: 'Usuario' },
  ];

  t.addEventListener('edit-save', (e) => console.log('guardar', e.detail));
  t.addEventListener('edit-error', (e) => console.warn('inválido', e.detail));
</script>
```

```vue
<!-- Vue -->
<script setup lang="ts">
import AdvancedTable from "@/components/data/AdvancedTable.vue";
import { ref } from "vue";

const columns = ref([
  { key: "nombre", label: "Nombre", editable: true },
  { key: "email", label: "Correo", editable: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
  { key: "rol", label: "Rol", sortable: "string" },
]);
const data = ref([
  { nombre: "Juan Pérez", email: "juan@ejemplo.com", rol: "Admin" },
  { nombre: "María García", email: "maria@ejemplo.com", rol: "Usuario" },
]);

function onEditSave(e: { index: number; column: { key: string }; value: unknown }) {
  console.log("guardar", e);
}
</script>

<template>
  <AdvancedTable
    :columns="columns"
    :data="data"
    color="primary"
    variant="soft"
    search-enabled
    pagination
    :items-per-page="5"
    @edit-save="onEditSave"
  />
</template>
```

## Qué puede y qué no puede

**Puede:** 6 colores (`primary`, `secondary`, `neutral`, `success`, `warning`, `danger`), 5
variantes (`solid`, `outlined`, `soft`, `ghost`, `subtle`), búsqueda (`searchEnabled`,
`searchFields`, `searchPlaceholder`, `searchValue`), filtros (`filters`), ordenamiento por columna
(`sortable`: `true`, `'string'`, `'number'`, `'boolean'`), paginación (`pagination`, `itemsPerPage`,
`showPageSize`, `pageSizeOptions`), edición por celda (`editable`, `inlineEdit`, `singleClick`,
`inputType`, `selectOptions`, `date`, `switch`, `validator`), badges y botones por celda, `actions`
(dropdown "..." automático al final) con header configurable (`actionsLabel` / `actions-label`,
default vacío), `rowDisabled` / `column.disabled` / `column.cellDisabled`, `loading`, `footer` (prop
o slot), `compact`, `tableMaxHeight` y los métodos `updateRow`, `getData`, `getRow`, `removeRow`,
`addRow`, `pushData`.

**No puede:**

- **Las props complejas van sólo por JS.** `columns`, `data`, `filters`, `actions`, `footer`,
  `pageSizeOptions` y `rowDisabled` se asignan como propiedad, nunca como atributo. La **única**
  excepción es `search-fields`, que acepta un JSON string: `search-fields='["nombre","email"]'`.
- **Los eventos de click de fila no se emiten.** `row-click`, `row-dblclick` y `cell-click` están
  declarados y el CE los bridgea, pero nadie los dispara. Usá el `click` nativo con
  `e.composedPath()` o resolvé con `buttons`/`badges`/`actions`.
- **No hay "lápiz".** La celda editable se abre con **click** (doble click si `singleClick: false`).
  El estado inline no agrega ícono: sólo deja el editor siempre visible.
- **`inputType: 'switch'` es la excepción:** el switch siempre está visible, no pasa por
  lápiz/inline ni por `validator`/`regex`, y al alternarlo emite `edit-save` con `value` booleano.
- **Campos no tipados pero funcionales:** `width`, `align`, `sortable` (y `inlineEdit`, `date`,
  `switch`) no están en la interface `Column` del `.ce.vue`, pero funcionan porque `columns` se
  reenvía tal cual al componente interno.
- **Defaults distintos entre CE y Vue:** en el CE `pagination` es `false` y `empty` es `""`; en el
  `.vue`, `pagination` es `true` y `empty` es `"No hay datos que mostrar"`. En HTML plano hay que
  poner `pagination` a mano.
- **No acepta `theme`** (ni el CE ni el `.vue`): el tema se define en `<html data-theme="...">`. El CE **sí** expone `inline-editing` global; una
  columna con `inlineEdit: true` gana sobre ese global.
- **El slot `footer` gana sobre la prop `footer`.**
- **Búsqueda sobre columnas `inputType: 'select'`:** matchea por la `label` de la opción, no por el
  `value` guardado.
- **Deshabilitado con prioridad fila > columna > celda.** Con `rowDisabled` la fila se atenúa, no
  edita y sus botones/acciones se deshabilitan.
- **Slots por columna:** `header-{key}` (scoped `{ column, color, variant }`), `cell-{key}` (scoped
  `{ row, column, index, value }`), `template` (fila completa), `search` (scoped `{ query, update }`),
  `empty` y `footer`. En `<cu-table>` se pasan como **slots nativos** (`<span slot="header-rol">…`):
  el CE los descubre del host, pero **no reciben el scope** (los scoped slots no existen en custom
  elements). En `<AdvancedTable>` (Vue) sí reciben el scope.
- **No hay eventos custom `input`/`change`** de la tabla; los nativos burbujean solos.

## API del custom element

### Atributos

<!-- @api:atributos -->
| Atributo | Tipo | Default | Descripción |
| ------ | ------ | ------ | ------ |
| `columns` | `Column[]` | `[]` | Definición de columnas (ver [Interfaz de columna](#interfaz-de-columna)). Se asigna como propiedad JS |
| `data` | `Record<string, any>[]` | `[]` | Filas de la tabla. Se asigna como propiedad JS |
| `empty` | `string` | `""` | Texto a mostrar cuando no hay datos. Si se omite, usa `"No hay datos que mostrar"` |
| `pagination` | `boolean` | `false` | Habilita paginación interna |
| `items-per-page` | `number` | `10` | Tamaño de página (atributo HTML: `items-per-page`) |
| `show-page-size` | `boolean` | `false` | Muestra selector de items por página (atributo HTML: `show-page-size`) |
| `page-size-options` | `number[]` | `[5, 10, 20, 50]` | Opciones del selector (atributo HTML: `page-size-options`). Se asigna como propiedad JS |
| `color` | `"primary" \| "secondary" \| "neutral" \| "success" \| "warning" \| "danger"` | `"neutral"` | Color semántico: `primary`, `neutral`, `success`, `warning`, `danger` |
| `variant` | `"solid" \| "outlined" \| "soft" \| "ghost" \| "subtle"` | `"soft"` | `solid`, `outlined`, `soft`, `ghost`, `subtle` |
| `search-enabled` | `boolean` | `false` | Habilita barra de búsqueda (atributo HTML: `search-enabled`) |
| `search-placeholder` | `string` | `"Buscar..."` | Placeholder del input de búsqueda (atributo HTML: `search-placeholder`) |
| `search-fields` | `string[]` | `[]` | Columnas donde buscar (atributo HTML: `search-fields`). Vacío = todas |
| `search-value` | `string` | `""` | Valor controlado del buscador (atributo HTML: `search-value`) |
| `filters` | `Record<string, any>` | `{}` | Filtros por columna. Se asigna como propiedad JS |
| `loading` | `boolean` | `false` | Muestra una barra de carga animada en el tope |
| `actions` | `unknown[]` | `[]` | Acciones de fila (botón "..." al final de cada fila). Se asigna como propiedad JS |
| `actions-label` | `string` | `""` | Texto del header de la columna de acciones. Default vacío. Atributo HTML: `actions-label` |
| `row-disabled` | `boolean \| ((row: Record<string, any>) => boolean)` | `false` | Deshabilita filas (ver [Deshabilitar filas, columnas y celdas](#deshabilitar-filas-columnas-y-celdas)). Se asigna como propiedad JS |
| `footer` | `FooterRow[]` | `[]` | Filas de footer (ver [Footer (API programática)](#footer-api-programática)). Se asigna como propiedad JS |
| `table-max-height` | `string` | `""` | Alto máximo del área scrolleable (CSS, ej. `40rem`). Atributo HTML: `table-max-height` |
| `inline-editing` | `boolean` | `false` | Editor visible siempre en las celdas editables, sin el lápiz (atributo HTML: `inline-editing`) |
| `compact` | `boolean` | `false` | Filas más compactas |
<!-- /@api:atributos -->

### Eventos

<!-- @api:eventos -->
| Evento | Payload (`e.detail`) | Descripción |
| ------ | ------ | ------ |
| `update:currentPage` | — | — |
| `update:itemsPerPage` | — | — |
| `update:search` | — | — |
| `edit-start` | — | — |
| `edit-save` | — | — |
| `edit-cancel` | — | — |
| `edit-error` | — | — |
<!-- /@api:eventos -->

### Slots

<!-- @api:slots -->
Ninguno.
<!-- /@api:slots -->

### Métodos expuestos

<!-- @api:metodos -->
| Método | Descripción |
| ------ | ------ |
| `updateRow` | Actualiza una fila por índice con los campos indicados. |
| `getData` | Devuelve una copia de las filas actuales, opcionalmente filtradas. |
| `getRow` | Devuelve una copia de la fila en el índice indicado. |
| `removeRow` | Elimina la fila en el índice indicado. |
| `addRow` | Agrega una fila al final si respeta las columnas existentes. |
| `pushData` | Agrega varias filas al final si respetan las columnas existentes. |
<!-- /@api:metodos -->

## API del componente Vue

### Props

<!-- @api:props -->
| Prop | Tipo | Default | Descripción |
| ------ | ------ | ------ | ------ |
| `columns` | `Column[]` | `[]` | — |
| `data` | `Record<string, any>[]` | `[]` | — |
| `empty` | `string` | `"No hay datos que mostrar"` | — |
| `pagination` | `boolean` | `true` | — |
| `itemsPerPage` | `number` | `10` | — |
| `showPageSize` | `boolean` | `false` | — |
| `pageSizeOptions` | `number[]` | `[5, 10, 20, 50]` | — |
| `color` | `"primary" \| "secondary" \| "neutral" \| "success" \| "warning" \| "danger"` | `"neutral"` | — |
| `variant` | `"solid" \| "outlined" \| "soft" \| "ghost" \| "subtle"` | `"soft"` | — |
| `searchEnabled` | `boolean` | `false` | — |
| `searchPlaceholder` | `string` | `"Buscar..."` | — |
| `searchFields` | `string[]` | `[]` | — |
| `searchValue` | `string` | `""` | — |
| `filters` | `Record<string, any>` | `{}` | — |
| `loading` | `boolean` | `false` | — |
| `actions` | `ButtonConfig[]` | `[]` | — |
| `actionsLabel` | `string` | `""` | — |
| `rowDisabled` | `boolean \| ((row: Record<string, any>) => boolean)` | `false` | — |
| `footer` | `FooterRow[]` | `[]` | — |
| `tableMaxHeight` | `string` | `""` | — |
| `inlineEditing` | `boolean` | `false` | — |
| `compact` | `boolean` | `false` | — |
<!-- /@api:props -->

### Emits

<!-- @api:emits -->
| Evento | Payload | Descripción |
| ------ | ------ | ------ |
| `update:currentPage` | — | — |
| `update:itemsPerPage` | — | — |
| `update:search` | — | — |
| `edit-start` | — | — |
| `edit-save` | — | — |
| `edit-cancel` | — | — |
| `edit-error` | — | — |
<!-- /@api:emits -->

### Slots

<!-- @api:slots-vue -->
| Slot | Descripción |
| ------ | ------ |
| `search` | — |
<!-- /@api:slots-vue -->

### Expose

<!-- @api:expose -->
| Método | Descripción |
| ------ | ------ |
| `updateRow` | Actualiza una fila por índice con los campos indicados. |
| `getData` | Devuelve una copia de las filas actuales, opcionalmente filtradas. |
| `getRow` | Devuelve una copia de la fila en el índice indicado. |
| `removeRow` | Elimina la fila en el índice indicado. |
| `addRow` | Agrega una fila al final si respeta las columnas existentes. |
| `pushData` | Agrega varias filas al final si respetan las columnas existentes. |
<!-- /@api:expose -->
