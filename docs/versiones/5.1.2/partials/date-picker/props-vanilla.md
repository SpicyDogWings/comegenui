| Atributo | Tipo | Default | Descripción |
| ------ | ------ | ------ | ------ |
| `color` | `"primary" \| "secondary" \| "neutral" \| "success" \| "warning" \| "danger"` | `'neutral'` | Color semántico del trigger y del día seleccionado del calendario interno (se pasa tal cual; `neutral` = neutral, ya no mapea a primary) |
| `variant` | `"outlined" \| "soft" \| "ghost" \| "subtle"` | `'soft'` | Variante del trigger: `outlined`, `soft`, `ghost`, `subtle`. En el calendario interno `ghost` se mapea a `soft` (el calendario ya no tiene ghost) |
| `mode` | `"single" \| "range"` | `'single'` | Tipo de calendario: `single` (una fecha) o `range` (inicio + fin). Con `dual-calendar` el tipo es dual (range, 2 meses) |
| `disabled` | `boolean` | `false` | Deshabilita el picker completo |
| `placeholder` | `string` | `''` | Texto cuando no hay fecha (default: `"Seleccionar fecha..."`, rango: `"Seleccionar rango..."`) |
| `position` | `"left" \| "right" \| "bottom" \| "top"` | `'bottom'` | Lado donde aparece el panel: `bottom`, `top`, `left`, `right` |
| `align` | `"center" \| "start" \| "end"` | `'start'` | Alineación respecto al trigger: `start`, `center`, `end` |
| `fixed` | `boolean` | `false` | Panel en `position: fixed` (útil en contenedores con overflow) |
| `model-value` | `string \| number \| Date \| null` | `null` | Fecha seleccionada (calendario `single`) |
| `label` | `string` | `''` | Texto del label sobre el picker |
| `min` | `string \| number \| Date \| null` | `null` | Fecha mínima seleccionable |
| `max` | `string \| number \| Date \| null` | `null` | Fecha máxima seleccionable |
| `disabled-weekdays` | `string \| number[]` | `''` | Días de la semana no seleccionables (`0`=domingo … `6`=sábado). En HTML: `disabled-weekdays="0,6"` |
| `disabled-dates` | `string \| (string \| Date)[]` | `''` | Fechas puntuales no seleccionables. En HTML: `disabled-dates="2026-08-15,2026-08-16"` |
| `locale` | `string` | `'es'` | Locale del calendario y nombres de mes |
| `week-start` | `number` | `1` | Primer día de la semana (`0` domingo, `1` lunes) |
| `year-navigation` | `string \| boolean` | `false` | Controles de mes del calendario interno: botones `«`/`»` de año |
| `month-format` | `"M" \| "MMMM" \| "MMM" \| "MM"` | `'MMMM'` | Formato del mes en el header del calendario interno: `MMMM` (septiembre), `MMM` (sept), `MM` (09) o `M` (9). Un valor no soportado cae a `MMMM` |
| `year-format` | `"yyyy" \| "yy"` | `'yyyy'` | Formato del año (badge cuando el mes no es del año actual): `yyyy` (2026) o `yy` (26). Un valor no soportado cae a `yyyy` |
| `events` | `CalendarEvent[]` | `[]` | Eventos a señalar con puntos bajo la fecha en el calendario interno (ver [Eventos](cu-calendar.md#eventos-puntos)). Se asigna como propiedad JS |
| `grid` | `boolean` | `false` | Líneas **interiores** (cuadrícula) entre los días del calendario interno |
| `border` | `boolean` | `false` | **Marco exterior** alrededor de la cuadrícula de días del calendario interno |
| `start-date` | `string \| number \| Date \| null` | `null` | Inicio del rango. Solo con calendario de rango (`mode="range"` o `dual-calendar`); en `single` se ignora. En HTML: `start-date="2026-08-01"` |
| `end-date` | `string \| number \| Date \| null` | `null` | Fin del rango. Solo con calendario de rango (`mode="range"` o `dual-calendar`); en `single` se ignora. En HTML: `end-date="2026-08-31"` |
| `format` | `string` | `'dd/MM/yyyy'` | Formato de la fecha en el trigger (ver «Formato») |
| `value-format` | `string` | `''` | Formato del **valor**: si se setea, además de los eventos con `Date` emite `update:formattedValue`/`update:formattedStartDate`/`update:formattedEndDate` y `change-formatted`/`select-formatted` con el valor como string (mismos tokens que `format`). Vacío = deshabilitado |
| `dual-calendar` | `boolean` | `false` | Activa el rango a dos meses (dual). **Implica `range`**: aunque `mode` sea `single`, el picker selecciona un rango |
| `clearable` | `boolean` | `true` | Muestra el botón "Limpiar" en el footer del panel |
| `today-button` | `boolean` | `undefined` | Muestra el botón "Hoy" en el footer del panel (default: `true` en `single`, `false` en `range`) |
