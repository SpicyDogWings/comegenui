| Atributo | Tipo | Default | Descripción |
| ------ | ------ | ------ | ------ |
| `type` | `string` | `"text"` | `text`, `password`, `email`, `number`, `tel`, `url`, `search` |
| `loading` | `boolean` | `false` | Muestra el spinner de carga en el panel de sugerencias |
| `color` | `"primary" \| "secondary" \| "neutral" \| "success" \| "warning" \| "danger"` | `"neutral"` | Color semántico: `primary`, `neutral`, `success`, `warning`, `danger` |
| `variant` | `"outlined" \| "soft" \| "ghost" \| "subtle"` | `"soft"` | `outlined`, `soft`, `ghost`, `subtle` |
| `disabled` | `boolean` | `false` | Estado deshabilitado |
| `read-only` | `boolean` | `false` | Solo lectura (en HTML se usa como `readonly`) |
| `placeholder` | `string` | `""` | Placeholder del input |
| `min-chars` | `number` | `0` | Caracteres mínimos para que el menú se abra al tipear o al enfocar (atributo HTML: `min-chars`) |
| `position` | `"left" \| "right" \| "bottom" \| "top"` | `"bottom"` | Posición del dropdown: `bottom`, `top` |
| `align` | `"center" \| "start" \| "end"` | `"start"` | Alineación: `start`, `center`, `end` |
| `fixed` | `boolean` | `false` | Panel en `position: fixed` (útil en contenedores con overflow) |
| `text-align` | `"center" \| "left" \| "right"` | `"left"` | Alineación del texto: el input (texto y placeholder) y los items del panel. `left` (default), `center`, `right`. |
| `items` | `unknown[]` | `[]` | Opciones del menú (ver abajo). Se asigna como propiedad JS |
| `model-value` | `string` | `""` | Valor actual del texto. El CE sincroniza su estado; asigná `modelValue` sólo si querés controlarlo |
