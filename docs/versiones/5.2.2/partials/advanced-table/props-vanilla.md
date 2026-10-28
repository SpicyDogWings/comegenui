| Atributo | Tipo | Default | Descripción |
| ------ | ------ | ------ | ------ |
| `columns` | `Column[]` | `[]` | Definición de columnas (ver «Interfaz de columna»). Se asigna como propiedad JS |
| `data` | `Record<string, any>[]` | `[]` | Filas de la tabla. Se asigna como propiedad JS |
| `empty` | `string` | `""` | Texto a mostrar cuando no hay datos. Si se omite, usa `"No hay datos que mostrar"` |
| `pagination` | `boolean` | `false` | Habilita paginación interna |
| `items-per-page` | `number` | `10` | Tamaño de página (atributo HTML: `items-per-page`) |
| `show-page-size` | `boolean` | `false` | Muestra selector de items por página (atributo HTML: `show-page-size`) |
| `page-size-options` | `number[]` | `[5, 10, 20, 50]` | Opciones del selector (atributo HTML: `page-size-options`). Se asigna como propiedad JS |
| `color` | `"primary" \| "secondary" \| "neutral" \| "success" \| "warning" \| "danger"` | `"neutral"` | Color semántico: `primary`, `neutral`, `success`, `warning`, `danger` |
| `variant` | `"solid" \| "outlined" \| "soft" \| "ghost" \| "subtle"` | `"soft"` | `solid`, `outlined`, `soft`, `ghost`, `subtle` |
| `search-enabled` | `boolean` | `false` | Habilita barra de búsqueda (atributo HTML: `search-enabled`) |
| `search-placeholder` | `string` | `"Buscar..."` | Placeholder del input de búsqueda (atributo HTML: `search-placeholder`) |
| `search-fields` | `string[]` | `[]` | Columnas donde buscar (atributo HTML: `search-fields`). Vacío = todas |
| `search-value` | `string` | `""` | Valor controlado del buscador (atributo HTML: `search-value`) |
| `filters` | `Record<string, any>` | `{}` | Filtros por columna. Se asigna como propiedad JS |
| `loading` | `boolean` | `false` | Muestra una barra de carga animada en el tope |
| `actions` | `unknown[] \| ((row: Record<string, any>) => unknown[])` | `[]` | Acciones de fila (botón "..." al final de cada fila). Array estático o función por fila. Se asigna como propiedad JS |
| `actions-label` | `string` | `""` | Texto del header de la columna de acciones. Default vacío. Atributo HTML: `actions-label` |
| `row-disabled` | `boolean \| ((row: Record<string, any>) => boolean)` | `false` | Deshabilita filas (ver «Deshabilitar filas, columnas y celdas»). Se asigna como propiedad JS |
| `footer` | `FooterRow[]` | `[]` | Filas de footer (ver «Footer (API programática)»). Se asigna como propiedad JS |
| `table-max-height` | `string` | `""` | Alto máximo del área scrolleable (CSS, ej. `40rem`). Atributo HTML: `table-max-height` |
| `inline-editing` | `boolean` | `false` | Editor visible siempre en las celdas editables, sin el lápiz (atributo HTML: `inline-editing`) |
| `compact` | `boolean` | `false` | Filas más compactas |
