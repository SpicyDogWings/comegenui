| Prop | Tipo | Default | Descripción |
| ------ | ------ | ------ | ------ |
| `color` | `string` | `"neutral"` | Color semántico del editor. |
| `variant` | `string` | `"ghost"` | Variante visual del editor. |
| `disabled` | `boolean` | `false` | Deshabilita la edición de la celda. |
| `validation` | `{ success: boolean; error: string \| null; }` | `{ success: false, error: null }` | Estado de validación: success y mensaje de error. |
| `inlineEdit` | `boolean` | `false` | Muestra el editor directo en toda la tabla, sin lápiz. |
| `value` | `string \| number \| boolean` | `—` | Valor actual de la celda. |
| `column` | `Column` | `—` | Configuración de la columna: editor, validación y alineación. |
| `row` | `Record<string, any>` | `—` | Fila completa a la que pertenece la celda. |
| `index` | `number` | `—` | Índice de la fila en los datos. |
