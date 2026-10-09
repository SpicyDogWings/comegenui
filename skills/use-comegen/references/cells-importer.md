# CellsImporter — `<cu-cells-importer>` / `<CellsImporter>`

Importador de archivos tabulares (`.xlsx`, `.xls`, `.csv`) que parsea el contenido contra un
esquema de columnas, valida cada celda y muestra los errores. Compone `<cu-file-input>`.

## Cuándo usarlo

Para cargar planillas y obtener filas tipadas y validadas sin escribir el parser. Si sólo
necesitás subir un archivo cualquiera, usá `cu-file-input`; si querés controlar el parseo a
mano, no uses este componente.

## Receta

1. Definí `columns` (**obligatorio**): cada columna con `key` (identificador), `label` (header
   esperado) y reglas (`type`, `required`, `min`/`max`, `minLength`/`maxLength`, `pattern`,
   `enum`, `unique`, `validate`).
2. En HTML plano asigná `columns` como **propiedad JS** después de cargar el UMD
   (`imp.columns = [...]`); nunca como atributo.
3. Escuchá `parse` (filas + headers + nombre), `error` (errores de validación) y `change`
   (archivo o `null`).
4. Importación programática: `imp.set(new File([...], 'demo.csv'))`; después `imp.getRows()`,
   `imp.getHeaders()`, `imp.getErrors()`, `imp.getFile()`.
5. Plantilla: `imp.template = { enabled: true, type: 'xlsx', filename: 'plantilla' }` (necesita
   `columns.length > 0`) o `imp.downloadTemplate()`.
6. `strict` decide el matching: `false` (default) por `label` en cualquier orden; `true` respeta
   el orden del schema.
7. `inputType="zone"` cambia el picker por la zona drag & drop; en ese modo `variant` no aplica.

```html
<!-- HTML plano (UMD) -->
<script src="dist-libs/umd-core/CuCellsImporter.umd.js"></script>

<cu-cells-importer id="imp" color="primary"></cu-cells-importer>

<script>
  customElements.whenDefined('cu-cells-importer').then(() => {
    const imp = document.getElementById('imp');
    imp.columns = [
      { key: 'name',  label: 'Nombre', required: true },
      { key: 'email', label: 'Email',  type: 'email' },
    ];
    imp.template = { enabled: true, type: 'xlsx', filename: 'plantilla' };

    imp.addEventListener('parse', (e) => console.log('Filas:', e.detail.rows));
    imp.addEventListener('error', (e) => console.log('Errores:', e.detail));

    const csv = 'Nombre,Email\nJuan,juan@x.com';
    imp.set(new File([csv], 'demo.csv', { type: 'text/csv' }));
  });
</script>
```

```vue
<!-- Vue -->
<script setup lang="ts">
import CellsImporter from "@/components/form/CellsImporter.vue";
import { ref } from "vue";

const columns = ref([
  { key: "name", label: "Nombre", required: true },
  { key: "email", label: "Email", type: "email" },
]);
const template = ref({ enabled: true, type: "xlsx", filename: "plantilla" });
</script>

<template>
  <CellsImporter
    :columns="columns"
    :template="template"
    @parse="(p) => console.log('Filas:', p.rows)"
    @error="(errs) => console.log('Errores:', errs)"
  />
</template>
```

## Qué puede y qué no puede

**Puede:** validación con `required`, tipos (`string`, `integer`, `number`, `date`, `boolean`,
`email`), rangos `min`/`max`, largo `minLength`/`maxLength`, `pattern`, `enum`, `unique` y
`validate` custom; CSV y XLSX; hoja configurable (`sheet`); header opcional (`hasHeader`);
`delimiter`; `maxSize`; `formats`; `inputType` (`input`/`zone`); `color`; `variant`; plantilla
CSV/XLSX y 10 métodos expuestos.

**No puede:**

- **No tiene slots:** el layout no se puede personalizar.
- **`columns` es obligatorio de hecho:** sin esquema no valida, no matchea ni arma la plantilla;
  sólo queda el input.
- **Arrays y objetos (`columns`, `formats`, `template`, `sheet`) no van por atributo:** en HTML
  plano se asignan como propiedad JS (ver `gotchas.md`).
- **Una sola hoja por importación** (`sheet`); no recorre todas las hojas del libro.
- **No exporta datos:** sólo lee y valida. La plantilla que descarga trae únicamente los headers.
- **`variant` se ignora con `inputType="zone"`** (la zona no tiene variantes).
- **No multi-archivo:** el input y la zona son single file.
- **No re-valida solo al cambiar `columns`:** hay que llamar `.validate()`.
- **No expone un estado "listo para importar":** el resumen visual (filas OK / con errores) y
  `getErrors()` son toda la señal; la decisión de importar es tuya.
- **El parser de `.xlsx` pesa:** SheetJS viaja dentro de `CuCellsImporter.umd.js`.

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
| `getRows` | — |
| `getHeaders` | — |
| `getErrors` | — |
| `getFile` | — |
| `validate` | — |
| `downloadTemplate` | Descarga la plantilla configurada (csv/xlsx). |
| `reset` | — |
| `set` | — |
| `trigger` | — |
| `focus` | — |
<!-- /@api:expose -->
