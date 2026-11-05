| Prop | Tipo | Default | Descripción |
| ------ | ------ | ------ | ------ |
| `color` | `"primary" \| "secondary" \| "neutral" \| "success" \| "warning" \| "danger"` | `"neutral"` | — |
| `variant` | `"solid" \| "outlined" \| "soft" \| "ghost" \| "subtle"` | `"ghost"` | — |
| `layout` | `"vertical" \| "horizontal"` | `"vertical"` | — |
| `title` | `string` | `—` | Título visible del header. Se mantiene por compatibilidad: en el custom element el atributo `title` queda en el host y el navegador muestra su tooltip nativo sobre toda la tarjeta. Usá `heading` para evitarlo. |
| `heading` | `string` | `—` | Título visible del header (alias preferido de `title`). Si vienen ambos, gana `heading`. |
| `subtitle` | `string` | `—` | — |
| `image` | `string` | `—` | — |
