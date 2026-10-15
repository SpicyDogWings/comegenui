<!-- @api:atributos -->
| Atributo | Tipo | Default | Descripción |
| ------ | ------ | ------ | ------ |
| `color` | `"primary" \| "secondary" \| "neutral" \| "success" \| "warning" \| "danger"` | `"primary"` | Color semántico: `primary`, `secondary`, `neutral`, `success`, `warning`, `danger` |
| `variant` | `"solid" \| "soft" \| "ghost" \| "boxed"` | `"ghost"` | `ghost`, `solid`, `boxed`, `soft` |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | `sm`, `md`, `lg` |
| `disabled` | `boolean` | `—` | Deshabilita todas las pestañas |
| `model-value` | `string` | `""` | Key del tab activo (controlado) |
| `tabs` | `{ key: string; label: string; icon?: string \| undefined; disabled?: boolean \| undefined; keepAlive?: boolean \| undefined; }[]` | `[]` | Definición de las pestañas |
<!-- /@api:atributos -->
