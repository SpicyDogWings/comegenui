# `YearSlider`

[← Volver](../README.md)

---

## Uso en Vue

```vue
<script setup lang="ts">
import YearSlider from "@/components/controls/YearSlider.vue";
import { ref } from "vue";

const value = ref("");
</script>

<template>
  <YearSlider v-model="value" variant="soft" color="primary">
    YearSlider
  </YearSlider>
</template>
```

## Props

| Prop | Tipo | Default | Descripción |
|------|------|------|------|
| `modelValue` | `string \| number \| null` | `null` |  |
| `variant` | `"solid" \| "outlined" \| "soft" \| "ghost" \| "subtle"` | `"soft"` |  |
| `min` | `string \| number \| null` | `null` |  |
| `max` | `string \| number \| null` | `null` |  |
| `color` | `"primary" \| "secondary" \| "neutral" \| "success" \| "warning" \| "danger"` | `"primary"` |  |
| `disabled` | `boolean` | `false` |  |

## Emits

| Evento | Payload | Descripción |
|------|------|------|
| `update:modelValue` | `value: number` |  |
| `change` | `value: number` |  |

## Slots

Ninguno.

## Expose

| Método | Descripción |
|------|------|
| `.nextYear()` | Avanza al año siguiente (respetando max). |
| `.prevYear()` | Retrocede al año anterior (respetando min). |
| `.goToYear(value: string \| number)` | Navega al año indicado. |
| `.getValue()` | Devuelve el año actual. |
| `.setValue(value: string \| number \| null)` | Establece el año desde un número o string. |
