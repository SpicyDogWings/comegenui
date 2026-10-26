[← Volver](../README.md)

# `DualCalendar`

Dos calendarios en modo rango, con meses consecutivos y navegación independiente. El rango se elige con dos clicks (el primero abre el rango, el segundo lo completa) y se comparte entre los dos paneles. Es la versión interna que usa `<DatePicker>` con `dual`.

## Uso en Vue

```vue
<script setup lang="ts">
import DualCalendar from "@/components/controls/DualCalendar.vue";
import { ref } from "vue";

const inicio = ref<Date | null>(new Date(2026, 8, 5));
const fin = ref<Date | null>(new Date(2026, 8, 20));
</script>

<template>
  <DualCalendar v-model:start-date="inicio" v-model:end-date="fin" color="primary" />
</template>
```

## Colores

`color` resuelve el acento del rango y del día seleccionado con los 6 nombres semánticos del tema activo.

```vue
<DualCalendar color="primary" />
<DualCalendar color="secondary" />
<DualCalendar color="neutral" />
<DualCalendar color="success" />
<DualCalendar color="warning" />
<DualCalendar color="danger" />
```

## Variantes

`variant` decide el relleno del encabezado y del día seleccionado con las 4 variantes de calendario; `soft` es la default.

```vue
<DualCalendar variant="solid" />
<DualCalendar variant="outlined" />
<DualCalendar variant="soft" />
<DualCalendar variant="subtle" />
```

## Navegación y formatos

`yearNavigation` agrega el badge clicable para saltar de año; `monthFormat` controla el mes del header (`MMMM`, `MMM`, `MM` o `M`) y `yearFormat` el año del badge (`yyyy` o `yy`). Un valor no soportado cae a `MMMM`/`yyyy`.

```vue
<DualCalendar year-navigation month-format="MMMM" year-format="yyyy" />
<DualCalendar year-navigation month-format="MMM" year-format="yy" />
<DualCalendar year-navigation month-format="MM" year-format="yyyy" />
<DualCalendar year-navigation month-format="M" year-format="yy" />
```

## Grilla y borde

`grid` dibuja las líneas de la grilla de días y `border` agrega el borde del contenedor; los dos son `false` por defecto.

```vue
<DualCalendar grid />
<DualCalendar border />
<DualCalendar grid border />
```

## Idioma y semana

`locale` (default `"es"`) define el idioma de los nombres de mes y día; `weekStart` (0 a 6, default `1` = lunes) define con qué día arranca la semana.

```vue
<DualCalendar locale="es" :week-start="1" />
<DualCalendar locale="en" :week-start="0" />
```

## Rango

`startDate` y `endDate` son el rango; con `v-model:start-date` / `v-model:end-date` el componente emite `update:startDate` y `update:endDate` en cada click, además de `select` y `change` con `{ start, end }`.

```vue
<script setup lang="ts">
import { ref } from "vue";
import DualCalendar from "@/components/controls/DualCalendar.vue";

const inicio = ref<Date | null>(null);
const fin = ref<Date | null>(null);
</script>

<template>
  <DualCalendar
    v-model:start-date="inicio"
    v-model:end-date="fin"
    color="primary"
    @select="(value) => console.log('select', value)"
    @change="(value) => console.log('change', value)"
  />
  <pre class="cu-demo-output">{{ inicio }} → {{ fin }}</pre>
</template>
```

## Días y rangos bloqueados

`min` y `max` acotan el rango navegable, `disabledWeekdays` bloquea días de la semana (array de 0 a 6, o `"0,6"`) y `disabledDates` bloquea fechas puntuales; `disabled` desactiva el calendario entero.

```vue
<DualCalendar min="2026-09-01" max="2026-09-30" />
<DualCalendar :disabled-weekdays="[0, 6]" />
<DualCalendar :disabled-dates="['2026-09-15', '2026-09-16']" />
<DualCalendar disabled />
```

## Eventos destacados

`events` es un array de `CalendarEvent` (`{ date, color }`) y marca esos días con un punto del color indicado.

```vue
<script setup lang="ts">
const events = [
  { date: "2026-09-08", color: "primary" },
  { date: "2026-09-18", color: "danger" },
];
</script>

<template>
  <DualCalendar :events="events" />
</template>
```

## API programática

`getStartDate()` y `getEndDate()` devuelven el rango actual, `setRange(start, end)` lo fija y emite los cambios, y `clear()` lo limpia.

```vue
<script setup lang="ts">
import { ref } from "vue";
import DualCalendar from "@/components/controls/DualCalendar.vue";

const dual = ref<InstanceType<typeof DualCalendar> | null>(null);

function setRange() {
  dual.value?.setRange("2026-09-05", "2026-09-20");
  console.log(dual.value?.getStartDate(), dual.value?.getEndDate());
  dual.value?.clear();
}
</script>

<template>
  <DualCalendar ref="dual" color="primary" />
  <Button size="sm" variant="outlined" @click="setRange">setRange()</Button>
</template>
```

> Es un componente interno: no se registra como custom element ni se publica en la lib. Lo consumen `<DatePicker>` (con `dual`) y el playground.

## Props

<!--@include: ../../partials/dual-calendar/props.md-->

## Emits

<!--@include: ../../partials/dual-calendar/eventos.md-->

## Slots

<!--@include: ../../partials/dual-calendar/slots.md-->

## Expose

<!--@include: ../../partials/dual-calendar/metodos.md-->
