# `MonthSlider`

[← Volver](../README.md)

---

## Uso en Vue

```vue
<script setup lang="ts">
import MonthSlider from "@/components/controls/MonthSlider.vue";
import { ref } from "vue";

const value = ref("");
</script>

<template>
  <MonthSlider v-model="value" variant="soft" color="primary">
    MonthSlider
  </MonthSlider>
</template>
```

## Props

| Prop | Tipo | Default | Descripción |
|------|------|------|------|
| `modelValue` | `string \| number \| Date \| null` | `null` |  |
| `monthFormat` | `"M" \| "MMMM" \| "MMM" \| "MM"` | `"MMMM"` | Formato del mes: `MMMM` (septiembre), `MMM` (sept), `MM` (09) o `M` (9). Un valor no soportado cae a `MMMM` |
| `yearFormat` | `"yyyy" \| "yy"` | `"yyyy"` | Formato del año (badge cuando el mes no es del año actual): `yyyy` (2026) o `yy` (26). Un valor no soportado cae a `yyyy` |
| `locale` | `string` | `"es"` |  |
| `yearNavigation` | `string \| boolean` | `true` |  |
| `variant` | `"solid" \| "outlined" \| "soft" \| "ghost" \| "subtle"` | `"soft"` |  |
| `min` | `string \| number \| Date \| null` | `null` |  |
| `max` | `string \| number \| Date \| null` | `null` |  |
| `color` | `"primary" \| "secondary" \| "neutral" \| "success" \| "warning" \| "danger"` | `"primary"` |  |
| `disabled` | `boolean` | `false` |  |

## Emits

| Evento | Payload | Descripción |
|------|------|------|
| `update:modelValue` | `value: Date` |  |
| `change` | `value: Date` |  |

## Slots

Ninguno.

## Expose

| Método | Descripción |
|------|------|
| `.nextMonth()` | Avanza un mes (respetando max). |
| `.prevMonth()` | Retrocede un mes (respetando min). |
| `.nextYear()` | Avanza un año manteniendo el mes. |
| `.prevYear()` | Retrocede un año manteniendo el mes. |
| `.goToMonth(value: string \| number \| Date)` | Navega al mes de la fecha indicada. |
| `.getValue()` | Devuelve el mes visible. |
| `.setValue(value: string \| number \| Date \| null)` | Establece el mes desde una fecha, timestamp o string. |
