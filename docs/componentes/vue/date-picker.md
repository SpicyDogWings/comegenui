# `DatePicker`

Selector de fecha: un botón-trigger que abre un **dropdown con un calendario adentro** (no es una lista de items seleccionables, es un box con el calendario). `mode="single"` selecciona una fecha; `mode="range"` (o `dual-calendar`) un rango, con uno o dos meses. Compone `cu-calendar` (single o range) y el `DualCalendar` interno (2 meses en range), y administra los valores de ambos.

[← Volver](../README.md)

---

## Formato

Tokens soportados en `format` (con `locale`):

| Token | Ejemplo (`es`) |
|-------|----------------|
| `dd` | `11` |
| `MM` | `08` |
| `MMM` | `ago` |
| `MMMM` | `Agosto` |
| `yy` | `26` |
| `yyyy` | `2026` |

```vue
<script setup lang="ts">
import { ref } from "vue";

const format = ref("MMMM yyyy"); // "Agosto 2026"
format.value = "dd-MM-yy"; // "11-08-26"
</script>
```

## Uso en Vue

```vue
<script setup lang="ts">
import DatePicker from "@/components/form/DatePicker.vue";
import { ref } from "vue";

const fecha = ref<Date | null>(null);

function onChange(d: Date | null) {
  console.log(d ? d.toISOString().slice(0, 10) : "— sin fecha");
}
</script>

<template>
  <DatePicker v-model="fecha" placeholder="Elegí una fecha" @change="onChange" />
</template>
```

## Con fecha inicial y límites

```vue
<template>
  <DatePicker model-value="2026-08-11" min="2026-01-01" max="2026-12-31" format="dd/MM/yyyy" />
</template>
```

## Con label

El label se muestra sobre el picker y es clickeable — hace foco en el input y abre el panel:

```vue
<template>
  <DatePicker label="Fecha de nacimiento" />
</template>
```

## Modo rango

```vue
<script setup lang="ts">
import DatePicker from "@/components/form/DatePicker.vue";
import { ref } from "vue";

const startDate = ref("2026-09-03");
const endDate = ref("2026-09-15");
</script>

<template>
  <DatePicker
    mode="range"
    v-model:startDate="startDate"
    v-model:endDate="endDate"
    label="Período"
    dual-calendar
  />
</template>
```

## Control programático (range)

```js
picker.setRange('2026-09-01', '2026-09-30');
picker.getStartDate(); // "2026-09-01"
picker.getEndDate();   // "2026-09-30"
picker.clear();
```

## Comportamiento

- **Trigger:** botón con ícono de calendario + fecha formateada (o placeholder) + chevron que rota al abrir.
- **Panel:** box con el calendario adentro (ancho ~280px, o ~330px cuando `year-navigation` está activo — el header con botones de año necesita más espacio) y footer con "Hoy" y "Limpiar" (configurables con `today-button` y `clearable`). En `mode="range"` con `dual-calendar` el panel mide ~580px (o ~700px con year-navigation) y muestra dos meses.
- **Fuera del rango:** los días deshabilitados no se pueden elegir; "Hoy" y la selección manual respetan `min`/`max` del calendario.
- **Cierre:** al elegir un día en `single`, ir a "Hoy" o limpiar, el panel se cierra. En `range` queda abierto entre el primer y el segundo click para ver el resaltado. También cierra con click afuera o `Escape` (lo maneja el dropdown interno).

## Nota de implementación

`<cu-date-picker>` **compone** el `Dropdown.vue` genérico (slot `#toggle` con el botón-trigger + slot `#default` con el calendario). En `single` usa `cu-calendar`; en `range` usa `cu-calendar mode="range"` (un mes) o el `DualCalendar` interno (dos meses, navegación independiente). El DatePicker espeja los valores de sus hijos y re-emite la API pública (`start-date`/`end-date`, `setRange`, etc.). No requiere modificar el componente de dropdown.

---

## Props

<!-- @api:props -->
| Prop | Tipo | Default | Descripción |
| ------ | ------ | ------ | ------ |
| `color` | `"primary" \| "secondary" \| "neutral" \| "success" \| "warning" \| "danger"` | `'neutral'` | — |
| `variant` | `"outlined" \| "soft" \| "ghost" \| "subtle"` | `'soft'` | — |
| `disabled` | `boolean` | `false` | — |
| `modelValue` | `string \| number \| Date \| null` | `null` | Fecha seleccionada (calendario `single`) |
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
| `mode` | `"single" \| "range"` | `'single'` | Tipo de calendario: `single` (una fecha, `Calendar`) o `range` (inicio + fin, `Calendar` en modo rango). Con `dualCalendar` el tipo es dual (range, 2 meses) |
| `label` | `string` | `''` | — |
| `position` | `"bottom" \| "top" \| "left" \| "right"` | `'bottom'` | — |
| `align` | `"start" \| "center" \| "end"` | `'start'` | — |
| `fixed` | `boolean` | `false` | — |
| `placeholder` | `string` | `''` | — |
| `startDate` | `string \| number \| Date \| null` | `null` | Inicio del rango. Solo con calendario de rango (`mode="range"` o `dualCalendar`); en `single` se ignora |
| `endDate` | `string \| number \| Date \| null` | `null` | Fin del rango. Solo con calendario de rango (`mode="range"` o `dualCalendar`); en `single` se ignora |
| `format` | `string` | `'dd/MM/yyyy'` | — |
| `dualCalendar` | `boolean` | `false` | Activa el rango a dos meses (dual). **Implica `range`**: aunque `mode` sea `single`, el picker selecciona un rango |
| `clearable` | `boolean` | `true` | — |
| `todayButton` | `boolean` | `undefined` | — |
<!-- /@api:props -->

## Emits

<!-- @api:emits -->
| Evento | Payload | Descripción |
| ------ | ------ | ------ |
| `update:modelValue` | `Date \\| null` | — |
| `change` | `Date \\| { start: Date \\| null; end: Date \\| null; } \\| null` | — |
| `select` | `Date \\| { start: Date \\| null; end: Date \\| null; }` | — |
| `open` | `` | — |
| `close` | `` | — |
| `update:startDate` | `Date \\| null` | — |
| `update:endDate` | `Date \\| null` | — |
<!-- /@api:emits -->

> Al limpiar, `change` emite `null` (single) o `{ start: null, end: null }` (range).

## Slots

<!-- @api:slots -->
Ninguno.
<!-- /@api:slots -->

## Expose

<!-- @api:expose -->
| Método | Descripción |
| ------ | ------ |
| `open` | — |
| `close` | — |
| `toggle` | — |
| `getValue` | — |
| `setValue` | — |
| `clear` | — |
| `getStartDate` | — |
| `getEndDate` | — |
| `setRange` | — |
| `isOpen` | Indica si el panel está abierto. |
<!-- /@api:expose -->

## Interfaces

### `CalendarEvent`

```ts
interface CalendarEvent {
  date: string | number | Date
  color?: string
}
```
