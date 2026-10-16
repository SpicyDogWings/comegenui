| Atributo | Tipo | Default | Descripción |
| ------ | ------ | ------ | ------ |
| `type` | `"reset" \| "button" \| "submit"` | `'button'` | Tipo del `<button>`: `button`, `submit`, `reset` |
| `color` | `"primary" \| "secondary" \| "neutral" \| "success" \| "warning" \| "danger"` | `"neutral"` | Color semántico: `primary`, `secondary`, `neutral`, `success`, `warning`, `danger` |
| `variant` | `"solid" \| "outlined" \| "soft" \| "ghost" \| "subtle" \| "link" \| "none"` | `"ghost"` | `solid`, `outlined`, `soft`, `ghost`, `subtle`, `link`, `none` |
| `loading` | `boolean` | `false` | Antepone un spinner al contenido. Deshabilita el botón mientras está activo |
| `size` | `"sm" \| "md" \| "lg"` | `'md'` | Tamaño: `sm`, `md`, `lg` |
| `disabled` | `boolean` | `false` | Estado deshabilitado |
| `target` | `"_self" \| "_blank" \| "_parent" \| "_top"` | `"_self"` | Target del link cuando `to` está definido: `_self`, `_blank`, `_parent`, `_top` |
| `to` | `string` | `—` | Si se especifica, el botón se renderiza como `<a>` |
