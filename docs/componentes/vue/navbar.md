# `Navbar`

Barra de navegación vertical (tipo sidebar) con submenús, búsqueda (`filter`/`scroll`), modo compacto y opción responsive con hamburguesa + panel lateral.

[← Volver](../README.md)

---

## Uso en Vue

```vue
<script setup lang="ts">
import Navbar from "@/components/navigation/Navbar.vue";
import { ref } from "vue";

const items = ref([
  { label: 'Inicio', path: '/' },
  { label: 'Usuarios', children: [
    { label: 'Lista', path: '/usuarios' },
    { label: 'Roles', path: '/roles' },
  ]},
  { label: 'Ajustes', path: '/ajustes' },
]);

function onSearch(query: string) {
  console.log('buscando:', query);
}
</script>

<template>
  <Navbar search active-path="/usuarios" :items="items" @search="onSearch" />
</template>
```

## Estructura de `items`

```ts
interface NavItem {
  label: string;
  path?: string;        // enlaces y detección de activo
  icon?: string;        // string HTML (puede ser un SVG inline)
  children?: NavItem[]; // submenús
}
```

## Modo compacto y responsive

```vue
<script setup lang="ts">
import Navbar from "@/components/navigation/Navbar.vue";
import { ref } from "vue";

const items = ref([/* ... */]);
</script>

<template>
  <Navbar :items="items" compact trigger="hover" />
  <Navbar :items="items" responsive responsive-mode="side" side-over-position="right" />
</template>
```

---

## Props

<!-- @api:props -->
| Prop | Tipo | Default | Descripción |
| ------ | ------ | ------ | ------ |
| `trigger` | `"click" \| "hover"` | `'click'` | — |
| `searchPlaceholder` | `string` | `'Buscar...'` | — |
| `searchFields` | `string[]` | `[]` | — |
| `compact` | `boolean` | `false` | — |
| `search` | `boolean` | `false` | — |
| `searchMode` | `"filter" \| "scroll"` | `'filter'` | — |
| `activePath` | `string` | `''` | — |
| `compactable` | `boolean` | `false` | — |
| `collapsed` | `boolean` | `false` | — |
| `responsive` | `boolean` | `false` | — |
| `responsiveMode` | `"auto" \| "side" \| "fullscreen"` | `'auto'` | — |
| `sideOverPosition` | `"bottom" \| "top" \| "left" \| "right"` | `'left'` | — |
| `highlightItem` | `NavItem \| null` | `null` | — |
| `items` | `NavItem[]` | `—` | — |
<!-- /@api:props -->

## Emits

<!-- @api:emits -->
| Evento | Payload | Descripción |
| ------ | ------ | ------ |
| `search` | `string` | — |
<!-- /@api:emits -->

## Slots

<!-- @api:slots -->
Ninguno.
<!-- /@api:slots -->

## Expose

<!-- @api:expose -->
No expone métodos.
<!-- /@api:expose -->
