| Atributo | Tipo | Default | Descripción |
| ------ | ------ | ------ | ------ |
| `color` | `"primary" \| "secondary" \| "neutral" \| "success" \| "warning" \| "danger"` | `"neutral"` | Color semántico: `primary`, `neutral`, `success`, `warning`, `danger` |
| `variant` | `"outlined" \| "soft" \| "ghost" \| "subtle"` | `"soft"` | `outlined`, `soft`, `ghost`, `subtle` |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | Tamaño del campo y de los botones: `sm`, `md`, `lg` |
| `disabled` | `boolean` | `false` | Estado deshabilitado: apaga el campo, los botones y el select de paso |
| `read-only` | `boolean` | `false` | Solo lectura (en HTML: `read-only`) |
| `model-value` | `number` | `null` | Valor actual (`null` = campo vacío). El CE sincroniza su estado; asigná `modelValue` sólo si querés controlarlo |
| `steps` | `number[]` | `[1, 5, 10]` | Pasos ofrecidos por el select (se asigna como propiedad JS; `step` siempre está incluido) |
| `step` | `number` | `1` | Incremento por defecto de los botones y las flechas |
| `show-controls` | `boolean` | `true` | Muestra los botones − / + a los costados del campo |
| `show-step-select` | `boolean` | `false` | Muestra el select de paso (atributo HTML: `show-step-select`) |
| `placeholder` | `string` | `—` | Placeholder del campo |
| `min` | `number` | `—` | Valor mínimo permitido (inclusive); por debajo se clampea |
| `max` | `number` | `—` | Valor máximo permitido (inclusive); por encima se clampea |
