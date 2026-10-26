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
