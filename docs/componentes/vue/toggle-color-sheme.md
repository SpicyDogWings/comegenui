# `ToggleColorSheme`

[← Volver](../README.md)

---

## Uso en Vue

```vue
<script setup lang="ts">
import ToggleColorSheme from "@/components/buttons/ToggleColorSheme.vue";
</script>

<template>
  <ToggleColorSheme variant="ghost">
    ToggleColorSheme
  </ToggleColorSheme>
</template>
```

## Props

<!-- @api:props -->
| Prop | Tipo | Default | Descripción |
| ------ | ------ | ------ | ------ |
| `variant` | `"solid" \| "outlined" \| "soft" \| "ghost" \| "subtle" \| "link" \| "none"` | `'ghost'` | Variante visual del botón. |
| `size` | `number` | `20` | Tamaño en px del ícono (ancho y alto). |
<!-- /@api:props -->

## Emits

<!-- @api:emits -->
Ninguno.
<!-- /@api:emits -->

## Slots

<!-- @api:slots -->
Ninguno.
<!-- /@api:slots -->

## Expose

<!-- @api:expose -->
No expone métodos.
<!-- /@api:expose -->
