# `NavbarHorizontal`

Barra de navegación horizontal con submenús desplegables (Dropdown) y detección de ítem activo por ruta.

[← Volver](../README.md)

---

## Uso en Vue

```vue
<script setup lang="ts">
import NavbarHorizontal from "@/components/navigation/NavbarHorizontal.vue";
import { ref } from "vue";

const items = ref([
  { label: 'Inicio', path: '/' },
  { label: 'Equipo', children: [
    { label: 'Desarrollo', path: '/equipo/dev' },
    { label: 'Diseño', path: '/equipo/diseno' },
  ]},
]);
</script>

<template>
  <NavbarHorizontal trigger="hover" active-path="/equipo/dev" :items="items" />
</template>
```

## Estructura de `items`

```ts
interface NavItem {
  label: string;
  path?: string;        // enlaces y detección de activo
  icon?: string;        // string HTML (puede ser un SVG inline)
  children?: NavItem[]; // submenús desplegables
}
```

---

## Props

<!-- @api:props -->
| Prop | Tipo | Default | Descripción |
| ------ | ------ | ------ | ------ |
| `trigger` | `"click" \| "hover"` | `'click'` | — |
| `activePath` | `string` | `''` | — |
| `items` | `NavItem[]` | `—` | — |
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
