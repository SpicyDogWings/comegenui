| Atributo | Tipo | Default | Descripción |
| ------ | ------ | ------ | ------ |
| `color` | `"primary" \| "secondary" \| "neutral" \| "success" \| "warning" \| "danger"` | `"neutral"` | Color semántico: `primary`, `secondary`, `neutral`, `success`, `warning`, `danger` |
| `height` | `string` | `""` | Alto CSS (`1rem`, `48px`); vacío = el default del `shape` (en `text`, alto de cada línea) |
| `width` | `string` | `""` | Ancho CSS (`100%`, `48px`, `12rem`); vacío = el default del `shape` |
| `animation` | `"none" \| "pulse" \| "wave"` | `"pulse"` | `pulse` (opacidad), `wave` (barrido) o `none`; con `prefers-reduced-motion` no anima |
| `shape` | `"text" \| "rect" \| "circle"` | `"rect"` | `rect` (bloque), `circle` (avatar) o `text` (líneas de texto) |
| `lines` | `number` | `1` | Cantidad de barras con `shape="text"` (se ignora en `rect` y `circle`) |
| `radius` | `"sm" \| "md" \| "lg" \| "none" \| "full"` | `""` | Radio de las esquinas; vacío = el default del `shape` (`rect` md, `circle` full, `text` sm) |
