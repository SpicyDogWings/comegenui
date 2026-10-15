<!-- @api:props -->
| Prop | Tipo | Default | Descripción |
| ------ | ------ | ------ | ------ |
| `color` | `"primary" \| "secondary" \| "neutral" \| "success" \| "warning" \| "danger"` | `'neutral'` | — |
| `variant` | `"outlined" \| "soft" \| "ghost" \| "subtle"` | `'soft'` | — |
| `mode` | `"single" \| "range"` | `'single'` | Tipo de calendario: `single` (una fecha, `Calendar`) o `range` (inicio + fin, `Calendar` en modo rango). Con `dualCalendar` el tipo es dual (range, 2 meses) |
| `disabled` | `boolean` | `false` | — |
| `placeholder` | `string` | `''` | — |
| `position` | `"left" \| "right" \| "bottom" \| "top"` | `'bottom'` | — |
| `align` | `"center" \| "start" \| "end"` | `'start'` | — |
| `fixed` | `boolean` | `false` | — |
| `modelValue` | `string \| number \| Date \| null` | `null` | Fecha seleccionada (calendario `single`) |
| `label` | `string` | `''` | — |
| `min` | `string \| number \| Date \| null` | `null` | — |
| `max` | `string \| number \| Date \| null` | `null` | — |
| `disabledWeekdays` | `string \| number[]` | `''` | — |
| `disabledDates` | `string \| (string \| Date)[]` | `''` | — |
| `locale` | `string` | `'es'` | — |
| `weekStart` | `number` | `1` | — |
| `yearNavigation` | `string \| boolean` | `false` | — |
| `monthFormat` | `"M" \| "MMMM" \| "MMM" \| "MM"` | `'MMMM'` | Formato del mes en el header del calendario interno: `MMMM` (septiembre), `MMM` (sept), `MM` (09) o `M` (9). Un valor no soportado cae a `MMMM` |
| `yearFormat` | `"yyyy" \| "yy"` | `'yyyy'` | Formato del año (badge cuando el mes no es del año actual): `yyyy` (2026) o `yy` (26). Un valor no soportado cae a `yyyy` |
| `events` | `CalendarEvent[]` | `[]` | — |
| `grid` | `boolean` | `false` | — |
| `border` | `boolean` | `false` | — |
| `startDate` | `string \| number \| Date \| null` | `null` | Inicio del rango. Solo con calendario de rango (`mode="range"` o `dualCalendar`); en `single` se ignora |
| `endDate` | `string \| number \| Date \| null` | `null` | Fin del rango. Solo con calendario de rango (`mode="range"` o `dualCalendar`); en `single` se ignora |
| `format` | `string` | `'dd/MM/yyyy'` | — |
| `dualCalendar` | `boolean` | `false` | Activa el rango a dos meses (dual). **Implica `range`**: aunque `mode` sea `single`, el picker selecciona un rango |
| `clearable` | `boolean` | `true` | — |
| `todayButton` | `boolean` | `undefined` | — |
<!-- /@api:props -->
