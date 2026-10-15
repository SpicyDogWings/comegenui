<!-- @api:atributos -->
| Atributo | Tipo | Default | Descripción |
| ------ | ------ | ------ | ------ |
| `type` | `"number" \| "text" \| "password" \| "email" \| "tel" \| "url" \| "search"` | `"text"` | `text`, `password`, `email`, `number`, `tel`, `url`, `search` |
| `color` | `"primary" \| "secondary" \| "neutral" \| "success" \| "warning" \| "danger"` | `"neutral"` | Color semántico: `primary`, `neutral`, `success`, `warning`, `danger` |
| `variant` | `"outlined" \| "soft" \| "ghost" \| "subtle"` | `"soft"` | `outlined`, `soft`, `ghost`, `subtle` |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | Tamaño: `sm`, `md`, `lg` |
| `disabled` | `boolean` | `false` | Estado deshabilitado |
| `read-only` | `boolean` | `false` | Solo lectura (en HTML: `read-only`) |
| `model-value` | `string` | `""` | Valor actual del input. El CE sincroniza su estado; asigná `modelValue` sólo si querés controlarlo |
| `placeholder` | `string` | `—` | Placeholder del input |
| `start-value` | `string` | `—` | Valor inicial usado por `.reset()` |
<!-- /@api:atributos -->
