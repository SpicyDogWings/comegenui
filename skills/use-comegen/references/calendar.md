# Calendar — `<cu-calendar>` / `<Calendar>`

Calendario de un mes con navegación, modos `single`/`range`, límites `min`/`max`, días
deshabilitados y puntos de eventos.

## Cuándo usarlo

Para elegir una fecha (`single`) o un rango (`range`) dentro de un mes, con restricciones de días y
marcas de eventos. Para un trigger con dropdown, usá `cu-date-picker`, que envuelve este calendario.

## Receta

1. La fecha va con `model-value` (`"YYYY-MM-DD"`, `Date` o timestamp):
   `<cu-calendar model-value="2026-08-11">`; en Vue, `v-model`.
2. `mode="single"` (default) selecciona una fecha con un click. `mode="range"` arma el rango con dos
   clicks, reflejado en `rangeStart`/`rangeEnd`.
3. `min`/`max` recortan la navegación y deshabilitan días. `disabled-weekdays="0,6"` y
   `disabled-dates="2026-08-15,2026-08-16"` suman restricciones (strings CSV en HTML; array o string
   en Vue).
4. Los puntos se cargan con `events` **por JS**: `[{ date: '2026-08-03', color: 'primary' }]`.
5. Encabezado/semana: `year-navigation`, `month-format` (`MMMM`/`MMM`/`MM`/`M`), `year-format`
   (`yyyy`/`yy`), `locale` y `week-start` (`0` = domingo, `1` = lunes).
6. Por código: `nextMonth()`, `prevMonth()`, `goToMonth(date)`, `getValue()`, `setValue(date)`,
   `getRange()`, `setRange(start, end)`, `clear()`.

```html
<!-- HTML plano (UMD) -->
<script src="dist/CuCalendar.core.umd.js"></script>

<cu-calendar id="cal" mode="range" color="primary" year-navigation
             min="2026-08-01" max="2026-12-31" month-format="MMM" year-format="yy"></cu-calendar>

<script>
  const cal = document.getElementById('cal');
  cal.events = [
    { date: '2026-08-03', color: 'primary' },
    { date: '2026-08-11', color: 'warning' },
  ];
  cal.disabledWeekdays = '0,6';

  cal.addEventListener('select', (e) => console.log('rango', e.detail)); // { start, end }
  cal.setRange('2026-08-10', '2026-08-20');
</script>
```

```vue
<!-- Vue -->
<script setup lang="ts">
import Calendar from "@/components/controls/Calendar.vue";
import { ref } from "vue";

const rangeStart = ref("2026-08-10");
const rangeEnd = ref("2026-08-20");
const events = ref([
  { date: "2026-08-03", color: "primary" },
  { date: "2026-08-11", color: "warning" },
]);
</script>

<template>
  <Calendar
    mode="range"
    v-model:range-start="rangeStart"
    v-model:range-end="rangeEnd"
    :events="events"
    :disabled-weekdays="[0, 6]"
    min="2026-08-01"
    max="2026-12-31"
  />
</template>
```

## Qué puede y qué no puede

**Puede:** 6 colores (default `primary`), 4 variantes (`solid`, `outlined`, `soft`, `subtle`), `mode`
(`single`/`range`), `min`/`max`, `disabledWeekdays`, `disabledDates`, `locale`, `weekStart`,
`yearNavigation`, `monthFormat`, `yearFormat`, `events` (puntos por fecha con color),
`rangeStart`/`rangeEnd`, `grid`/`border`, `viewMonth` controlado y `disabled`. Emite `select`,
`change`, `update:modelValue`, `update:viewMonth`, `update:rangeStart` y `update:rangeEnd`, y expone
8 métodos (`nextMonth`, `prevMonth`, `goToMonth`, `getValue`, `setValue`, `getRange`, `setRange`,
`clear`).

**No puede:**

- **`events` va sólo por JS** (es un array): `cal.events = [...]`, nunca como atributo.
- **En `mode="single"` se ignoran `rangeStart` y `rangeEnd`:** el rango sólo vive en
  `mode="range"`. En `single`, la única selección es el click simple (`modelValue`).
- **No acepta `variant="ghost"`** (se eliminó porque se confundía con el día de hoy). El día actual
  se muestra con look ghost fijo.
- **No tiene slots.**
- **Un número en `modelValue` es un timestamp, no un año:** `2026` ≈ 1970. Usá `"YYYY-MM-DD"`.
- **`disabledWeekdays`/`disabledDates` en HTML son strings CSV** (`"0,6"`); en Vue aceptan array.
- **Defaults distintos entre CE y Vue:** `disabledWeekdays`/`disabledDates` son `''` en el CE y `[]`
  en el `.vue`.
- **`setValue`/`setRange` programáticos no validan** `min`/`max` ni días deshabilitados: el filtro se
  aplica al click.
- **No hay selección múltiple** ni varios rangos a la vez.
- **El ancho lo decide el contenedor** (7 columnas `1fr`); con `year-navigation` el header pide un
  `min-width` de ~330px.

## API del custom element

### Atributos

<!-- @api:atributos -->
| Atributo | Tipo | Default | Descripción |
| ------ | ------ | ------ | ------ |
| `color` | `"primary" \| "secondary" \| "neutral" \| "success" \| "warning" \| "danger"` | `'primary'` | Color semántico: `primary`, `secondary`, `neutral`, `success`, `warning`, `danger` |
| `variant` | `"solid" \| "outlined" \| "soft" \| "subtle"` | `'soft'` | Variante del día seleccionado: `solid`, `outlined`, `soft`, `subtle` (sin `ghost`: se confunde con el día de hoy) |
| `mode` | `"single" \| "range"` | `'single'` | Modo de selección: `single` (una fecha) o `range` (inicio + fin) |
| `disabled` | `boolean` | `false` | Deshabilita todo el calendario |
| `model-value` | `string \| number \| Date \| null` | `null` | Fecha seleccionada. Acepta `Date`, timestamp o `"YYYY-MM-DD"` (ver [Formato de fechas](#formato-de-fechas)) |
| `min` | `string \| number \| Date \| null` | `null` | Fecha mínima seleccionable (días anteriores quedan deshabilitados) |
| `max` | `string \| number \| Date \| null` | `null` | Fecha máxima seleccionable |
| `disabled-weekdays` | `string \| number[]` | `''` | Días de la semana no seleccionables (`0`=domingo … `6`=sábado). En HTML plano: `disabled-weekdays="0,6"` |
| `disabled-dates` | `string \| (string \| Date)[]` | `''` | Fechas puntuales no seleccionables `"YYYY-MM-DD"`. En HTML plano: `disabled-dates="2026-08-15,2026-08-16"` |
| `locale` | `string` | `'es'` | Locale para nombres de mes y días de la semana |
| `week-start` | `number` | `1` | Día en que arranca la semana: `0` = domingo, `1` = lunes |
| `year-navigation` | `string \| boolean` | `false` | Muestra botones `«`/`»` para saltar de año en el header |
| `month-format` | `"M" \| "MMMM" \| "MMM" \| "MM"` | `'MMMM'` | Formato del mes en el header: `MMMM` (septiembre), `MMM` (sept), `MM` (09) o `M` (9). Un valor no soportado cae a `MMMM` |
| `year-format` | `"yyyy" \| "yy"` | `'yyyy'` | Formato del año (badge cuando el mes no es del año actual): `yyyy` (2026) o `yy` (26). Un valor no soportado cae a `yyyy` |
| `events` | `CalendarEvent[]` | `[]` | Eventos a señalar con puntos bajo la fecha (ver [Eventos](#eventos-puntos)). Se asigna como propiedad JS |
| `range-start` | `string \| number \| Date \| null` | `null` | Inicio del rango (resalta los días entre inicio y fin). Se asigna como propiedad JS |
| `range-end` | `string \| number \| Date \| null` | `null` | Fin del rango. Se asigna como propiedad JS |
| `grid` | `boolean` | `false` | Dibuja líneas **interiores** (cuadrícula) entre los días. En HTML plano: `<cu-calendar grid>` |
| `border` | `boolean` | `false` | Dibuja el **marco exterior** alrededor de la cuadrícula de días. Combinable con `grid` |
| `view-month` | `string \| number \| Date \| null` | `null` | Mes visible (primer día) controlado desde afuera. Navegar emite `update:viewMonth`. Se asigna como propiedad JS |
<!-- /@api:atributos -->

### Eventos

<!-- @api:eventos -->
| Evento | Payload (`e.detail`) | Descripción |
| ------ | ------ | ------ |
| `select` | `CalendarChange` | — |
| `change` | `CalendarChange` | — |
| `update:modelValue` | `Date` | — |
| `update:viewMonth` | `Date` | — |
| `update:rangeStart` | `Date \| null` | — |
| `update:rangeEnd` | `Date \| null` | — |
<!-- /@api:eventos -->

### Slots

<!-- @api:slots -->
Ninguno.
<!-- /@api:slots -->

### Métodos expuestos

<!-- @api:metodos -->
| Método | Descripción |
| ------ | ------ |
| `nextMonth` | Va al mes siguiente (respeta `max`) |
| `prevMonth` | Va al mes anterior (respeta `min`) |
| `goToMonth` | Navega al mes de la fecha dada |
| `getValue` | null` con la fecha seleccionada |
| `setValue` | Selecciona una fecha (acepta string/number/Date) |
| `getRange` | null` con el rango seleccionado (modo `range`) |
| `setRange` | Setea el rango (acepta string/number/Date) (modo `range`) |
| `clear` | Limpia el rango seleccionado (modo `range`) |
<!-- /@api:metodos -->

## API del componente Vue

### Props

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

### Emits

<!-- @api:emits -->
| Evento | Payload | Descripción |
| ------ | ------ | ------ |
| `select` | `CalendarChange` | — |
| `update:modelValue` | `Date` | — |
| `update:viewMonth` | `Date` | — |
| `update:rangeStart` | `Date \| null` | — |
| `update:rangeEnd` | `Date \| null` | — |
| `change` | `CalendarChange` | — |
<!-- /@api:emits -->

### Slots

<!-- @api:slots-vue -->
Ninguno.
<!-- /@api:slots-vue -->

### Expose

<!-- @api:expose -->
| Método | Descripción |
| ------ | ------ |
| `nextMonth` | Avanza al mes siguiente (respetando max). |
| `prevMonth` | Retrocede al mes anterior (respetando min). |
| `goToMonth` | Navega al mes de la fecha indicada. |
| `getValue` | Devuelve la fecha seleccionada (modo `single`). |
| `setValue` | Establece la fecha seleccionada y emite los eventos de cambio (modo `single`). |
| `getRange` | Devuelve el rango seleccionado (modo `range`). |
| `setRange` | Setea el rango y emite los eventos de cambio (modo `range`). |
| `clear` | Limpia el rango seleccionado (modo `range`). |
<!-- /@api:expose -->
