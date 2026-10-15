<!-- @api:emits -->
| Evento | Payload | Descripción |
| ------ | ------ | ------ |
| `select` | `Date \| { start: Date \| null; end: Date \| null; }` | — |
| `close` | — | Cierra el panel. |
| `open` | — | Abre el panel. |
| `update:modelValue` | `Date \| null` | — |
| `change` | `Date \| { start: Date \| null; end: Date \| null; } \| null` | — |
| `update:startDate` | `Date \| null` | — |
| `update:endDate` | `Date \| null` | — |
| `update:formattedValue` | `string \| null` | — |
| `update:formattedStartDate` | `string \| null` | — |
| `update:formattedEndDate` | `string \| null` | — |
| `change-formatted` | `string \| { start: string \| null; end: string \| null; } \| null` | — |
| `select-formatted` | `string \| { start: string \| null; end: string \| null; }` | — |
<!-- /@api:emits -->
