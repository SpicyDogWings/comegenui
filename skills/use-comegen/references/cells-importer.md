# CellsImporter — `<cu-cells-importer>` / `<CellsImporter>`

Importador de planillas (`.xlsx`, `.xls`, `.csv`) que parsea contra un esquema de columnas, valida
cada celda y muestra los errores. Compone `<cu-file-input>` / `<cu-file-input-zone>`.

## Receta

- Definí `columns` (**obligatorio**): `{ key, label, type?, required?, min/max?, minLength/maxLength?, pattern?, enum?, unique?, validate? }`, como **propiedad JS**.
- Eventos: `parse` (rows + headers + fileName), `error` (errores de validación) y `change` (archivo o `null`).
- Carga programática: `set(new File([…], 'demo.csv'))`; lectura con `getRows()` / `getHeaders()` / `getErrors()` / `getFile()`; `validate()` re-valida; `reset()` limpia todo.
- Plantilla: `template = { enabled: true, type: 'xlsx' | 'csv', filename }` (requiere `columns`) o `downloadTemplate()`.
- `strict`: `false` (default) matchea por `label` en cualquier orden; `true` respeta el orden del schema.
- `input-type="zone"` cambia el picker por la zona drag & drop (ahí `variant` no aplica).

```html
<cu-cells-importer color="<color>" variant="<variant>" input-type="<input|zone>"></cu-cells-importer>
```

```vue
<CellsImporter :columns="<columns>" :template="<template>" color="<color>" @parse="<handler>" />
```

Los valores de `color` / `variant` / `input-type` están en «Atributos» / «Props», abajo.

## Límites

- No tiene slots: el layout no se puede personalizar.
- `columns` es obligatorio de hecho: sin esquema no valida, no matchea ni arma la plantilla.
- Arrays y objetos (`columns`, `formats`, `template`, `sheet`) van por propiedad JS, no por atributo.
- Una sola hoja por importación (`sheet`); no recorre todas las hojas del libro.
- No exporta datos: la plantilla descargada trae únicamente los headers.
- `variant` se ignora con `input-type="zone"`.
- No multi-archivo: el input y la zona son single file.
- No re-valida solo al cambiar `columns`: hay que llamar `validate()`.
- No expone un estado "listo para importar": el resumen visual y `getErrors()` son toda la señal.
- El parser de `.xlsx` pesa: SheetJS viaja dentro de `CuCellsImporter.umd.js`.

## API del custom element

### Atributos

<!-- @api:atributos -->
| Atributo | Tipo | Default | Descripción |
| ------ | ------ | ------ | ------ |
| `columns` | `CellColumn[]` | `[]` | Esquema de columnas (header esperado, tipo y reglas). **Obligatorio.** |
| `color` | `"primary" \| "secondary" \| "neutral" \| "success" \| "warning" \| "danger"` | `"neutral"` | `primary`, `secondary`, `neutral`, `success`, `warning`, `danger` |
| `variant` | `"outlined" \| "soft" \| "ghost" \| "subtle"` | `"outlined"` | `outlined`, `soft`, `ghost`, `subtle` |
| `input-type` | `"input" \| "zone"` | `"input"` | `"input"` = `<cu-file-input>` compacto; `"zone"` = zona drag & drop (`<cu-file-input-zone>`). Single file en ambos |
| `disabled` | `boolean` | `—` | Deshabilita la selección |
| `read-only` | `boolean` | `—` | Modo solo lectura |
| `placeholder` | `string` | `"Seleccionar archivo"` | Texto cuando no hay archivo |
| `formats` | `string[]` | `[".xlsx", ".csv"]` | Formatos deseados; se propagan al input y se muestran al usuario |
| `delimiter` | `string` | `","` | Delimitador para CSV |
| `has-header` | `boolean` | `true` | La primera fila del archivo es el encabezado |
| `strict` | `boolean` | `false` | `false` = match por label en cualquier orden; `true` = respeta el orden del schema |
| `sheet` | `string \| number` | `0` | Hoja a leer en `.xlsx` (índice o nombre) |
| `template` | `{ enabled?: boolean \| undefined; type?: "xlsx" \| "csv" \| undefined; filename?: string \| undefined; }` | `{ enabled: false, type: "csv", filename: "template" }` | "xlsx"` |
| `max-size` | `number` | `—` | Tamaño máximo en bytes |
<!-- /@api:atributos -->

### Eventos

<!-- @api:eventos -->
| Evento | Payload (`e.detail`) | Descripción |
| ------ | ------ | ------ |
| `parse` | `{ rows: Record<string, unknown>[]; headers: string[]; fileName: string; }` | — |
| `error` | `CellError[]` | — |
| `change` | `File \| null` | — |
<!-- /@api:eventos -->

### Slots

<!-- @api:slots -->
Ninguno.
<!-- /@api:slots -->

### Métodos expuestos

<!-- @api:metodos -->
| Método | Descripción |
| ------ | ------ |
| `getRows` | Filas parseadas |
| `getHeaders` | Encabezados del archivo |
| `getErrors` | Errores de validación |
| `getFile` | `File` actual o `null` |
| `validate` | Re-valida y devuelve errores |
| `downloadTemplate` | Descarga la plantilla configurada |
| `reset` | Limpia archivo, filas y errores |
| `set` | Asigna un archivo programáticamente |
| `trigger` | Abre el diálogo de selección |
| `focus` | Enfoca el input |
<!-- /@api:metodos -->

## API del componente Vue

### Props

<!-- @api:props -->
| Prop | Tipo | Default | Descripción |
| ------ | ------ | ------ | ------ |
| `columns` | `CellColumn[]` | `[]` | — |
| `color` | `"primary" \| "secondary" \| "neutral" \| "success" \| "warning" \| "danger"` | `"neutral"` | — |
| `variant` | `"outlined" \| "soft" \| "ghost" \| "subtle"` | `"outlined"` | — |
| `inputType` | `"input" \| "zone"` | `"input"` | — |
| `disabled` | `boolean` | `false` | — |
| `readOnly` | `boolean` | `false` | — |
| `placeholder` | `string` | `"Seleccionar archivo"` | — |
| `formats` | `string[]` | `[".xlsx", ".csv"]` | — |
| `delimiter` | `string` | `","` | — |
| `hasHeader` | `boolean` | `true` | — |
| `strict` | `boolean` | `false` | — |
| `sheet` | `string \| number` | `0` | — |
| `template` | `{ enabled?: boolean \| undefined; type?: "xlsx" \| "csv" \| undefined; filename?: string \| undefined; }` | `{ enabled: false, type: "csv", filename: "template" }` | — |
| `maxSize` | `number` | `—` | — |
<!-- /@api:props -->

### Emits

<!-- @api:emits -->
| Evento | Payload | Descripción |
| ------ | ------ | ------ |
| `change` | `File \| null` | — |
| `parse` | `{ rows: Record<string, unknown>[]; headers: string[]; fileName: string; }` | — |
| `error` | `CellError[]` | — |
<!-- /@api:emits -->

### Slots

<!-- @api:slots-vue -->
Ninguno.
<!-- /@api:slots-vue -->

### Expose

<!-- @api:expose -->
| Método | Descripción |
| ------ | ------ |
| `getRows` | Devuelve las filas parseadas. |
| `getHeaders` | Devuelve los encabezados parseados. |
| `getErrors` | Devuelve los errores de validación. |
| `getFile` | Devuelve el archivo cargado. |
| `validate` | Revalida las filas y emite los errores. |
| `downloadTemplate` | Descarga la plantilla configurada (csv/xlsx). |
| `reset` | Limpia el archivo y los resultados. |
| `set` | Setea el archivo y lo propaga al input. |
| `trigger` | Abre el selector de archivos. |
| `focus` | Enfoca el input de archivo. |
<!-- /@api:expose -->
