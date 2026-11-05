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
| `exportButton` | `ExportButtonConfig \| null` | `{}` | Configuración visual del botón. Defaults: `label` «Descargar Excel», `color` `success`, `variant` `solid`, `disabled` `false`. Con `label: ""` queda sólo el ícono (nombre accesible «Descargar Excel»). `disabled` sólo apaga el botón: `exportToExcel()` sigue disponible por método |
| `filters` | `Record<string, any>` | `{}` | — |
| `loading` | `boolean` | `false` | — |
| `actions` | `ButtonConfig[] \| ((row: Record<string, any>) => ButtonConfig[])` | `[]` | — |
| `actionsLabel` | `string` | `""` | — |
| `rowDisabled` | `boolean \| ((row: Record<string, any>) => boolean)` | `false` | — |
| `footer` | `FooterRow[]` | `[]` | — |
| `tableMaxHeight` | `string` | `""` | — |
| `inlineEditing` | `boolean` | `false` | — |
| `compact` | `boolean` | `false` | — |
