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

| Prop | Tipo | Default | Descripción |
|------|------|------|------|
| `items` | `unknown[]` | — | Estructura de navegación. **Se asigna como propiedad JS** |
| `trigger` | `"click" \| "hover"` | `"click"` | Cómo abren los submenús: `click` o `hover` |
| `activePath` | `string` | `""` | Path activo manual. Si se omite, se toma de la ruta (cuando hay router) |

## Emits

Ninguno.

## Slots

Ninguno.

## Expose

Ninguno.
