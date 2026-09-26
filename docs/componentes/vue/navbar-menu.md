# `NavbarMenu`

[← Volver](../README.md)

---

## Uso en Vue

```vue
<script setup lang="ts">
import NavbarMenu from "@/components/navigation/NavbarMenu.vue";
// props: items
</script>

<template>
  <NavbarMenu trigger="click">
    NavbarMenu
  </NavbarMenu>
</template>
```

## Props

<!-- @api:props -->
| Prop | Tipo | Default | Descripción |
| ------ | ------ | ------ | ------ |
| `trigger` | `"click" \| "hover"` | `'click'` | Disparador de los submenús: click o hover. |
| `items` | `NavItem[]` | `—` | Items del nivel de menú. |
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
