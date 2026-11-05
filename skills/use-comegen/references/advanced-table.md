# AdvancedTable — `<cu-table>` / `<AdvancedTable>`

Tabla de datos con búsqueda, filtros, ordenamiento, paginación, edición inline y badges/botones por
celda. Para una grilla estática alcanza un `<table>` de HTML.

## Receta

- `columns` y `data` van **por propiedad JS** (`tabla.columns = [...]`, `tabla.data = [...]`); la única excepción es `search-fields`, que acepta un JSON string.
- Búsqueda y paginación se habilitan **por atributo**: `search-enabled` y `pagination` (en el CE vienen apagadas), más `show-page-size` / `items-per-page`.
- Cada columna es `{ key, label, ... }`. Edición: `editable: true` (se abre con click) o `inlineEdit: true` (editor siempre visible); el editor se elige con `inputType` (`input`, `textarea`, `select`, `autocomplete`, `date`, `switch`).
- Escuchá `edit-save` para persistir y `edit-error` para validar; los clicks de fila se leen del `click` nativo.
- `actions` acepta un array **o** `(row) => [...]`; cada botón/acción acepta `disabled` (booleano o `(row) => boolean`) y `hidden(row)` para decidir **por fila**.
- Exportación: `exportable: false` saca la columna de la exportación. `getExportData({ scope })` devuelve `{ columns, rows }` con valores crudos (`'all'` default, `'visible'` = página/filtro actual) y `exportToExcel({ scope })` emite `export-click` (siempre) y `export-heavy` (≥10 000 celdas) con `{ scope, rowCount, columnCount, cellCount, heavy }`. El botón usa `'all'` y **no descarga ningún archivo**.
- Programático: `updateRow(index, patch)`, `getData()`, `getRow(index)`, `removeRow(index)`, `addRow(row)`, `pushData(rows)`.

```html
<cu-table id="<id>" color="<color>" variant="<variant>" search-enabled pagination show-page-size items-per-page="<number>"></cu-table>
```

```vue
<AdvancedTable :columns="<columns>" :data="<items>" color="<color>" variant="<variant>" search-enabled pagination :items-per-page="<number>" @edit-save="<handler>" />
```

Los valores de `color` / `variant` están en «Atributos» / «Props», abajo.

Acciones condicionales (array estático **o** función por fila; en Vue va igual en `:actions`):

```js
tabla.actions = (row) => [
  { label: 'Editar', onClick: (r) => editar(r) },
  { label: 'Publicar', hidden: (r) => r.estado !== 'borrador' },
  { divider: true },
  { label: 'Eliminar', disabled: (r) => r.bloqueado },
];
```

Exportación (no genera archivo: emite eventos con el resumen; el consumidor decide qué hacer):

```js
tabla.columns = [{ key: 'nombre' }, { key: 'interno', exportable: false }];
tabla.addEventListener('export-click', (e) => console.log(e.detail));
tabla.addEventListener('export-heavy', (e) => avisar(e.detail.cellCount));
const { rows } = tabla.getExportData({ scope: 'visible' });
const payload = tabla.exportToExcel(); // { scope, rowCount, columnCount, cellCount, heavy }
```

En Vue: `<AdvancedTable export-enabled :columns="columns" :data="data" @export-click="onExport" @export-heavy="onHeavy" />`.

## Límites

- Las props complejas van sólo por JS (`columns`, `data`, `filters`, `actions`, `footer`, `pageSizeOptions`, `rowDisabled`, `exportButton`); la única excepción es `search-fields` (JSON string: `search-fields='["nombre","email"]'`).
- `row-click`, `row-dblclick` y `cell-click` están declarados y el CE los bridgea, pero nadie los dispara: usá el `click` nativo con `e.composedPath()` o resolvé con `buttons`/`badges`/`actions`.
- No hay "lápiz": la celda editable se abre con click (doble click si `singleClick: false`); el estado inline sólo deja el editor siempre visible.
- `inputType: 'switch'` es la excepción: siempre visible, sin pasar por `validator`/`regex`, y al alternarlo emite `edit-save` con `value` booleano.
- `width`, `align` y `sortable` (y `inlineEdit`, `date`, `switch`) no están en la interface `Column` del `.ce.vue`, pero funcionan porque `columns` se reenvía tal cual.
- Defaults distintos entre CE y Vue: `pagination` es `false` en el CE y `true` en el `.vue`; `empty` es `""` vs `"No hay datos que mostrar"` (en HTML plano poné `pagination` a mano).
- No acepta `theme`: el tema se define en `<html data-theme="...">`; el CE **sí** expone `inline-editing` global, y una columna con `inlineEdit: true` gana sobre ese global.
- El slot `footer` gana sobre la prop `footer`.
- Búsqueda sobre columnas `inputType: 'select'`: matchea por la `label` de la opción, no por el `value` guardado.
- Deshabilitado con prioridad fila > columna > celda; con `rowDisabled` la fila se atenúa, no edita y sus botones/acciones se deshabilitan.
- `hidden` descarta el botón/ítem de esa fila (y los `divider` que queden huérfanos); si una fila se queda sin acciones visibles, no se renderiza su toggle "...".
- Slots por columna `header-{key}` y `cell-{key}` (más `template`, `search`, `empty` y `footer`): en `<cu-table>` se pasan como slots nativos (`<span slot="header-rol">…`) y **no reciben el scope** (no hay scoped slots en custom elements); en `<AdvancedTable>` sí.
- No hay eventos custom `input`/`change` de la tabla; los nativos burbujean solos.

## API del custom element

### Atributos

<!-- @api:atributos -->
| Atributo | Tipo | Default | Descripción |
| ------ | ------ | ------ | ------ |
| `columns` | `Column[]` | `[]` | Definición de columnas (ver «Interfaz de columna»). Se asigna como propiedad JS |
| `data` | `Record<string, any>[]` | `[]` | Filas de la tabla. Se asigna como propiedad JS |
| `empty` | `string` | `"No hay datos que mostrar"` | Texto a mostrar cuando no hay datos |
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
| `export-enabled` | `boolean` | `false` | Muestra el botón de exportación a Excel. No descarga un archivo: emite `export-click` con el resumen de los datos (atributo HTML: `export-enabled`) |
| `export-button` | `ExportButtonConfig \| null` | `{}` | Configuración visual del botón de exportación. Defaults: `label` «Descargar Excel», `color` `success`, `variant` `solid`, `disabled` `false`. Con `label: ""` queda sólo el ícono. `disabled` sólo apaga el botón: `exportToExcel()` sigue disponible. Se asigna como propiedad JS |
| `filters` | `Record<string, any>` | `{}` | Filtros por columna. Se asigna como propiedad JS |
| `loading` | `boolean` | `false` | Muestra una barra de carga animada en el tope |
| `actions` | `ButtonConfig[] \| ((row: Record<string, any>) => ButtonConfig[])` | `[]` | Acciones de fila (botón "..." al final de cada fila). Array estático o función `(row) => acciones` para decidirlas por fila. Se asigna como propiedad JS |
| `actions-label` | `string` | `""` | Texto del header de la columna de acciones. Default vacío. Atributo HTML: `actions-label` |
| `row-disabled` | `boolean \| ((row: Record<string, any>) => boolean)` | `false` | Deshabilita filas (ver «Deshabilitar filas, columnas y celdas»). Se asigna como propiedad JS |
| `footer` | `FooterRow[]` | `[]` | Filas de footer (ver «Footer (API programática)»). Se asigna como propiedad JS |
| `table-max-height` | `string` | `""` | Alto máximo del área scrolleable (CSS, ej. `40rem`). Atributo HTML: `table-max-height` |
| `inline-editing` | `boolean` | `false` | Editor visible siempre en las celdas editables, sin el lápiz (atributo HTML: `inline-editing`) |
| `compact` | `boolean` | `false` | Filas más compactas |
<!-- /@api:atributos -->

### Eventos

<!-- @api:eventos -->
| Evento | Payload (`e.detail`) | Descripción |
| ------ | ------ | ------ |
| `export-click` | `ExportPayload` | Se emite al llamar `exportToExcel`, con el resumen (`scope`, filas, columnas, celdas y `heavy`). |
| `export-heavy` | `ExportPayload` | Se emite además de `export-click` cuando la exportación llega a `EXPORT_HEAVY_CELLS` celdas o más. |
| `update:currentPage` | `number` | — |
| `update:itemsPerPage` | `number` | — |
| `update:search` | `string` | — |
| `edit-start` | `any` | — |
| `edit-save` | `any` | — |
| `edit-cancel` | `any` | — |
| `edit-error` | `any` | — |
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
| `getExportData` | Columnas exportables y **valores crudos** de las filas (sin `cell`, badges ni botones). `scope: "all"` (default) usa todas las filas de `data`; `"visible"` usa lo renderizado ahora (página y filtros/búsqueda actuales). |
| `exportToExcel` | Punto de entrada de la exportación (lo usa el botón y lo pueden llamar los consumidores). Calcula `getExportData`, emite `export-click` siempre y `export-heavy` si `cellCount >= EXPORT_HEAVY_CELLS`, y devuelve el payload. **No genera ni descarga ningún archivo.** |
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
| `exportEnabled` | `boolean` | `false` | Muestra el botón de exportación a Excel. No descarga un archivo: emite `export-click` con el resumen de los datos |
| `exportButton` | `ExportButtonConfig \| null` | `{}` | Configuración visual del botón de exportación. Defaults: `label` «Descargar Excel», `color` `success`, `variant` `solid`, `disabled` `false`. Con `label: ""` queda sólo el ícono (nombre accesible «Descargar Excel»). `disabled` sólo apaga el botón: `exportToExcel()` sigue disponible por método |
| `filters` | `Record<string, any>` | `{}` | — |
| `loading` | `boolean` | `false` | — |
| `actions` | `ButtonConfig[] \| ((row: Record<string, any>) => ButtonConfig[])` | `[]` | — |
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
| `export-click` | `ExportPayload` | Se emite al llamar `exportToExcel`, con el resumen (`scope`, filas, columnas, celdas y `heavy`). |
| `export-heavy` | `ExportPayload` | Se emite además de `export-click` cuando la exportación llega a `EXPORT_HEAVY_CELLS` celdas o más. |
| `update:currentPage` | `number` | — |
| `update:itemsPerPage` | `number` | — |
| `update:search` | `string` | — |
| `edit-start` | `any` | — |
| `edit-save` | `any` | — |
| `edit-cancel` | `any` | — |
| `edit-error` | `any` | — |
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
| `getExportData` | Columnas exportables y **valores crudos** de las filas (sin `cell`, badges ni botones). `scope: "all"` (default) usa todas las filas de `data`; `"visible"` usa lo renderizado ahora (página y filtros/búsqueda actuales). |
| `exportToExcel` | Punto de entrada de la exportación (lo usa el botón y lo pueden llamar los consumidores). Calcula `getExportData`, emite `export-click` siempre y `export-heavy` si `cellCount >= EXPORT_HEAVY_CELLS`, y devuelve el payload. **No genera ni descarga ningún archivo.** |
<!-- /@api:expose -->
