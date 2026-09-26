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

| Prop | Tipo | Default | Descripción |
|------|------|------|------|
| `startDate` | `string \| number \| Date \| null` | `null` |  |
| `endDate` | `string \| number \| Date \| null` | `null` |  |
| `min` | `string \| number \| Date \| null` | `null` |  |
| `max` | `string \| number \| Date \| null` | `null` |  |
| `color` | `"primary" \| "secondary" \| "neutral" \| "success" \| "warning" \| "danger"` | `"neutral"` |  |
| `variant` | `"solid" \| "outlined" \| "soft" \| "subtle"` | `"soft"` |  |
| `disabled` | `boolean` | `false` |  |
| `locale` | `string` | `"es"` |  |
| `weekStart` | `number` | `1` |  |
| `yearNavigation` | `string \| boolean` | `false` |  |
| `monthFormat` | `"M" \| "MMMM" \| "MMM" \| "MM"` | `"MMMM"` | Formato del mes en el header: `MMMM` (septiembre), `MMM` (sept), `MM` (09) o `M` (9). Un valor no soportado cae a `MMMM` |
| `yearFormat` | `"yyyy" \| "yy"` | `"yyyy"` | Formato del año (badge cuando el mes no es del año actual): `yyyy` (2026) o `yy` (26). Un valor no soportado cae a `yyyy` |
| `disabledWeekdays` | `string \| number[]` | `""` |  |
| `disabledDates` | `string \| (string \| Date)[]` | `""` |  |
| `events` | `CalendarEvent[]` | `[]` |  |
| `grid` | `boolean` | `false` |  |
| `border` | `boolean` | `false` |  |

## Emits

| Evento | Payload | Descripción |
|------|------|------|
| `select` | `value: DateRange` |  |
| `change` | `value: DateRange` |  |
| `update:startDate` | `value: Date \| null` |  |
| `update:endDate` | `value: Date \| null` |  |

## Slots

Ninguno.

## Expose

| Método | Descripción |
|------|------|
| `.getStartDate()` | Devuelve la fecha de inicio del rango. |
| `.getEndDate()` | Devuelve la fecha de fin del rango. |
| `.setRange(start: string \| number \| Date \| null, end: string \| number \| Date \| null)` | Setea el rango completo y emite los cambios. |
| `.clear()` | Limpia el rango. |
