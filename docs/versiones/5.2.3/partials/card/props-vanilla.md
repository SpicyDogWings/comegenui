| Atributo | Tipo | Default | Descripción |
| ------ | ------ | ------ | ------ |
| `color` | `"primary" \| "secondary" \| "neutral" \| "success" \| "warning" \| "danger"` | `"neutral"` | Color semántico: `primary`, `secondary`, `neutral`, `success`, `warning`, `danger` |
| `variant` | `"solid" \| "outlined" \| "soft" \| "ghost" \| "subtle"` | `"ghost"` | `ghost` (default), `outlined`, `soft`, `subtle`, `solid` |
| `layout` | `"vertical" \| "horizontal"` | `"vertical"` | `vertical` (media arriba) o `horizontal` (media al costado) |
| `title` | `string` | `—` | Título del header. Se mantiene por compatibilidad: el atributo `title` queda en el host y el navegador muestra su tooltip nativo sobre toda la tarjeta. Usá `heading` para evitar el tooltip. |
| `heading` | `string` | `—` | Título del header (alias preferido de `title`). Si vienen ambos, gana `heading`. |
| `subtitle` | `string` | `—` | Subtítulo bajo el título |
| `image` | `string` | `—` | URL de imagen que se muestra como media en la parte superior (o al costado con `layout="horizontal"`) |
