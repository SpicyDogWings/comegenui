| Atributo | Tipo | Default | Descripción |
| ------ | ------ | ------ | ------ |
| `color` | `"primary" \| "secondary" \| "neutral" \| "success" \| "warning" \| "danger"` | `"neutral"` | Color semántico del toggle: `primary`, `neutral`, `success`, `warning`, `danger` |
| `variant` | `"solid" \| "outlined" \| "soft" \| "ghost" \| "subtle" \| "link" \| "none"` | `"ghost"` | Variante del toggle: `solid`, `outlined`, `soft`, `ghost`, `subtle`, `link`, `none` |
| `disabled` | `boolean` | `false` | Deshabilita el toggle |
| `position` | `"bottom" \| "top"` | `"bottom"` | Posición preferida del panel: `bottom`, `top` |
| `align` | `"center" \| "start" \| "end"` | `"start"` | Alineación del panel: `start`, `center`, `end` |
| `fixed` | `boolean` | `false` | Si es `true`, el panel usa `position: fixed` en vez de absoluto |
| `items` | `unknown[]` | `[]` | Lista de items (ver abajo). Se asigna como propiedad JS, no como atributo HTML |
| `label` | `string` | `""` | Texto del toggle (se ignora si se provee slot `toggle`) |
| `offset` | `number` | `4` | Separación en píxeles entre el toggle y el panel |
| `text-align` | `"center" \| "left" \| "right"` | `"left"` | Alineación del texto de los items del panel: `left` (default), `center`, `right`. No aplica al toggle: su ancho lo define su contenido. |
