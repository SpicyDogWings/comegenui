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

<!-- @api:props -->
| Prop | Tipo | Default | Descripción |
| ------ | ------ | ------ | ------ |
| `color` | `"primary" \| "secondary" \| "neutral" \| "success" \| "warning" \| "danger"` | `'primary'` | — |
| `variant` | `"solid" \| "outlined" \| "soft" \| "ghost" \| "subtle"` | `'soft'` | — |
| `disabled` | `boolean` | `false` | — |
| `modelValue` | `string \| number \| null` | `null` | — |
| `min` | `string \| number \| null` | `null` | — |
| `max` | `string \| number \| null` | `null` | — |
<!-- /@api:props -->

## Emits

<!-- @api:emits -->
| Evento | Payload | Descripción |
| ------ | ------ | ------ |
| `update:modelValue` | `number` | — |
| `change` | `number` | — |
<!-- /@api:emits -->

## Slots

<!-- @api:slots -->
Ninguno.
<!-- /@api:slots -->

## Expose

<!-- @api:expose -->
| Método | Descripción |
| ------ | ------ |
| `nextYear` | Avanza al año siguiente (respetando max). |
| `prevYear` | Retrocede al año anterior (respetando min). |
| `goToYear` | Navega al año indicado. |
| `getValue` | Devuelve el año actual. |
| `setValue` | Establece el año desde un número o string. |
<!-- /@api:expose -->
