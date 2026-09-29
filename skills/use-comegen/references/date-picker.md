# DatePicker — `<cu-date-picker>` / `<DatePicker>`

Botón-trigger que abre un dropdown con un calendario adentro: `mode="single"` selecciona una
fecha y `mode="range"` (o `dual-calendar`) un rango, con uno o dos meses.

## Cuándo usarlo

Para elegir una fecha o un período con calendario. Para un input de fecha nativo simple no hace
falta; para horarios no sirve. Si ya tenés tu propio contenedor y querés el calendario suelto,
usá `cu-calendar`.

## Receta

1. Elegí el modo: `single` (default, `v-model`/`model-value`) o `range`
   (`start-date`/`end-date`).
2. En range podés usar un mes (`mode="range"`) o dos (`dual-calendar`).
3. Vinculá los valores: en Vue `v-model` y `v-model:startDate`/`v-model:endDate`; en el CE
   `modelValue`, `startDate`, `endDate` + `update:*`.
4. Escuchá `change` (fecha, rango, `null`/`{ start: null, end: null }` al limpiar) y `select`
   (elección explícita); `open`/`close` avisan del panel.
5. `min`/`max`, `disabled-weekdays` y `disabled-dates` restringen días; `events` marca días con
   puntos y se asigna como **propiedad JS**.
6. `format` controla el texto del trigger con los tokens `dd`, `MM`, `MMM`, `MMMM`, `yy`, `yyyy`.
7. Programático: `open()`, `close()`, `toggle()`, `getValue()`, `setValue()`, `getStartDate()`,
   `getEndDate()`, `setRange()`, `clear()` e `isOpen()`.

```html
<!-- HTML plano (UMD) -->
<script src="dist/CuDatePicker.umd.js"></script>

<cu-date-picker id="rango" mode="range" label="Período" dual-calendar format="dd/MM/yyyy"></cu-date-picker>

<script>
  const r = document.getElementById('rango');
  r.startDate = '2026-09-03';
  r.endDate = '2026-09-15';
  r.addEventListener('change', (e) => console.log(e.detail));
  r.setRange('2026-09-01', '2026-09-30');
</script>
```

```vue
<!-- Vue -->
<script setup lang="ts">
import DatePicker from "@/components/form/DatePicker.vue";
import { ref } from "vue";

const startDate = ref<string | Date | null>(null);
const endDate = ref<string | Date | null>(null);
</script>

<template>
  <DatePicker
    mode="range"
    v-model:startDate="startDate"
    v-model:endDate="endDate"
    label="Período"
    dual-calendar
    @change="(v) => console.log(v)"
  />
</template>
```

## Qué puede y qué no puede

**Puede:** modo `single`/`range`, calendario dual (2 meses), `min`/`max`, días de la semana y
fechas puntuales deshabilitadas, eventos con punto, `grid`/`border`, `locale` y `week-start`,
formatos de fecha (`format`) y de mes/año (`month-format`/`year-format`), navegación de año,
`position`/`align`/`fixed`, botones "Hoy"/"Limpiar", `color`/`variant` y 10 métodos.

**No puede:**

- **No maneja hora:** sólo fecha (día).
- **`startDate`/`endDate` se ignoran en `single`.**
- **`dualCalendar` implica `range`:** aunque `mode` sea `single`, el picker selecciona un rango.
- **`setValue()` es no-op en range y `setRange()` es no-op en single.**
- **En range el panel queda abierto tras el primer click** (necesita el segundo para completar);
  en single cierra al elegir.
- **`clear()` en single cierra el panel; en range lo deja abierto.**
- **`events` no va por atributo:** es un array de objetos, se asigna como propiedad JS. Con el
  panel cerrado los puntos aparecen al abrir; para forzar el re-render con el panel abierto:
  `close()` + `open()`.
- **`variant="ghost"` no llega al calendario:** internamente se mapea a `soft`.
- **`today-button` tiene default distinto por modo:** `true` en single y `false` en range.
- **No tiene slots:** no se puede customizar el trigger ni el footer. Los botones son fijos
  ("Hoy"/"Limpiar").
- **No hay selector de mes/año desplegable** más allá de `year-navigation`.
- **`format` sólo entiende sus tokens:** un patrón raro no se interpreta como esperás.
- **El CE posiciona con `position`/`align`** (en el CE, `position` acepta `bottom`, `top`,
  `left`, `right`).

## API del custom element

### Atributos

<!-- @api:atributos -->
| Atributo | Tipo | Default | Descripción |
| ------ | ------ | ------ | ------ |
| `color` | `"primary" \| "secondary" \| "neutral" \| "success" \| "warning" \| "danger"` | `'neutral'` | Color semántico del trigger y del día seleccionado del calendario interno (se pasa tal cual; `neutral` = neutral, ya no mapea a primary) |
| `variant` | `"outlined" \| "soft" \| "ghost" \| "subtle"` | `'soft'` | Variante del trigger: `outlined`, `soft`, `ghost`, `subtle`. En el calendario interno `ghost` se mapea a `soft` (el calendario ya no tiene ghost) |
| `mode` | `"single" \| "range"` | `'single'` | Tipo de calendario: `single` (una fecha) o `range` (inicio + fin). Con `dual-calendar` el tipo es dual (range, 2 meses) |
| `disabled` | `boolean` | `false` | Deshabilita el picker completo |
| `placeholder` | `string` | `''` | Texto cuando no hay fecha (default: `"Seleccionar fecha..."`, rango: `"Seleccionar rango..."`) |
| `position` | `"left" \| "right" \| "bottom" \| "top"` | `'bottom'` | `right` |
| `align` | `"center" \| "start" \| "end"` | `'start'` | `end` |
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
| `format` | `string` | `'dd/MM/yyyy'` | Formato de la fecha en el trigger (ver [Formato](#formato)) |
| `dual-calendar` | `boolean` | `false` | Activa el rango a dos meses (dual). **Implica `range`**: aunque `mode` sea `single`, el picker selecciona un rango |
| `clearable` | `boolean` | `true` | Muestra el botón "Limpiar" en el footer del panel |
| `today-button` | `boolean` | `undefined` | Muestra el botón "Hoy" en el footer del panel (default: `true` en `single`, `false` en `range`) |
<!-- /@api:atributos -->

### Eventos

<!-- @api:eventos -->
| Evento | Payload (`e.detail`) | Descripción |
| ------ | ------ | ------ |
| `select` | `Date \| { start: Date \| null; end: Date \| null; }` | — |
| `change` | `Date \| { start: Date \| null; end: Date \| null; } \| null` | — |
| `open` | — | — |
| `close` | — | — |
| `update:modelValue` | `Date \| null` | — |
| `update:startDate` | `Date \| null` | — |
| `update:endDate` | `Date \| null` | — |
<!-- /@api:eventos -->

### Slots

<!-- @api:slots -->
Ninguno.
<!-- /@api:slots -->

### Métodos expuestos

<!-- @api:metodos -->
| Método | Descripción |
| ------ | ------ |
| `open` | Abre, cierra o alterna el panel |
| `close` | — |
| `toggle` | — |
| `getValue` | Devuelve la fecha seleccionada (modo `single`) |
| `setValue` | Selecciona una fecha (string/number/Date) (modo `single`) |
| `getStartDate` | Devuelve la fecha de inicio (modo `range`) |
| `getEndDate` | Devuelve la fecha de fin (modo `range`) |
| `setRange` | Setea el rango (string/number/Date) (modo `range`) |
| `clear` | Limpia la selección (emite `null`) |
| `isOpen` | Indica si el panel está abierto. |
<!-- /@api:metodos -->

## API del componente Vue

### Props

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

### Emits

<!-- @api:emits -->
| Evento | Payload | Descripción |
| ------ | ------ | ------ |
| `select` | `Date \| { start: Date \| null; end: Date \| null; }` | — |
| `close` | — | — |
| `open` | — | — |
| `update:modelValue` | `Date \| null` | — |
| `change` | `Date \| { start: Date \| null; end: Date \| null; } \| null` | — |
| `update:startDate` | `Date \| null` | — |
| `update:endDate` | `Date \| null` | — |
<!-- /@api:emits -->

### Slots

<!-- @api:slots-vue -->
Ninguno.
<!-- /@api:slots-vue -->

### Expose

<!-- @api:expose -->
| Método | Descripción |
| ------ | ------ |
| `open` | Abre el panel. |
| `close` | Cierra el panel. |
| `toggle` | Alterna el panel. |
| `getValue` | Devuelve la fecha seleccionada (modo simple). |
| `setValue` | Setea la fecha seleccionada y emite change (modo simple). |
| `clear` | Limpia la selección. En modo simple cierra el panel; en rango lo deja abierto. |
| `getStartDate` | Devuelve la fecha de inicio (solo con calendario de rango). |
| `getEndDate` | Devuelve la fecha de fin (solo con calendario de rango). |
| `setRange` | Setea el rango completo y emite los cambios (solo con calendario de rango). |
| `isOpen` | Indica si el panel está abierto. |
<!-- /@api:expose -->
