<!-- @api:atributos -->
| Atributo | Tipo | Default | Descripción |
| ------ | ------ | ------ | ------ |
| `color` | `"primary" \| "secondary" \| "neutral" \| "success" \| "warning" \| "danger"` | `"neutral"` | Color semántico: `primary`, `neutral`, `success`, `warning`, `danger` |
| `variant` | `"outlined" \| "soft" \| "ghost" \| "subtle"` | `"soft"` | `outlined`, `soft`, `ghost`, `subtle` |
| `search-enabled` | `boolean` | `false` | Activa búsqueda por teclado (estilo select nativo: escribir hace scroll al match) |
| `loading` | `boolean` | `false` | Muestra una barra de progreso animada en el dropdown |
| `disabled` | `boolean` | `false` | Estado deshabilitado |
| `position` | `string` | `"bottom"` | Posición del dropdown: `bottom`, `top` |
| `align` | `string` | `"start"` | Alineación: `start`, `center`, `end` |
| `fixed` | `boolean` | `false` | Si es `true`, el dropdown usa `position: fixed` en vez de absoluto |
| `model-value` | `string` | `""` | Valor seleccionado. El CE sincroniza su estado; asigná `modelValue` sólo si querés controlarlo |
| `text-align` | `"center" \| "left" \| "right"` | `"left"` | Alineación del texto seleccionado: `left`, `center`, `right` |
| `search-mode` | `"includes" \| "startsWith"` | `"startsWith"` | Modo de coincidencia: `startsWith` (solo al inicio del label) o `includes` (en cualquier parte) |
| `options` | `SelectOption[]` | `[]` | Opciones del select (ver abajo). Se asigna como propiedad JS |
| `placeholder-wrap` | `boolean` | `false` | Si `true`, el texto wrappea; si `false`, se trunca con `...` (atributo HTML: `placeholder-wrap`) |
| `search-reset-delay` | `number` | `1000` | Tiempo (ms) antes de resetear el texto de búsqueda. Se reinicia con cada tecla |
| `cooldown-variant` | `string` | `"ghost-hover"` | Estilo de la barra de cooldown: `ghost-hover` (default) o el `variant` que quieras, p. ej. `solid` (color lleno). No se muestra si `loading` está activo |
| `placeholder` | `string` | `—` | Texto mostrado cuando no hay selección |
<!-- /@api:atributos -->
