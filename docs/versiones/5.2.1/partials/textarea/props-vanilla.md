| Atributo | Tipo | Default | Descripción |
| ------ | ------ | ------ | ------ |
| `color` | `"primary" \| "secondary" \| "neutral" \| "success" \| "warning" \| "danger"` | `"neutral"` | Color semántico: `primary`, `neutral`, `success`, `warning`, `danger` |
| `variant` | `"outlined" \| "soft" \| "ghost" \| "subtle"` | `"soft"` | `outlined`, `soft`, `ghost`, `subtle` |
| `disabled` | `boolean` | `false` | Estado deshabilitado |
| `read-only` | `boolean` | `false` | Solo lectura (en HTML: `read-only`) |
| `model-value` | `string` | `""` | Valor actual del textarea. El CE sincroniza su estado; asigná `modelValue` sólo si querés controlarlo |
| `rows` | `number` | `3` | Cantidad de filas visibles |
| `no-resize` | `boolean` | `false` | Desactiva el redimensionado manual (atributo HTML: `no-resize`) |
| `placeholder` | `string` | `—` | Placeholder del textarea |
| `start-value` | `string` | `—` | Valor inicial usado por `.reset()` |
