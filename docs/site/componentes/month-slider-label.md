---
title: MonthSliderLabel
group: Controles
---

# `MonthSliderLabel`

## Uso en Vue

```vue
<script setup lang="ts">
import MonthSliderLabel from "@/components/controls/month-slider/MonthSliderLabel.vue";
</script>

<template>
  <MonthSliderLabel label="…" draggable color="primary" variant="soft" canNavigatePrev canNavigateNext>
    MonthSliderLabel
  </MonthSliderLabel>
</template>
```

## Props

| Prop | Tipo | Default | Descripción |
|------|------|------|------|
| `label` | `string` | — | Texto principal del label (mes o año). |
| `year` | `string` | `""` | Texto del año mostrado como badge al lado del label. |
| `disabled` | `boolean` | `false` | Deshabilita la interacción del label. |
| `draggable` | `boolean` | `true` |  |
| `color` | `"primary" \| "secondary" \| "neutral" \| "success" \| "warning" \| "danger"` | `"primary"` | Color semántico del label. |
| `variant` | `"solid" \| "outlined" \| "soft" \| "ghost" \| "subtle"` | `"soft"` | Variante visual del label. |
| `threshold` | `number` | `96` |  |
| `steps` | `number` | `1` |  |
| `canNavigatePrev` | `boolean` | `true` |  |
| `canNavigateNext` | `boolean` | `true` | Indica si se puede navegar al paso siguiente. |

## Eventos

| Evento | Payload | Descripción |
|------|------|------|
| `navigate` | `direction: number` |  |

## Slots

Ninguno.

## Métodos expuestos

Ninguno.
