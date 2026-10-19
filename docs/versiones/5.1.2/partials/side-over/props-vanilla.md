| Atributo | Tipo | Default | Descripción |
| ------ | ------ | ------ | ------ |
| `size` | `string` | `"300px"` | Ancho (`left`/`right`) o alto (`top`/`bottom`) del panel. Valor CSS (`300px`, `40vw`) o preset: `sm`, `md`, `lg`, `xl`, `full`. Ignorado con `fullscreen` |
| `title` | `string` | `""` | Título de la cabecera (si está vacío y no es `persistent`, igual muestra el botón de cerrar) |
| `open` | `boolean` | `false` | Estado de visibilidad (v-model). Ver nota de atributo abajo |
| `position` | `"left" \| "right" \| "bottom" \| "top"` | `"right"` | Borde desde donde desliza: `left`, `right`, `top`, `bottom` |
| `persistent` | `boolean` | `false` | Si es `true`, no se cierra por backdrop, `Escape` ni el botón de cerrar |
| `z-index` | `number` | `1100` | Z-index del overlay (en HTML se usa como `z-index`) |
| `fullscreen` | `boolean` | `false` | Ocupa toda la pantalla |
