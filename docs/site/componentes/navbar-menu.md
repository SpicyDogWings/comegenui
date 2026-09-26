---
title: NavbarMenu
group: Navegación
---

# `NavbarMenu`

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

| Prop | Tipo | Default | Descripción |
|------|------|------|------|
| `items` | `NavItem[]` | — | Items del nivel de menú. |
| `trigger` | `"click" \| "hover"` | `"click"` | Disparador de los submenús: click o hover. |

## Eventos

Ninguno.

## Slots

Ninguno.

## Métodos expuestos

Ninguno.
