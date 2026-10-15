<!-- @api:props -->
| Prop | Tipo | Default | Descripción |
| ------ | ------ | ------ | ------ |
| `color` | `"primary" \| "secondary" \| "neutral" \| "success" \| "warning" \| "danger"` | `'primary'` | — |
| `variant` | `"solid" \| "outlined" \| "soft" \| "subtle"` | `'soft'` | — |
| `mode` | `"single" \| "range"` | `'single'` | Modo de selección: `single` (una fecha) o `range` (inicio + fin). |
| `disabled` | `boolean` | `false` | — |
| `modelValue` | `string \| number \| Date \| null` | `null` | — |
| `min` | `string \| number \| Date \| null` | `null` | — |
| `max` | `string \| number \| Date \| null` | `null` | — |
| `disabledWeekdays` | `string \| number[]` | `[]` | — |
| `disabledDates` | `string \| (string \| Date)[]` | `[]` | — |
| `locale` | `string` | `'es'` | — |
| `weekStart` | `number` | `1` | — |
| `yearNavigation` | `string \| boolean` | `false` | — |
| `monthFormat` | `"M" \| "MMMM" \| "MMM" \| "MM"` | `'MMMM'` | Formato del mes en el header: `MMMM` (septiembre), `MMM` (sept), `MM` (09) o `M` (9). Un valor no soportado cae a `MMMM` |
| `yearFormat` | `"yyyy" \| "yy"` | `'yyyy'` | Formato del año (badge cuando el mes no es del año actual): `yyyy` (2026) o `yy` (26). Un valor no soportado cae a `yyyy` |
| `events` | `CalendarEvent[]` | `[]` | — |
| `rangeStart` | `string \| number \| Date \| null` | `null` | — |
| `rangeEnd` | `string \| number \| Date \| null` | `null` | — |
| `grid` | `boolean` | `false` | — |
| `border` | `boolean` | `false` | — |
| `viewMonth` | `string \| number \| Date \| null` | `null` | — |
<!-- /@api:props -->
