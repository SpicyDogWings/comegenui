| Atributo | Tipo | Default | Descripción |
| ------ | ------ | ------ | ------ |
| `color` | `"primary" \| "secondary" \| "neutral" \| "success" \| "warning" \| "danger"` | `"neutral"` | Color semántico: `primary`, `neutral`, `success`, `warning`, `danger` |
| `max-height` | `string` | `""` | Altura máxima del listado (ej: `"200px"`). Sin scroll si se omite. |
| `disabled` | `boolean` | `—` | Deshabilita interacción |
| `read-only` | `boolean` | `—` | Modo solo lectura |
| `placeholder` | `string` | `"Selecciona un archivo o arrastra aquí"` | Texto cuando no hay archivos |
| `model-value` | `File \| File[] \| null` | `null` | Archivo/s seleccionados |
| `multiple` | `boolean` | `—` | Permite múltiples archivos |
| `directory` | `boolean` | `—` | Activa modo carpeta (incluye `multiple` implícitamente) |
| `directory-deep` | `number` | `0` | Niveles de recursión en carpetas: `0` = solo raíz, `1` = +1 subnivel, `-1` = sin límite |
| `max-size` | `number` | `—` | Tamaño máximo en bytes |
| `accept` | `string` | `—` | Tipos aceptados (ej: `"image/*"`) |
