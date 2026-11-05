[← Volver](../README.md)

# `ExportButton`

Botón que exporta filas a **XLSX** (default) o **CSV** y dispara la descarga en el navegador.
Comparte el core de archivos con [`cu-table`](./cu-table.md) y
[`cu-cells-importer`](./cu-cells-importer.md): mismos encabezados, formatos y conteos.

## Uso en HTML plano

```html
<script src="dist-libs/umd-core/CuExportButton.umd.js"></script>

<cu-export-button id="exportar" filename="personas"></cu-export-button>

<script>
  const boton = document.getElementById("exportar");

  // `data` y `columns` son arrays: van por propiedad, no por atributo.
  boton.columns = [
    { key: "nombre", label: "Nombre" },
    { key: "nota", label: "Nota interna", exportable: false },
  ];
  boton.data = [
    { nombre: "Ana", nota: "no se exporta" },
    { nombre: "Beto", nota: "no se exporta" },
  ];
</script>
```

Las columnas exportables aceptan `key`, `label`, `type`, `format` (formato numérico de Excel),
`width` y `exportable: false` (queda fuera del archivo). `data` son los valores crudos.

## Formato y nombre

`format` elige el archivo y el label por defecto: `xlsx` → **Descargar Excel**, `csv` →
**Descargar CSV**. `filename` es el nombre **sin** extensión; sin él se usa `export-YYYY-MM-DD`.
`sheet-name` nombra la hoja del XLSX (default `Datos`) y `delimiter` el separador del CSV (default `,`).

```html
<cu-export-button format="csv" delimiter=";" filename="personas"></cu-export-button>
<cu-export-button sheet-name="Personas" filename="personas"></cu-export-button>
```

## Apariencia

`color`, `variant` y `size` son los del [`cu-button`](./cu-button.md). `label` cambia el texto; con
`label=""` queda sólo el ícono y el nombre accesible sale del formato. `disabled` bloquea el click.

```html
<cu-export-button color="primary" variant="outlined"></cu-export-button>
<cu-export-button label=""></cu-export-button>
<cu-export-button disabled></cu-export-button>
```

## Modo manual

Con `manual` (atributo o `boton.manual = true`) el click **no descarga**: emite `trigger` con el
resumen (`format`, `fileName`, `rowCount`, `columnCount`, `cellCount`, `heavy`). El consumidor
decide y puede llamar `download()`.

```html
<cu-export-button id="revisar" manual filename="personas"></cu-export-button>

<script>
  const boton = document.getElementById("revisar");
  boton.data = [{ nombre: "Ana" }];
  boton.columns = [{ key: "nombre", label: "Nombre" }];

  boton.addEventListener("trigger", (e) => {
    if (confirm(`¿Descargar ${e.detail.rowCount} filas?`)) boton.download();
  });
</script>
```

## Eventos de descarga

Todos son `CustomEvent` sobre el host, con el payload en `e.detail`:

- `before-download`: antes de crear el archivo, con el resumen + `cancel()`. Si cancelás
  sincrónicamente, no se descarga nada.
- `download`: archivo generado y descarga disparada, con el payload.
- `heavy`: además de `download`, cuando las celdas alcanzan `heavy-threshold` (10 000 por defecto).
- `error`: si no se pudo generar o descargar el archivo.
- `trigger`: click en modo `manual`.

```html
<cu-export-button id="exportar"></cu-export-button>

<script>
  const boton = document.getElementById("exportar");
  boton.data = [{ nombre: "Ana" }];
  boton.columns = [{ key: "nombre", label: "Nombre" }];

  boton.addEventListener("before-download", (e) => {
    if (e.detail.heavy && !confirm("Son muchas filas. ¿Seguir?")) e.detail.cancel();
  });
  boton.addEventListener("heavy", (e) => avisar(e.detail.cellCount));
  boton.addEventListener("download", (e) => console.log("listo:", e.detail.fileName));
  boton.addEventListener("error", () => alerta("No se pudo exportar"));
</script>
```

## Métodos del host

- `setData(rows, columns?)`: reemplaza los datos (y opcionalmente las columnas).
- `setOptions(options)`: fusiona opciones del core (`format`, `filename`, `sheetName`, `delimiter`,
  `config`, `heavyThreshold`).
- `getPayload()`: resumen de lo que se descargaría, **sin** generar el archivo.
- `download()`: genera y descarga; devuelve el payload o `null` si se canceló.

```html
<script>
  const boton = document.getElementById("exportar");
  boton.setData([{ nombre: "Solo" }], [{ key: "nombre", label: "Nombre" }]);
  boton.setOptions({ filename: "visibles", format: "csv" });
  console.log(boton.getPayload()); // { format: "csv", fileName: "visibles.csv", ... }
  boton.download();
</script>
```

En Vue las mismas operaciones se exponen por `ref`: ver
[ficha Vue](/componentes/vue/export-button).

## Atributos

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

## Eventos

| Evento | Payload (`e.detail`) | Descripción |
| ------ | ------ | ------ |
| `trigger` | `SheetPayload` | Click en modo `manual`; incluye el resumen de lo que se descargaría. |
| `before-download` | `SheetBeforeDownloadPayload` | Antes de generar el archivo; llamá `cancel()` de forma sincrónica para evitarlo. |
| `download` | `SheetPayload` | Genera el archivo y dispara la descarga. Devuelve el payload o `null` si se canceló. |
| `heavy` | `SheetPayload` | La exportación superó `heavyThreshold` (10 000 celdas por defecto). |
| `error` | `unknown` | No se pudo generar o descargar el archivo. |

## Slots

Ninguno.

## Métodos expuestos

| Método | Descripción |
| ------ | ------ |
| `setData` | Reemplaza las filas y, opcionalmente, las columnas. |
| `setOptions` | Fusiona opciones de exportación. |
| `download` | Genera el archivo y dispara la descarga; devuelve el payload o `null` si se canceló. |
| `getPayload` | Resumen actual de la exportación, sin descargar. |
