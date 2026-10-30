[← Volver](../README.md)

# `CellsImporter`

Importador de archivos tabulares (`.xlsx`, `.xls`, `.csv`) que parsea el contenido contra un esquema de columnas, valida cada celda y muestra los errores. Compone `<FileInput>` internamente.

Soporta matching de columnas **por label sin importar el orden** (`strict=false`, default) o **respetando el orden** (`strict`), y descarga de plantilla opcional.

## Uso en Vue

```vue
<script setup lang="ts">
import CellsImporter from "@/components/form/CellsImporter.vue";
import { useTemplateRef } from "vue";

const columns = [
  { key: "name", label: "Nombre", required: true },
  { key: "dni", label: "DNI", type: "integer", min: 1000000, unique: true },
  { key: "email", label: "Email", type: "email" },
];

const imp = useTemplateRef("imp");

function onParse(payload: { rows: unknown[]; fileName: string }) {
  console.log("Filas:", payload.rows);
}

function onError(errors: unknown[]) {
  console.log("Errores:", errors);
}
</script>

<template>
  <CellsImporter ref="imp" :columns="columns" @parse="onParse" @error="onError" />
</template>
```

En HTML plano, cargá el bundle `CuCellsImporter` (ver [ficha vanilla](/componentes/cu-cells-importer)).

> Todos los ejemplos de abajo asumen `columns` ya definido (ver arriba).

## Plantilla

`template` activa el botón **Descargar plantilla** y define el formato del archivo generado. La plantilla se construye **siempre desde `columns`** (usa el `label` de cada columna como encabezado). El botón solo aparece si `enabled: true` **y** `columns.length > 0`; también se puede disparar con `.downloadTemplate()`.

El CSV se genera con el `delimiter` configurado (se puede reimportar con la misma config) y con BOM UTF-8 para que Excel respete los acentos.

```vue
<script setup lang="ts">
import CellsImporter from "@/components/form/CellsImporter.vue";
import { ref } from "vue";

const columns = [
  { key: "nombre", label: "Nombre", required: true },
  { key: "dni", label: "DNI", type: "integer" },
  { key: "email", label: "Email", type: "email" },
];

const templateCsv = ref({ enabled: true, type: "csv", filename: "plantilla-alumnos" });
const templateXlsx = ref({ enabled: true, type: "xlsx", filename: "plantilla-alumnos" });
</script>

<template>
  <CellsImporter color="primary" :columns="columns" :template="templateCsv" />
  <CellsImporter color="primary" :columns="columns" :template="templateXlsx" />
</template>
```

## Colores

`color` es un nombre semántico (`primary`, `secondary`, `neutral`, `success`, `warning`, `danger`) que tiñe el input y los botones internos.

```vue
<template>
  <CellsImporter color="primary" placeholder="primary" :columns="columns" />
  <CellsImporter color="secondary" placeholder="secondary" :columns="columns" />
  <CellsImporter color="neutral" placeholder="neutral" :columns="columns" />
  <CellsImporter color="success" placeholder="success" :columns="columns" />
  <CellsImporter color="warning" placeholder="warning" :columns="columns" />
  <CellsImporter color="danger" placeholder="danger" :columns="columns" />
</template>
```

## Variantes

`variant` decide el aspecto del input: `outlined` (**default**; borde), `soft` (fondo tenue), `ghost` (transparente) y `subtle` (tenue con borde). No aplica con `input-type="zone"` (la zona no tiene variantes).

```vue
<template>
  <CellsImporter color="primary" variant="outlined" placeholder="outlined" :columns="columns" />
  <CellsImporter color="primary" variant="soft" placeholder="soft" :columns="columns" />
  <CellsImporter color="primary" variant="ghost" placeholder="ghost" :columns="columns" />
  <CellsImporter color="primary" variant="subtle" placeholder="subtle" :columns="columns" />
</template>
```

## Selector

`input-type` elige el selector: `input` (**default**; `<FileInput>` compacto) o `zone` (zona drag & drop, single file). `formats` y `max-size` se propagan al selector en ambos casos.

```vue
<script setup lang="ts">
import CellsImporter from "@/components/form/CellsImporter.vue";
import { ref } from "vue";

const columns = [
  { key: "producto", label: "Producto", type: "string", required: true },
  { key: "precio", label: "Precio", type: "number", min: 0 },
];

const salida = ref("");
</script>

<template>
  <CellsImporter
    input-type="zone"
    color="primary"
    placeholder="Arrastrá tu CSV de productos"
    :formats="['.csv']"
    :max-size="1048576"
    :columns="columns"
    @parse="(p) => (salida = `parse → ${p.rows.length} fila(s)`)"
  />
</template>
```

## Estados

`disabled` bloquea la selección; `readOnly` deja ver el resultado sin poder cambiar el archivo.

```vue
<template>
  <CellsImporter color="primary" placeholder="habilitado" :columns="columns" />
  <CellsImporter color="danger" variant="soft" disabled placeholder="disabled" :columns="columns" />
  <CellsImporter read-only placeholder="readOnly" :columns="columns" />
</template>
```

## Opciones de parseo

`delimiter` (CSV, default `,`), `hasHeader` (default `true`), `strict` (respeta el orden del schema), `sheet` (hoja de `.xlsx`, índice o nombre), `formats` (default `[".xlsx", ".csv"]`) y `maxSize` (bytes) ajustan cómo se lee el archivo.

```vue
<script setup lang="ts">
import CellsImporter from "@/components/form/CellsImporter.vue";
import { ref, useTemplateRef } from "vue";

const imp = useTemplateRef("imp");

const columns = [
  { key: "nombre", label: "Nombre", type: "string", required: true },
  { key: "edad", label: "Edad", type: "integer" },
];

const salida = ref("");

function setear() {
  // Separador `;` y sin fila de encabezado: las columnas se mapean por posición.
  imp.value?.set(new File(["Ana;30\nBeto;25\n"], "sin-header.csv", { type: "text/csv" }));
}
</script>

<template>
  <CellsImporter
    ref="imp"
    color="primary"
    delimiter=";"
    :has-header="false"
    :strict="true"
    :sheet="0"
    :formats="['.csv']"
    :max-size="1048576"
    placeholder="CSV sin header separado por ;"
    :columns="columns"
    @parse="(p) => (salida = `parse → ${p.rows.length} filas`)"
  />
</template>
```

> Con `strict=false` (default) el orden del archivo no importa: las columnas se matchean por `label` y las sobrantes se ignoran. Con `strict` se exige que el orden coincida con el del schema. Sin `hasHeader`, las columnas se mapean por posición. Las celdas con formato de fecha de un `.xlsx` se leen como fechas (no como número de serie) y el BOM del CSV se descarta.

> `.xlsx` requiere SheetJS, que viaja solo en `CuCellsImporter`; el resto de la lib no se ve afectado. Formato inválido o tamaño excedido los rechaza el selector interno.

## Validación

Cada `CellColumn` puede declarar reglas por celda. Si alguna falla, la fila queda marcada, los errores se listan en un `Collapse` (`danger`) con tabla paginada y buscador, y las advertencias van en su propio `Collapse` (`warning`).

```vue
<script setup lang="ts">
import CellsImporter from "@/components/form/CellsImporter.vue";
import { onMounted, useTemplateRef } from "vue";

const imp = useTemplateRef("imp");

const columns = [
  { key: "name", label: "Nombre", required: true },
  { key: "dni", label: "DNI", type: "integer", min: 1000000, unique: true },
  { key: "email", label: "Email", type: "email" },
  { key: "code", label: "Código", pattern: /^[A-Z]{2}-\d{3}$/ },
  { key: "state", label: "Estado", enum: ["Activo", "Inactivo"] },
];

onMounted(() => {
  imp.value?.set(
    new File(["Nombre,DNI,Email,Código,Estado\nAna,999,correo,ZZ-9,Desconocido\n"], "con-errores.csv", { type: "text/csv" }),
  );
});
</script>

<template>
  <CellsImporter ref="imp" color="primary" :columns="columns" />
</template>
```

- **Reglas:** `required`, tipos (`integer`/`number`/`date`/`boolean`/`email`), rangos `min`/`max`, largo `minLength`/`maxLength`, `pattern`, `enum`, `unique` y `validate` custom.
- **`validate`:** devolvé un `string` (mensaje de error), `false` (error genérico) o `true`/`undefined` (ok). Recibís el valor ya convertido por `type` y la fila completa.
- El resumen de filas OK / con errores queda siempre visible; el `Collapse` de errores arranca abierto.

## Props

<!--@include: ../../partials/cells-importer/props-vue.md-->

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

## Emits

<!--@include: ../../partials/cells-importer/eventos-vue.md-->

`CellError`: `{ row, columnKey, columnLabel, message }`.

## Slots

<!--@include: ../../partials/cells-importer/slots.md-->

## Expose

<!--@include: ../../partials/cells-importer/metodos-vue.md-->
