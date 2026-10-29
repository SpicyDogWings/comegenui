| Atributo | Tipo | Default | Descripción |
| ------ | ------ | ------ | ------ |
| `color` | `"primary" \| "secondary" \| "neutral" \| "success" \| "warning" \| "danger"` | `"neutral"` | Color semántico del modal: `primary`, `secondary`, `neutral`, `success`, `warning`, `danger`. |
| `size` | `"sm" \| "md" \| "lg" \| "auto" \| "xl" \| "full"` | `"auto"` | Ancho del modal: `auto`, `sm`, `md`, `lg`, `xl`, `full` |
| `title` | `string` | `""` | Título del modal |
| `placeholder` | `string` | `"Buscar comandos…"` | Placeholder del input de búsqueda |
| `height` | `"sm" \| "md" \| "lg" \| "auto" \| "xl" \| "full"` | `"auto"` | Alto del modal: `auto`, `sm`, `md`, `lg`, `xl`, `full` |
| `commands` | `CommandItem[]` | `[]` | Comandos disponibles: `{ id, label, action, description?, category?, badges?, icon?, shortcut? }[]`. Se asigna como propiedad JS |
