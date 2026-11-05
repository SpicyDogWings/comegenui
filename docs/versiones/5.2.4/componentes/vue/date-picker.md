[← Volver](../README.md)

# `DatePicker`

Selector de fecha: un botón-trigger que abre un **dropdown con un calendario adentro** (no es una lista de items seleccionables, es un box con el calendario). `mode="single"` selecciona una fecha; `mode="range"` (o `dual-calendar`) un rango, con uno o dos meses. Compone `cu-calendar` (single o range) y el `DualCalendar` interno (2 meses en range), y administra los valores de ambos.

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

En HTML plano, cargá el bundle `CuDatePicker` (ver [ficha vanilla](/componentes/cu-date-picker)).

## Colores

`color` tiñe el trigger y el día seleccionado del calendario interno. Los 6 valores son
`primary`, `secondary`, `neutral` (**default**), `success`, `warning` y `danger`.

```vue
<template>
  <DatePicker color="primary" label="primary" model-value="2026-08-11" />
  <DatePicker color="secondary" label="secondary" model-value="2026-08-11" />
  <DatePicker color="neutral" label="neutral" model-value="2026-08-11" />
  <DatePicker color="success" label="success" model-value="2026-08-11" />
  <DatePicker color="warning" label="warning" model-value="2026-08-11" />
  <DatePicker color="danger" label="danger" model-value="2026-08-11" />
</template>
```

## Variantes

`variant` cambia el aspecto del **trigger**: `outlined`, `soft` (**default**), `ghost` y
`subtle`. En el calendario interno `ghost` se mapea a `soft` (el calendario ya no tiene
ghost).

```vue
<template>
  <DatePicker color="primary" variant="outlined" label="outlined" model-value="2026-08-11" />
  <DatePicker color="primary" variant="soft" label="soft" model-value="2026-08-11" />
  <DatePicker color="primary" variant="ghost" label="ghost" model-value="2026-08-11" />
  <DatePicker color="primary" variant="subtle" label="subtle" model-value="2026-08-11" />
</template>
```

## Fecha inicial y límites

`model-value` fija la fecha de arranque (acepta `Date`, timestamp o `"YYYY-MM-DD"`), y `min`
/ `max` acotan qué días se pueden elegir.

```vue
<template>
  <DatePicker model-value="2026-08-11" min="2026-01-01" max="2026-12-31" format="dd/MM/yyyy" />
</template>
```

## Restricciones

Además de `min`/`max`, el calendario interno acepta `disabledWeekdays` (`0`=domingo …
`6`=sábado) y `disabledDates` (fechas puntuales).

```vue
<template>
  <DatePicker
    :min="'2026-01-01'"
    :max="'2026-12-31'"
    :disabled-weekdays="[0, 6]"
    :disabled-dates="['2026-08-15', '2026-08-16']"
    placeholder="Sin fines de semana ni el 15/16 de agosto"
  />
</template>
```

## Modo rango

Con `mode="range"` el picker selecciona un rango: el primer click define el **inicio**, el segundo el **fin** (con swap automático si el fin es anterior). El panel queda abierto entre ambos clicks para ver el resaltado.

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
  />
</template>
```

## Rango dual

`dual-calendar` muestra **dos meses** y, por sí solo, **implica rango**: aunque `mode` quede en
`single`, el picker selecciona un rango. Con `year-navigation` el panel se agranda para los
botones de año.

```vue
<script setup lang="ts">
import DatePicker from "@/components/form/DatePicker.vue";
import { ref } from "vue";

const inicio = ref<Date | null>(null);
const fin = ref<Date | null>(null);
</script>

<template>
  <DatePicker
    dual-calendar
    :year-navigation="true"
    v-model:start-date="inicio"
    v-model:end-date="fin"
    placeholder="Rango a dos meses"
  />
</template>
```

## Formato

`format` define los tokens de la fecha mostrada en el trigger (con `locale`):

| Token | Ejemplo (`es`) |
|-------|----------------|
| `dd` | `11` |
| `MM` | `08` |
| `MMM` | `ago` |
| `MMMM` | `Agosto` |
| `yy` | `26` |
| `yyyy` | `2026` |

`month-format` (`MMMM`/`MMM`/`MM`/`M`) y `year-format` (`yyyy`/`yy`) hacen lo propio en el
header del calendario; `week-start` elige el primer día de la semana (`0` domingo, `1` lunes,
default) y `year-navigation` muestra los botones de año.

```vue
<script setup lang="ts">
import DatePicker from "@/components/form/DatePicker.vue";
import { ref } from "vue";

const fecha = ref<Date | null>(null);
const fechaEn = ref<Date | null>(null);
</script>

<template>
  <DatePicker
    v-model="fecha"
    color="primary"
    variant="outlined"
    label="Con formato"
    format="dd MMM yyyy"
    month-format="MMM"
    year-format="yy"
    :year-navigation="true"
    :week-start="0"
  />
  <DatePicker
    v-model="fechaEn"
    color="success"
    variant="subtle"
    locale="en"
    month-format="MMMM"
    year-format="yyyy"
    placeholder="locale en"
  />
</template>
```

## Valor formateado (`value-format`)

`format` es solo lo que se **muestra**. Con `value-format`, además de los eventos con `Date` el picker emite los `*-formatted` (`update:formattedValue`, `change-formatted`, `select-formatted`) y expone `getFormattedValue()`/`getFormattedStartDate()`/`getFormattedEndDate()`:

```vue
<script setup lang="ts">
import DatePicker from "@/components/form/DatePicker.vue";
import { ref } from "vue";

const fecha = ref<string | null>(null);

function onFormatted(value: unknown) {
  fecha.value = typeof value === "string" ? value : null;
}
</script>

<template>
  <DatePicker value-format="dd-MM-yyyy" @change-formatted="onFormatted" />
</template>
```

## Eventos y grilla

`events` pinta puntos bajo las fechas (array de `{ date, color? }`); `grid` dibuja las líneas
interiores y `border` el marco exterior de la cuadrícula.

```vue
<script setup lang="ts">
import DatePicker from "@/components/form/DatePicker.vue";
import { ref } from "vue";

const fecha = ref<Date | null>(null);

const hoy = new Date();
function iso(offset: number) {
  const d = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate() + offset);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

const eventos = [
  { date: iso(2), color: "primary" },
  { date: iso(5), color: "danger" },
];
</script>

<template>
  <DatePicker
    v-model="fecha"
    :events="eventos"
    :grid="true"
    :border="true"
    placeholder="Con eventos y grilla"
  />
</template>
```

## Label

El label se muestra sobre el picker y es clickeable — hace foco en el trigger (el botón que abre el
panel) y abre el panel:

```vue
<template>
  <DatePicker label="Fecha de nacimiento" />
</template>
```

## Posición del panel

`position` (`bottom` default, `top`, `left`, `right`), `align` (`start` default, `center`,
`end`) y `fixed` (panel en `position: fixed`, útil en contenedores con overflow) controlan
dónde y cómo se abre el panel.

```vue
<template>
  <DatePicker position="bottom" align="start" placeholder="bottom / start" />
  <DatePicker position="top" align="end" placeholder="top / end" />
  <DatePicker position="left" align="center" placeholder="left / center" />
  <DatePicker position="right" align="start" :fixed="true" placeholder="right / start / fixed" />
</template>
```

## Estados y footer

`disabled` deja el picker inerte. El footer trae "Hoy" y "Limpiar": `today-button` y
`clearable` (ambos con default `true` en `single`) los prenden o apagan.

```vue
<template>
  <DatePicker disabled model-value="2026-08-11" placeholder="disabled" />
  <DatePicker :clearable="false" :today-button="false" placeholder="Sin Hoy ni Limpiar" />
</template>
```

## Control programático

```vue
<script setup lang="ts">
import DatePicker from "@/components/form/DatePicker.vue";
import { ref, useTemplateRef } from "vue";

const single = useTemplateRef("single");
const range = useTemplateRef("range");
const singleModel = ref<Date | null>(null);
const rStart = ref<Date | null>(null);
const rEnd = ref<Date | null>(null);

function demo() {
  single.value?.open();
  single.value?.close();
  single.value?.toggle();
  single.value?.getValue(); // Date | null
  single.value?.setValue("2026-12-24"); // selecciona y emite change
  single.value?.clear(); // limpia (emite null)

  range.value?.setRange("2026-12-01", "2026-12-31");
  range.value?.getStartDate();
  range.value?.getEndDate();
}
</script>

<template>
  <DatePicker ref="single" v-model="singleModel" placeholder="Instancia single" />
  <DatePicker
    ref="range"
    mode="range"
    v-model:start-date="rStart"
    v-model:end-date="rEnd"
    placeholder="Instancia range"
  />
</template>
```

## Comportamiento

- **Trigger:** botón con ícono de calendario + fecha formateada (o placeholder) + chevron que rota al abrir. Expone `aria-haspopup="dialog"` y `aria-expanded` según el panel; con `label`, su nombre accesible es `"<label>: <valor>"`.
- **Panel:** box con el calendario adentro (ancho ~280px, o ~330px cuando `year-navigation` está activo — el header con botones de año necesita más espacio) y footer con "Hoy" y "Limpiar" (configurables con `today-button` y `clearable`). En `mode="range"` con `dual-calendar` el panel mide ~580px (o ~700px con year-navigation) y muestra dos meses. El panel se anuncia como `role="dialog"` (adentro hay un grid, no menuitems).
- **Mes inicial:** en `single` abre en el mes de `model-value`; en `range` en el mes de `start-date` (o `end-date` si no hay inicio). Sin valor, el mes actual. Con `dual-calendar` los dos meses se recortan a `min`/`max`.
- **Fuera del rango:** los días deshabilitados no se pueden elegir; "Hoy" y la selección manual respetan `min`/`max` del calendario. Si hoy queda fuera de `min`/`max` (o cae en un día deshabilitado), el botón "Hoy" aparece deshabilitado y no emite nada.
- **Cierre:** al elegir un día en `single`, ir a "Hoy" o limpiar, el panel se cierra. En `range` queda abierto entre el primer y el segundo click para ver el resaltado. También cierra con click afuera o `Escape` (lo maneja el dropdown interno).
- **Foco:** al cerrarse el panel, si el foco estaba adentro (un día, "Hoy", "Limpiar") vuelve al trigger; `Escape` también deja el foco en el trigger.
- **Teclado:** el calendario interno se maneja con flechas, `Home`/`End` y `PageUp`/`PageDown` (ver [teclado y accesibilidad de `Calendar`](calendar.md#teclado-y-accesibilidad)).

## Nota de implementación

`<cu-date-picker>` **compone** el `Dropdown.vue` genérico (slot `#toggle` con el botón-trigger + slot `#default` con el calendario). En `single` usa `cu-calendar`; en `range` usa `cu-calendar mode="range"` (un mes) o el `DualCalendar` interno (dos meses, navegación independiente). El DatePicker espeja los valores de sus hijos y re-emite la API pública (`start-date`/`end-date`, `setRange`, etc.). No requiere modificar el componente de dropdown.

## Props

<!--@include: ../../partials/date-picker/props-vue.md-->

## Emits

<!--@include: ../../partials/date-picker/eventos-vue.md-->

> Al limpiar, `change` emite `null` (single) o `{ start: null, end: null }` (range).

## Slots

<!--@include: ../../partials/date-picker/slots.md-->

## Expose

<!--@include: ../../partials/date-picker/metodos-vue.md-->

## Interfaces

### `CalendarEvent`

```ts
interface CalendarEvent {
  date: string | number | Date
  color?: string
}
```
