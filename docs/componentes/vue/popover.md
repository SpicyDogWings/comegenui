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

<!-- @api:props -->
| Prop | Tipo | Default | Descripción |
| ------ | ------ | ------ | ------ |
| `role` | `string` | `""` | — |
| `disabled` | `boolean` | `false` | — |
| `position` | `"left" \| "right" \| "bottom" \| "top"` | `"bottom"` | — |
| `align` | `"center" \| "start" \| "end"` | `"start"` | — |
| `fixed` | `boolean` | `false` | — |
| `hover` | `boolean` | `false` | — |
| `offset` | `number` | `4` | — |
| `panelWidth` | `string` | `""` | — |
| `hoverDelay` | `number` | `200` | — |
| `panelClass` | `string \| string[] \| Record<string, boolean>` | `""` | — |
<!-- /@api:props -->

## Emits

<!-- @api:emits -->
| Evento | Payload | Descripción |
| ------ | ------ | ------ |
| `close` | — | — |
| `open` | — | — |
<!-- /@api:emits -->

## Slots

<!-- @api:slots -->
| Slot | Descripción |
| ------ | ------ |
| `toggle` | — |
| `default` | — |
<!-- /@api:slots -->

## Expose

<!-- @api:expose -->
| Método | Descripción |
| ------ | ------ |
| `open` | — |
| `close` | — |
| `toggle` | — |
| `isOpen` | — |
<!-- /@api:expose -->
