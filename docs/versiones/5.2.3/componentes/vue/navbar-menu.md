[← Volver](../README.md)

# `NavbarMenu`

Menú recursivo que renderiza **un nivel** del árbol de navegación como una columna de items.
Cada item con `children` es un Dropdown anidado que vuelve a renderizar `NavbarMenu`, así que el
anidamiento es infinito. Es la pieza que abre [`NavbarHorizontal`](/componentes/vue/navbar-horizontal)
dentro de sus submenús.

## Uso en Vue

```vue
<script setup lang="ts">
import NavbarMenu from "@/components/navigation/NavbarMenu.vue";

const items = [
  { label: "Editar", path: "/editar" },
  { label: "Duplicar", path: "/duplicar" },
  { label: "Eliminar", path: "/eliminar" },
];
</script>

<template>
  <NavbarMenu :items="items" />
</template>
```

## Enlaces, iconos y items sin ruta

`path` convierte el item en un `<a>`; `icon` es un string HTML (SVG inline) que va antes del
label. Un item **sin** `path` no navega: se renderiza como un span atenuado (deshabilitado).

> El HTML del `icon` se sanitiza con **DOMPurify** antes de inyectarse: los SVG válidos se
> conservan y se eliminan `<script>`, handlers `on*` y URLs peligrosas.

```vue
<script setup lang="ts">
import NavbarMenu from "@/components/navigation/NavbarMenu.vue";

const lapiz =
  '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>';

const items = [
  { label: "Editar", path: "/editar", icon: lapiz },
  { label: "Duplicar", path: "/duplicar" },
  { label: "Solo texto" },
];
</script>

<template>
  <NavbarMenu :items="items" />
</template>
```

## Anidados

Un item con `children` despliega un Dropdown que vuelve a montar `NavbarMenu`, en cascada.

```vue
<script setup lang="ts">
import NavbarMenu from "@/components/navigation/NavbarMenu.vue";

const items = [
  {
    label: "Archivo",
    children: [
      { label: "Nuevo", path: "/nuevo" },
      {
        label: "Exportar",
        children: [
          { label: "PDF", path: "/exportar/pdf" },
          { label: "PNG", path: "/exportar/png" },
        ],
      },
    ],
  },
  { label: "Cerrar", path: "/cerrar" },
];
</script>

<template>
  <NavbarMenu :items="items" />
</template>
```

## Trigger

`trigger` decide cómo abren los submenús anidados: `click` (**default**) o `hover`.

```vue
<script setup lang="ts">
import NavbarMenu from "@/components/navigation/NavbarMenu.vue";

const items = [
  { label: "Uno", path: "/uno" },
  {
    label: "Submenú",
    children: [{ label: "Hijo", path: "/hijo" }],
  },
];
</script>

<template>
  <NavbarMenu :items="items" trigger="click" />
  <NavbarMenu :items="items" trigger="hover" />
</template>
```

## Props

<!--@include: ../../partials/navbar-menu/props.md-->

## Emits

<!--@include: ../../partials/navbar-menu/eventos.md-->

## Slots

<!--@include: ../../partials/navbar-menu/slots.md-->

## Expose

<!--@include: ../../partials/navbar-menu/metodos.md-->
