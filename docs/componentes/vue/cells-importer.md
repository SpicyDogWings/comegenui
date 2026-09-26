# `CellsImporter`

Importador de archivos tabulares (`.xlsx`, `.xls`, `.csv`) que parsea el contenido contra un esquema de columnas, valida cada celda y muestra los errores. Compone `<cu-file-input>` internamente.

[← Volver](../README.md)

---

## Plantilla

La prop `template` activa el botón **Descargar plantilla** y define el formato del archivo generado. La plantilla se construye **siempre desde `columns`** (usa `label` de cada columna como encabezado).

| Campo | Tipo | Default | Descripción |
|-------|------|---------|-------------|
| `enabled` | `boolean` | `false` | Muestra el botón de descarga |
| `type` | `'csv' \| 'xlsx'` | `'csv'` | Formato del archivo |
| `filename` | `string` | `'template'` | Nombre del archivo (sin extensión) |

- **`csv`** → `filename.csv` con una fila de headers (escapa comas y comillas).
- **`xlsx`** → `filename.xlsx` con la hoja `Template` y la misma fila de headers.

```vue
<script setup lang="ts">
import CellsImporter from "@/components/form/CellsImporter.vue";
import { ref } from "vue";

const columns = ref([
  { key: "name", label: "Nombre", required: true },
  { key: "email", label: "Email", type: "email" },
]);
const template = ref({ enabled: true, type: "xlsx", filename: "plantilla-alumnos" });
</script>

<template>
  <CellsImporter :columns="columns" :template="template" />
</template>
```

El botón solo aparece si `enabled: true` **y** `columns.length > 0`. También se puede disparar manualmente con `.downloadTemplate()`.

## Uso en Vue

```vue
<script setup lang="ts">
import CellsImporter from "@/components/form/CellsImporter.vue";
import { onMounted, ref, useTemplateRef } from "vue";

const columns = ref([
  { key: "name", label: "Nombre", required: true },
  { key: "dni", label: "DNI", type: "integer", min: 1000000, unique: true },
  { key: "email", label: "Email", type: "email" },
  { key: "code", label: "Código", pattern: /^[A-Z]{2}-\d{3}$/ },
  { key: "state", label: "Estado", enum: ["Activo", "Inactivo"] },
  {
    key: "note",
    label: "Nota",
    maxLength: 200,
    validate: (value, row) => (value && Number(row.dni) < 0 ? "El DNI debe ser positivo" : true),
  },
]);
const template = ref({ enabled: true, type: "xlsx", filename: "plantilla" });

const imp = useTemplateRef("imp");

function onParse(payload: { rows: unknown[]; headers: string[]; fileName: string }) {
  console.log("Filas:", payload.rows);
}

function onError(errors: unknown[]) {
  console.log("Errores:", errors);
}

onMounted(() => {
  // Importación programática
  const csv = "Nombre,DNI,Email,Código,Estado,Nota\nJuan,30500000,juan@x.com,AB-123,Activo,ok\nAna,99999999,correo,ZZ-9,Desconocido,";
  imp.value?.set(new File([csv], "demo.csv", { type: "text/csv" }));
  console.log(imp.value?.getRows());
});
</script>

<template>
  <CellsImporter
    ref="imp"
    :columns="columns"
    :template="template"
    @parse="onParse"
    @error="onError"
  />
</template>
```

## Notas

- **Orden de columnas:** con `strict=false` (default) el orden del archivo no importa — las columnas se matchean por `label`. Con `strict` se exige que el orden del archivo coincida con el del schema. Las columnas sobrantes del archivo se ignoran en ambos casos.
- **Validación:** `required`, tipos (`integer`/`number`/`date`/`boolean`/`email`), rangos `min`/`max`, largo `minLength`/`maxLength`, `pattern`, `enum` y `unique`. Reglas custom con `validate`.
- **Feedback:** los errores (`danger`) se muestran en un `Collapse` expandible con una **tabla con paginación y buscador** (Fila/Columna/Error) — soporta un número ilimitado de errores. Las advertencias (`warning`) van en su propio `Collapse`. El resumen de filas OK / con errores queda siempre visible.
- **Formato inválido / tamaño:** lo rechaza el `FileInput` interno (usa `accept` y `maxSize`).
- **`inputType="zone"`:** el picker es la zona drag & drop (single file). `variant` no aplica en este modo (la zona no tiene variantes).
- **Peso:** el parser de `.xlsx` (SheetJS) viaja solo en `CuCellsImporter.umd.js`; el resto de la lib no se ve afectado.

---

## Props

<!-- @api:props -->
| Prop | Tipo | Default | Descripción |
| ------ | ------ | ------ | ------ |
| `color` | `"primary" \| "secondary" \| "neutral" \| "success" \| "warning" \| "danger"` | `"neutral"` | — |
| `variant` | `"outlined" \| "soft" \| "ghost" \| "subtle"` | `"outlined"` | — |
| `disabled` | `boolean` | `false` | — |
| `columns` | `CellColumn[]` | `[]` | — |
| `inputType` | `"input" \| "zone"` | `"input"` | — |
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

### `CellColumn`

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `key` | `string` | Identificador de la columna |
| `label` | `string` | Header esperado en el archivo |
| `type` | `'string' \| 'integer' \| 'number' \| 'date' \| 'boolean' \| 'email'` | Coerción y validación de tipo |
| `required` | `boolean` | Rechaza celdas vacías |
| `min` / `max` | `number` | Rango para `number`/`integer` |
| `minLength` / `maxLength` | `number` | Largo para `string` |
| `pattern` | `string \| RegExp` | Regex de formato |
| `enum` | `(string \| number)[]` | Valores permitidos |
| `unique` | `boolean` | Rechaza duplicados en la columna |
| `validate` | `function` | Regla custom: `(value, row) => string \| boolean \| undefined` |

> **`validate`:** devolvé un `string` (mensaje de error), `false` (error genérico) o `true`/`undefined` (ok). Recibís el valor ya convertido por `type` y la fila completa por si la regla depende de otras columnas.

## Emits

<!-- @api:emits -->
| Evento | Payload | Descripción |
| ------ | ------ | ------ |
| `change` | `File \\| null` | — |
| `parse` | `{ rows: Record<string, unknown>[]; headers: string[]; fileName: string; }` | — |
| `error` | `CellError[]` | — |
<!-- /@api:emits -->

`CellError`: `{ row, columnKey, columnLabel, message }`.

## Slots

<!-- @api:slots -->
Ninguno.
<!-- /@api:slots -->

## Expose

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
