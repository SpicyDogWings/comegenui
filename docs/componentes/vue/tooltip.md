# `Tooltip`

Tooltip que aparece al hacer hover sobre el elemento contenido, con posición, alineación, offset y delay configurables.

[← Volver](../README.md)

---

## Uso en Vue

```vue
<script setup lang="ts">
import Tooltip from "@/components/overlay/Tooltip.vue";
import Button from "@/components/buttons/Button.vue";
</script>

<template>
  <Tooltip text="Guardar cambios" color="primary">
    <Button color="primary" variant="soft">Guardar</Button>
  </Tooltip>
</template>
```

## Posición y contenido custom

```vue
<template>
  <Tooltip text="Texto simple" position="bottom" />

  <Tooltip position="right" align="start" :delay="300">
    <span>Elemento con tooltip rico</span>
    <template #content>
      <strong>Más contexto</strong> con HTML
    </template>
  </Tooltip>
</template>
```

---

## Props

<!-- @api:props -->
| Prop | Tipo | Default | Descripción |
| ------ | ------ | ------ | ------ |
| `color` | `"primary" \| "secondary" \| "neutral" \| "success" \| "warning" \| "danger"` | `"neutral"` | — |
| `disabled` | `boolean` | `false` | — |
| `position` | `"bottom" \| "top" \| "left" \| "right"` | `"top"` | — |
| `align` | `"start" \| "center" \| "end"` | `"center"` | — |
| `offset` | `number` | `6` | — |
| `delay` | `number` | `200` | — |
| `text` | `string` | `""` | — |
<!-- /@api:props -->

## Emits

<!-- @api:emits -->
Ninguno.
<!-- /@api:emits -->

## Slots

<!-- @api:slots -->
| Slot | Descripción |
| ------ | ------ |
| `default` | — |
| `content` | — |
<!-- /@api:slots -->

## Expose

<!-- @api:expose -->
No expone métodos.
<!-- /@api:expose -->
