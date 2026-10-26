| Atributo | Tipo | Default | Descripción |
| ------ | ------ | ------ | ------ |
| `color` | `"primary" \| "secondary" \| "neutral" \| "success" \| "warning" \| "danger"` | `"neutral"` | Color semántico del texto; se resuelve vía el token `--cu-color-{color}` |
| `label` | `string` | `""` | Texto del label (modo declarativo) |
| `for` | `string` | `""` | ID del elemento a enfocar; si es `checkbox`/`radio`, también lo activa (toggle). Con `for` el control queda fuera del label; si falta, se enfoca el primer control del slot |
| `hight-contrast` | `boolean` | `false` | Modo de alto contraste para el texto |
