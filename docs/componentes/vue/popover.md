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
| `disabled` | `boolean` | `false` | — |
| `position` | `"bottom" \| "top" \| "left" \| "right"` | `"bottom"` | — |
| `align` | `"start" \| "center" \| "end"` | `"start"` | — |
| `offset` | `number` | `4` | — |
| `fixed` | `boolean` | `false` | — |
| `hover` | `boolean` | `false` | — |
| `panelWidth` | `string` | `""` | — |
| `hoverDelay` | `number` | `200` | — |
| `role` | `string` | `""` | — |
| `panelClass` | `string \| string[] \| Record<string, boolean>` | `""` | — |
<!-- /@api:props -->

## Emits

<!-- @api:emits -->
| Evento | Payload | Descripción |
| ------ | ------ | ------ |
| `open` | `any[` | — |
| `close` | `any[` | — |
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
