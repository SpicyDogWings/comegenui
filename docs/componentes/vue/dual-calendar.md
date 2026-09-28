# `DualCalendar`

[← Volver](../README.md)

---

## Uso en Vue

```vue
<script setup lang="ts">
import DualCalendar from "@/components/controls/DualCalendar.vue";
// props: disabledWeekdays, disabledDates, events
</script>

<template>
  <DualCalendar color="neutral" variant="soft" monthFormat="MMMM" yearFormat="yyyy">
    DualCalendar
  </DualCalendar>
</template>
```

## Props

<!-- @api:props -->
| Prop | Tipo | Default | Descripción |
| ------ | ------ | ------ | ------ |
| `color` | `"primary" \| "secondary" \| "neutral" \| "success" \| "warning" \| "danger"` | `'neutral'` | — |
| `variant` | `"solid" \| "outlined" \| "soft" \| "subtle"` | `'soft'` | — |
| `disabled` | `boolean` | `false` | — |
| `min` | `string \| number \| Date \| null` | `null` | — |
| `max` | `string \| number \| Date \| null` | `null` | — |
| `disabledWeekdays` | `string \| number[]` | `''` | — |
| `disabledDates` | `string \| (string \| Date)[]` | `''` | — |
| `locale` | `string` | `'es'` | — |
| `weekStart` | `number` | `1` | — |
| `yearNavigation` | `string \| boolean` | `false` | — |
| `monthFormat` | `"M" \| "MMMM" \| "MMM" \| "MM"` | `'MMMM'` | Formato del mes en el header: `MMMM` (septiembre), `MMM` (sept), `MM` (09) o `M` (9). Un valor no soportado cae a `MMMM` |
| `yearFormat` | `"yyyy" \| "yy"` | `'yyyy'` | Formato del año (badge cuando el mes no es del año actual): `yyyy` (2026) o `yy` (26). Un valor no soportado cae a `yyyy` |
| `events` | `CalendarEvent[]` | `[]` | — |
| `grid` | `boolean` | `false` | — |
| `border` | `boolean` | `false` | — |
| `startDate` | `string \| number \| Date \| null` | `null` | — |
| `endDate` | `string \| number \| Date \| null` | `null` | — |
<!-- /@api:props -->

## Emits

<!-- @api:emits -->
| Evento | Payload | Descripción |
| ------ | ------ | ------ |
| `select` | `DateRange` | — |
| `change` | `DateRange` | — |
| `update:startDate` | `Date \| null` | — |
| `update:endDate` | `Date \| null` | — |
<!-- /@api:emits -->

## Slots

<!-- @api:slots -->
Ninguno.
<!-- /@api:slots -->

## Expose

<!-- @api:expose -->
| Método | Descripción |
| ------ | ------ |
| `getStartDate` | Devuelve la fecha de inicio del rango. |
| `getEndDate` | Devuelve la fecha de fin del rango. |
| `setRange` | Setea el rango completo y emite los cambios. |
| `clear` | Limpia el rango. |
<!-- /@api:expose -->
