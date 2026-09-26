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

| Prop | Tipo | Default | Descripción |
|------|------|------|------|
| `mode` | `"single" \| "range"` | `"single"` | Tipo de calendario: `single` (una fecha) o `range` (inicio + fin). Con `dual-calendar` el tipo es dual (range, 2 meses) |
| `modelValue` | `string \| number \| Date \| null` | `null` | Fecha seleccionada (calendario `single`) |
| `startDate` | `string \| number \| Date \| null` | `null` | Inicio del rango. Solo con calendario de rango (`mode="range"` o `dual-calendar`); en `single` se ignora. En HTML: `start-date="2026-08-01"` |
| `endDate` | `string \| number \| Date \| null` | `null` | Fin del rango. Solo con calendario de rango (`mode="range"` o `dual-calendar`); en `single` se ignora. En HTML: `end-date="2026-08-31"` |
| `min` | `string \| number \| Date \| null` | `null` | Fecha mínima seleccionable |
| `max` | `string \| number \| Date \| null` | `null` | Fecha máxima seleccionable |
| `color` | `"primary" \| "secondary" \| "neutral" \| "success" \| "warning" \| "danger"` | `"neutral"` | Color semántico del trigger y del día seleccionado del calendario interno (se pasa tal cual; `neutral` = neutral, ya no mapea a primary) |
| `variant` | `"outlined" \| "soft" \| "ghost" \| "subtle"` | `"soft"` | Variante del trigger: `outlined`, `soft`, `ghost`, `subtle`. En el calendario interno `ghost` se mapea a `soft` (el calendario ya no tiene ghost) |
| `disabled` | `boolean` | `false` | Deshabilita el picker completo |
| `placeholder` | `string` | `""` | Texto cuando no hay fecha (default: `"Seleccionar fecha..."`, rango: `"Seleccionar rango..."`) |
| `locale` | `string` | `"es"` | Locale del calendario y nombres de mes |
| `weekStart` | `number` | `1` | Primer día de la semana (`0` domingo, `1` lunes) |
| `format` | `string` | `"dd/MM/yyyy"` | Formato de la fecha en el trigger (ver [Formato](#formato)) |
| `yearNavigation` | `string \| boolean` | `false` | Controles de mes del calendario interno: botones `«`/`»` de año |
| `monthFormat` | `"M" \| "MMMM" \| "MMM" \| "MM"` | `"MMMM"` | Formato del mes en el header del calendario interno: `MMMM` (septiembre), `MMM` (sept), `MM` (09) o `M` (9). Un valor no soportado cae a `MMMM` |
| `yearFormat` | `"yyyy" \| "yy"` | `"yyyy"` | Formato del año (badge cuando el mes no es del año actual): `yyyy` (2026) o `yy` (26). Un valor no soportado cae a `yyyy` |
| `disabledWeekdays` | `string \| number[]` | `""` | Días de la semana no seleccionables (`0`=domingo … `6`=sábado). En HTML: `disabled-weekdays="0,6"` |
| `disabledDates` | `string \| (string \| Date)[]` | `""` | Fechas puntuales no seleccionables. En HTML: `disabled-dates="2026-08-15,2026-08-16"` |
| `events` | `CalendarEvent[]` | `[]` | Eventos a señalar con puntos bajo la fecha en el calendario interno (ver [Eventos](../cu-calendar.md#eventos-puntos)). Se asigna como propiedad JS |
| `grid` | `boolean` | `false` | Líneas **interiores** (cuadrícula) entre los días del calendario interno |
| `border` | `boolean` | `false` | **Marco exterior** alrededor de la cuadrícula de días del calendario interno |
| `dualCalendar` | `boolean` | `false` | Activa el rango a dos meses (dual). **Implica `range`**: aunque `mode` sea `single`, el picker selecciona un rango |
| `position` | `"left" \| "right" \| "bottom" \| "top"` | `"bottom"` | `right` |
| `align` | `"center" \| "start" \| "end"` | `"start"` | `end` |
| `fixed` | `boolean` | `false` | Panel en `position: fixed` (útil en contenedores con overflow) |
| `clearable` | `boolean` | `true` | Muestra el botón "Limpiar" en el footer del panel |
| `todayButton` | `boolean` | `"undefined"` | Muestra el botón "Hoy" en el footer del panel (default: `true` en `single`, `false` en `range`) |
| `label` | `string` | `""` | Texto del label sobre el picker |

## Emits

| Evento | Payload | Descripción |
|------|------|------|
| `select` | `Date` | Día clickeado en el calendario (single) o rango completo `{ start, end }` (range) |
| `change` | `null }` | Fecha (single) o `{ start, end }` (range). También al limpiar |
| `open` | — | El panel se abrió |
| `close` | — | El panel se cerró |
| `update:modelValue` | `null` | Cambio de fecha en modo `single` (al seleccionar, ir a "Hoy" o limpiar) |
| `update:startDate` | `null` | Cambia la fecha de inicio (modo `range`) |
| `update:endDate` | `null` | Cambia la fecha de fin (modo `range`) |

> Al limpiar, `change` emite `null` (single) o `{ start: null, end: null }` (range).

## Slots

Ninguno.

## Expose

| Método | Descripción |
|------|------|
| `.open()` | Abre, cierra o alterna el panel |
| `.close()` |  |
| `.toggle()` | Abre/cierra el panel |
| `.getValue()` | Devuelve la fecha seleccionada (modo `single`) |
| `.setValue(value: string \| number \| Date \| null)` | Selecciona una fecha (string/number/Date) (modo `single`) |
| `.getStartDate()` | Devuelve la fecha de inicio (modo `range`) |
| `.getEndDate()` | Devuelve la fecha de fin (modo `range`) |
| `.setRange(start: string \| number \| Date \| null, end: string \| number \| Date \| null)` | Setea el rango (string/number/Date) (modo `range`) |
| `.clear()` | Limpia la selección (emite `null`) |
| `.isOpen()` | Estado del panel |

## Interfaces

### `CalendarEvent`

```ts
interface CalendarEvent {
  date: string | number | Date
  color?: string
}
```
