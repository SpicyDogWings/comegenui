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
