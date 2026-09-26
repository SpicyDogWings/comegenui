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

<!-- @api:props -->
| Prop | Tipo | Default | Descripción |
| ------ | ------ | ------ | ------ |
| `color` | `"primary" \| "secondary" \| "neutral" \| "success" \| "warning" \| "danger"` | `'primary'` | — |
| `variant` | `"solid" \| "outlined" \| "soft" \| "ghost" \| "subtle"` | `'soft'` | — |
| `disabled` | `boolean` | `false` | — |
| `modelValue` | `string \| number \| Date \| null` | `null` | — |
| `min` | `string \| number \| Date \| null` | `null` | — |
| `max` | `string \| number \| Date \| null` | `null` | — |
| `locale` | `string` | `'es'` | — |
| `yearNavigation` | `string \| boolean` | `true` | — |
| `monthFormat` | `"M" \| "MMMM" \| "MMM" \| "MM"` | `'MMMM'` | Formato del mes: `MMMM` (septiembre), `MMM` (sept), `MM` (09) o `M` (9). Un valor no soportado cae a `MMMM` |
| `yearFormat` | `"yyyy" \| "yy"` | `'yyyy'` | Formato del año (badge cuando el mes no es del año actual): `yyyy` (2026) o `yy` (26). Un valor no soportado cae a `yyyy` |
<!-- /@api:props -->

## Emits

<!-- @api:emits -->
| Evento | Payload | Descripción |
| ------ | ------ | ------ |
| `update:modelValue` | `Date` | — |
| `change` | `Date` | — |
<!-- /@api:emits -->

## Slots

<!-- @api:slots -->
Ninguno.
<!-- /@api:slots -->

## Expose

<!-- @api:expose -->
| Método | Descripción |
| ------ | ------ |
| `nextMonth` | — |
| `prevMonth` | — |
| `nextYear` | — |
| `prevYear` | — |
| `goToMonth` | — |
| `getValue` | — |
| `setValue` | — |
<!-- /@api:expose -->
