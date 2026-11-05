# ExportButton — `<cu-export-button>` / `<ExportButton>`

Botón que exporta filas a XLSX o CSV y descarga el archivo. Para exportar una tabla ya armada usá
`cu-table` con `export-enabled`; este botón es para exportar datos sueltos.

## Receta

- `data` y `columns` son arrays: van **por propiedad JS** (`boton.data = [...]`), nunca por atributo.
- `format` (`xlsx` default o `csv`), `filename` sin extensión, `sheet-name` y `delimiter`.
- `columns` acepta `{ key, label, format, width, exportable: false }`; `exportable: false` queda fuera.
- `manual` hace que el click sólo emita `trigger` con el resumen; después llamá `boton.download()`.
- `before-download` es cancelable (`e.detail.cancel()`): no se genera el archivo.
- Métodos: `setData(rows, columns?)`, `setOptions(options)`, `getPayload()`, `download()`.

```html
<cu-export-button id="<id>" format="<format>" filename="<filename>"></cu-export-button>
```

```js
boton.columns = [{ key: 'nombre', label: 'Nombre' }];
boton.data = [{ nombre: 'Ana' }];
boton.addEventListener('download', (e) => console.log(e.detail.fileName));
```

```vue
<ExportButton :data="<items>" :columns="<columns>" format="<format>" filename="<filename>" />
```

Los valores de `color` / `variant` / `size` están en «Atributos» / «Props», abajo.

## Límites

- No lee el DOM ni la tabla: exportás exactamente `data` con las keys de `columns`.
- No aplica `cell`, badges ni botones: si querés eso, usá `getExportData()` de `cu-table`.
- No sube el archivo a ningún lado ni lo deja en memoria: lo descarga con un `<a download>`.
- Sin `columns` el archivo sale vacío (no infiere encabezados de `data`).
- `config` (opciones de SheetJS) sólo va por JS; no hay atributo.
- El label por defecto depende del formato (`Descargar Excel` / `Descargar CSV`); `label=""` deja
  sólo el ícono.
- En XLSX el `format` de columna aplica formato numérico; en CSV no tiene efecto.

## API del custom element

### Atributos

<!-- @api:atributos -->
| Atributo | Tipo | Default | Descripción |
| ------ | ------ | ------ | ------ |
| `columns` | `SheetColumn[]` | `[]` | Columnas a exportar; `exportable: false` las deja fuera. Se asigna como propiedad JS. |
| `data` | `Record<string, any>[]` | `[]` | Filas a exportar (valores crudos). Se asigna como propiedad JS. |
| `color` | `"primary" \| "secondary" \| "neutral" \| "success" \| "warning" \| "danger"` | `"success"` | Color semántico del botón. Default: `success`. |
| `variant` | `"solid" \| "outlined" \| "soft" \| "ghost" \| "subtle" \| "link" \| "none"` | `"solid"` | Variante visual del botón. Default: `solid`. |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | Tamaño del botón: `sm`, `md`, `lg`. |
| `disabled` | `boolean` | `false` | Deshabilita el botón (no dispara ni descarga). |
| `format` | `SheetFormat` | `"xlsx"` | Formato de salida: `xlsx` (default) o `csv`. |
| `manual` | `boolean` | `false` | Si es `true`, el click sólo emite `trigger`; la descarga la decide el consumidor. |
| `label` | `string` | `—` | Texto visible. Default según formato; con `""` queda sólo el ícono. |
| `delimiter` | `string` | `—` | Separador de CSV. Default: `,`. |
| `filename` | `string` | `—` | Nombre del archivo sin extensión. Default: `export-YYYY-MM-DD`. |
| `sheet-name` | `string` | `—` | Nombre de la hoja en XLSX. Default: `Datos`. |
| `config` | `WritingOptions` | `—` | Opciones de escritura de SheetJS. Se asigna como propiedad JS. |
| `heavy-threshold` | `number` | `—` | Celdas (filas × columnas) desde las que la exportación se considera `heavy`. Default: 10 000. |
<!-- /@api:atributos -->

### Eventos

<!-- @api:eventos -->
| Evento | Payload (`e.detail`) | Descripción |
| ------ | ------ | ------ |
| `trigger` | `SheetPayload` | Click en modo `manual`; incluye el resumen de lo que se descargaría. |
| `before-download` | `SheetBeforeDownloadPayload` | Antes de generar el archivo; llamá `cancel()` de forma sincrónica para evitarlo. |
| `download` | `SheetPayload` | Genera el archivo y dispara la descarga. Devuelve el payload o `null` si se canceló. |
| `heavy` | `SheetPayload` | La exportación superó `heavyThreshold` (10 000 celdas por defecto). |
| `error` | `unknown` | No se pudo generar o descargar el archivo. |
<!-- /@api:eventos -->

### Slots

<!-- @api:slots -->
Ninguno.
<!-- /@api:slots -->

### Métodos

<!-- @api:metodos -->
| Método | Descripción |
| ------ | ------ |
| `setData` | Reemplaza las filas y, opcionalmente, las columnas. |
| `setOptions` | Fusiona opciones de exportación. |
| `download` | Genera el archivo y dispara la descarga; devuelve el payload o `null` si se canceló. |
| `getPayload` | Resumen actual de la exportación, sin descargar. |
<!-- /@api:metodos -->

## API Vue

### Props

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

### Emits

<!-- @api:emits -->
| Evento | Payload | Descripción |
| ------ | ------ | ------ |
| `before-download` | `SheetBeforeDownloadPayload` | Antes de generar el archivo; llamá `cancel()` de forma sincrónica para evitarlo. |
| `trigger` | `SheetPayload` | Click en modo `manual`; incluye el resumen de lo que se descargaría. |
| `error` | `unknown` | No se pudo generar o descargar el archivo. |
| `download` | `SheetPayload` | Genera el archivo y dispara la descarga. Devuelve el payload o `null` si se canceló. |
| `heavy` | `SheetPayload` | La exportación superó `heavyThreshold` (10 000 celdas por defecto). |
<!-- /@api:emits -->

### Slots

<!-- @api:slots-vue -->
Ninguno.
<!-- /@api:slots-vue -->

### Expose

<!-- @api:expose -->
| Método | Descripción |
| ------ | ------ |
| `setData` | Reemplaza las filas y, opcionalmente, las columnas. |
| `setOptions` | Fusiona opciones de exportación (`filename`, `format`, `sheetName`, `delimiter`, `config`, `heavyThreshold`). |
| `download` | Genera el archivo y dispara la descarga. Devuelve el payload o `null` si se canceló. |
| `getPayload` | Resumen actual: filas, columnas, celdas, formato y nombre del archivo. |
<!-- /@api:expose -->
