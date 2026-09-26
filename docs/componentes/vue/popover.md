# `Popover`

[← Volver](../README.md)

---

## Uso en Vue

```vue
<script setup lang="ts">
import Popover from "@/components/overlay/Popover.vue";
// props: panelClass
</script>

<template>
  <Popover position="bottom" align="start">
    Popover
  </Popover>
</template>
```

## Props

| Prop | Tipo | Default | Descripción |
|------|------|------|------|
| `position` | `"left" \| "right" \| "bottom" \| "top"` | `"bottom"` |  |
| `align` | `"center" \| "start" \| "end"` | `"start"` |  |
| `offset` | `number` | `4` |  |
| `fixed` | `boolean` | `false` |  |
| `panelWidth` | `string` | `""` |  |
| `disabled` | `boolean` | `false` |  |
| `hover` | `boolean` | `false` |  |
| `hoverDelay` | `number` | `200` |  |
| `role` | `string` | `""` |  |
| `panelClass` | `string \| string[] \| Record<string, boolean>` | `""` |  |

## Emits

| Evento | Payload | Descripción |
|------|------|------|
| `close` | — |  |
| `open` | — |  |

## Slots

| Slot | Descripción |
|------|------|
| `toggle` |  |
| `default` |  |

## Expose

| Método | Descripción |
|------|------|
| `.open()` |  |
| `.close()` |  |
| `.toggle()` |  |
| `.isOpen()` |  |
