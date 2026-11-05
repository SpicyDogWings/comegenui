[← Volver](../README.md)

# `ExportButton`

Botón que exporta filas a **XLSX** (default) o **CSV** y dispara la descarga. El archivo lo genera
el mismo core que usan [`AdvancedTable`](./advanced-table.md) y
[`CellsImporter`](./cells-importer.md), así que encabezados, formatos y conteos coinciden.

A diferencia de `CopyButton`, este botón no copia: escribe un archivo real en el navegador. Si ya
tenés una tabla con `exportEnabled`, no hace falta instanciarlo: la tabla ya incluye uno.

## Uso en Vue

```vue
<script setup lang="ts">
import ExportButton from "@/components/buttons/ExportButton.vue";

const columns = [
  { key: "nombre", label: "Nombre" },
  { key: "edad", label: "Edad", format: "0" },
];
const data = [
  { nombre: "Ana", edad: 30 },
  { nombre: "Beto", edad: 41 },
];
</script>

<template>
  <ExportButton :data="data" :columns="columns" filename="personas" />
</template>
```

`columns` acepta `key`, `label`, `type` (`string`, `integer`, `number`, `date`, `boolean`),
`format` (formato numérico de Excel), `width` (ancho de columna) y `exportable: false` para dejar
una columna fuera. `data` son los valores crudos: no se aplican `cell`, badges ni botones.

## Formato y nombre

`format` elige el archivo y el label por defecto: `xlsx` → **Descargar Excel**, `csv` →
**Descargar CSV**. `filename` es el nombre **sin** extensión (se agrega sola); sin él se usa
`export-YYYY-MM-DD`. En XLSX, `sheetName` nombra la hoja (default `Datos`); en CSV, `delimiter`
elige el separador (default `,`).

```vue
<template>
  <ExportButton :data="data" :columns="columns" format="csv" delimiter=";" filename="personas" />
  <ExportButton :data="data" :columns="columns" sheet-name="Personas" filename="personas" />
</template>
```

## Apariencia

`color`, `variant` y `size` son los del [`Button`](./button.md). `label` cambia el texto; con
`label: ""` queda sólo el ícono y el nombre accesible sale del formato. `disabled` bloquea el
click: no descarga ni emite eventos.

```vue
<template>
  <ExportButton :data="data" :columns="columns" color="primary" variant="outlined" />
  <ExportButton :data="data" :columns="columns" label="" />
  <ExportButton :data="data" :columns="columns" disabled />
</template>
```

## Modo manual

Con `manual` el click **no descarga**: emite `trigger` con el resumen (`format`, `fileName`,
`rowCount`, `columnCount`, `cellCount`, `heavy`) para que el consumidor decida (pedir confirmación,
subir los datos a otro lado, etc.). Después podés llamar `download()` por ref.

## Eventos de descarga

- `before-download`: antes de crear el archivo, con el resumen + `cancel()`. Llamalo de forma
  sincrónica para evitar la descarga.
- `download`: archivo generado y descarga disparada, con el payload.
- `heavy`: además de `download`, cuando las celdas alcanzan `heavyThreshold` (10 000 por defecto).
- `error`: si no se pudo generar o descargar el archivo (el error va como argumento).

```vue
<script setup lang="ts">
function beforeDownload(payload: { heavy: boolean; cancel: () => void }) {
  if (payload.heavy && !confirm("Son muchas filas. ¿Seguir?")) payload.cancel();
}
</script>

<template>
  <ExportButton
    :data="data"
    :columns="columns"
    @before-download="beforeDownload"
    @heavy="(payload) => avisar(payload.cellCount)"
  />
</template>
```

## API programática

Con una `ref` al componente:

- `setData(rows, columns?)`: reemplaza los datos (y opcionalmente las columnas) sin tocar props.
- `setOptions(options)`: fusiona opciones del core (`format`, `filename`, `sheetName`, `delimiter`,
  `config`, `heavyThreshold`).
- `getPayload()`: resumen de lo que se descargaría, **sin** generar el archivo.
- `download()`: genera y descarga; devuelve el payload o `null` si se canceló.

```vue
<script setup lang="ts">
import { ref } from "vue";
import ExportButton from "@/components/buttons/ExportButton.vue";

const boton = ref<InstanceType<typeof ExportButton> | null>(null);

function exportarSoloVisibles(rows: typeof data) {
  boton.value?.setData(rows);
  boton.value?.setOptions({ filename: "visibles", format: "csv" });
  boton.value?.download();
}
</script>

<template>
  <ExportButton ref="boton" :data="data" :columns="columns" />
</template>
```

En HTML plano las mismas operaciones existen como propiedades y métodos del host: ver
[ficha del custom element](/componentes/cu-export-button).

## Props

<!-- @api:props -->
| Prop | Tipo | Default | Descripción |
| ------ | ------ | ------ | ------ |
| `columns` | `SheetColumn[]` | `[]` | Columnas a exportar; `exportable: false` las deja fuera. Se asigna como propiedad JS. |
| `data` | `Record<string, any>[]` | `[]` | Filas a exportar (valores crudos). |
| `color` | `"primary" \| "secondary" \| "neutral" \| "success" \| "warning" \| "danger"` | `"success"` | Color semántico del botón. Default: `success`. |
| `variant` | `"solid" \| "outlined" \| "soft" \| "ghost" \| "subtle" \| "link" \| "none"` | `"solid"` | Variante visual del botón. Default: `solid`. |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | Tamaño del botón: `sm`, `md`, `lg`. |
| `disabled` | `boolean` | `false` | Deshabilita el botón (no dispara ni descarga). |
| `format` | `SheetFormat` | `"xlsx"` | Formato de salida: `xlsx` (default) o `csv`. |
| `manual` | `boolean` | `false` | Si es `true`, el click sólo emite `trigger`; la descarga la decide el consumidor. |
| `label` | `string` | `—` | Texto visible. Default según formato: «Descargar Excel» / «Descargar CSV». Con `""` queda sólo el ícono. |
| `delimiter` | `string` | `—` | Separador de CSV. Default: `,`. |
| `filename` | `string` | `—` | Nombre del archivo sin extensión. Default: `export-YYYY-MM-DD`. |
| `sheetName` | `string` | `—` | Nombre de la hoja en XLSX. Default: `Datos`. |
| `config` | `WritingOptions` | `—` | Opciones de escritura de SheetJS. Se asigna como propiedad JS. |
| `heavyThreshold` | `number` | `—` | Celdas (filas × columnas) desde las que la exportación se considera `heavy`. Default: `10 000`. |
<!-- /@api:props -->

## Emits

<!-- @api:emits -->
| Evento | Payload | Descripción |
| ------ | ------ | ------ |
| `before-download` | `SheetBeforeDownloadPayload` | Antes de generar el archivo; llamá `cancel()` de forma sincrónica para evitarlo. |
| `trigger` | `SheetPayload` | Click en modo `manual`; incluye el resumen de lo que se descargaría. |
| `error` | `unknown` | No se pudo generar o descargar el archivo. |
| `download` | `SheetPayload` | Genera el archivo y dispara la descarga. Devuelve el payload o `null` si se canceló. |
| `heavy` | `SheetPayload` | La exportación superó `heavyThreshold` (10 000 celdas por defecto). |
<!-- /@api:emits -->

## Slots

<!-- @api:slots -->
Ninguno.
<!-- /@api:slots -->

## Expose

<!-- @api:expose -->
| Método | Descripción |
| ------ | ------ |
| `setData` | Reemplaza las filas y, opcionalmente, las columnas. |
| `setOptions` | Fusiona opciones de exportación (`filename`, `format`, `sheetName`, `delimiter`, `config`, `heavyThreshold`). |
| `download` | Genera el archivo y dispara la descarga. Devuelve el payload o `null` si se canceló. |
| `getPayload` | Resumen actual: filas, columnas, celdas, formato y nombre del archivo. |
<!-- /@api:expose -->
