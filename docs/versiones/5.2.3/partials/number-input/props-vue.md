| Prop | Tipo | Default | Descripción |
| ------ | ------ | ------ | ------ |
| `modelValue` | `number \| null` | `null` | — |
| `color` | `"primary" \| "secondary" \| "neutral" \| "success" \| "warning" \| "danger"` | `"neutral"` | Color semántico: `primary`, `neutral`, `success`, `warning`, `danger` |
| `variant` | `"outlined" \| "soft" \| "ghost" \| "subtle"` | `"soft"` | `outlined`, `soft`, `ghost`, `subtle` |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | Tamaño del campo y de los botones: `sm`, `md`, `lg` |
| `disabled` | `boolean` | `false` | Estado deshabilitado: apaga el campo, los botones y el select de paso |
| `readOnly` | `boolean` | `false` | Solo lectura: deja leer y seleccionar el texto, pero no editarlo ni cambiar el valor |
| `steps` | `number[]` | `[1, 5, 10]` | Pasos ofrecidos por el select de paso (el `step` siempre está incluido) |
| `step` | `number` | `1` | Incremento por defecto de los botones y las flechas |
| `showControls` | `boolean` | `true` | Muestra los botones − / + a los costados del campo |
| `showStepSelect` | `boolean` | `false` | Muestra el select de paso, que define cuánto suman o restan los botones y las flechas |
| `placeholder` | `string` | `—` | Placeholder del campo |
| `min` | `number` | `—` | Valor mínimo permitido (inclusive); por debajo se clampea |
| `max` | `number` | `—` | Valor máximo permitido (inclusive); por encima se clampea |
