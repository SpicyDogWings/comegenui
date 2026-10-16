| Atributo | Tipo | Default | Descripción |
| ------ | ------ | ------ | ------ |
| `color` | `"primary" \| "secondary" \| "neutral" \| "success" \| "warning" \| "danger"` | `'primary'` | Color semántico: `primary`, `secondary`, `neutral`, `success`, `warning`, `danger` |
| `variant` | `"solid" \| "outlined" \| "soft" \| "subtle"` | `'soft'` | Variante del día seleccionado: `solid`, `outlined`, `soft`, `subtle` (sin `ghost`: se confunde con el día de hoy) |
| `mode` | `"single" \| "range"` | `'single'` | Modo de selección: `single` (una fecha) o `range` (inicio + fin) |
| `disabled` | `boolean` | `false` | Deshabilita todo el calendario |
| `model-value` | `string \| number \| Date \| null` | `null` | Fecha seleccionada. Acepta `Date`, timestamp o `"YYYY-MM-DD"` (ver «Formato de fechas») |
| `min` | `string \| number \| Date \| null` | `null` | Fecha mínima seleccionable (días anteriores quedan deshabilitados) |
| `max` | `string \| number \| Date \| null` | `null` | Fecha máxima seleccionable |
| `disabled-weekdays` | `string \| number[]` | `''` | Días de la semana no seleccionables (`0`=domingo … `6`=sábado). En HTML plano: `disabled-weekdays="0,6"` |
| `disabled-dates` | `string \| (string \| Date)[]` | `''` | Fechas puntuales no seleccionables `"YYYY-MM-DD"`. En HTML plano: `disabled-dates="2026-08-15,2026-08-16"` |
| `locale` | `string` | `'es'` | Locale para nombres de mes y días de la semana |
| `week-start` | `number` | `1` | Día en que arranca la semana: `0` = domingo, `1` = lunes |
| `year-navigation` | `string \| boolean` | `false` | Muestra botones `«`/`»` para saltar de año en el header |
| `month-format` | `"M" \| "MMMM" \| "MMM" \| "MM"` | `'MMMM'` | Formato del mes en el header: `MMMM` (septiembre), `MMM` (sept), `MM` (09) o `M` (9). Un valor no soportado cae a `MMMM` |
| `year-format` | `"yyyy" \| "yy"` | `'yyyy'` | Formato del año (badge cuando el mes no es del año actual): `yyyy` (2026) o `yy` (26). Un valor no soportado cae a `yyyy` |
| `events` | `CalendarEvent[]` | `[]` | Eventos a señalar con puntos bajo la fecha (ver «Eventos (puntos)»). Se asigna como propiedad JS |
| `range-start` | `string \| number \| Date \| null` | `null` | Inicio del rango (resalta los días entre inicio y fin). Se asigna como propiedad JS |
| `range-end` | `string \| number \| Date \| null` | `null` | Fin del rango. Se asigna como propiedad JS |
| `grid` | `boolean` | `false` | Dibuja líneas **interiores** (cuadrícula) entre los días. En HTML plano: `<cu-calendar grid>` |
| `border` | `boolean` | `false` | Dibuja el **marco exterior** alrededor de la cuadrícula de días. Combinable con `grid` |
| `view-month` | `string \| number \| Date \| null` | `null` | Mes visible (primer día) controlado desde afuera. Navegar emite `update:viewMonth`. Se asigna como propiedad JS |
