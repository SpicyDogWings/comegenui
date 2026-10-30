[← Volver](../README.md)

# `NavbarHorizontal`

Barra de navegación horizontal con submenús desplegables (Dropdown) y detección de ítem activo
por ruta. Toda la estructura entra por `items`.

## Uso en Vue

```vue
<script setup lang="ts">
import NavbarHorizontal from "@/components/navigation/NavbarHorizontal.vue";
import { ref } from "vue";

const items = ref([
  { label: "Inicio", path: "/inicio" },
  {
    label: "Equipo",
    children: [
      { label: "Desarrollo", path: "/equipo/dev" },
      { label: "Diseño", path: "/equipo/diseno" },
    ],
  },
]);
</script>

<template>
  <NavbarHorizontal :items="items" />
</template>
```

En HTML plano, cargá el bundle `CuNavbarHorizontal` (ver [ficha vanilla](/componentes/cu-navbar-horizontal)).

## Submenús

Un item con `children` se convierte en un Dropdown que despliega un `<NavbarMenu>`; los niveles
se pueden anidar sin límite.

```vue
<script setup lang="ts">
import NavbarHorizontal from "@/components/navigation/NavbarHorizontal.vue";
import { ref } from "vue";

const items = ref([
  { label: "Inicio", path: "/inicio" },
  {
    label: "Equipo",
    children: [
      { label: "Desarrollo", path: "/equipo/dev" },
      {
        label: "Diseño",
        children: [
          { label: "Sistema", path: "/diseno/sistema" },
          { label: "Marca", path: "/diseno/marca" },
        ],
      },
    ],
  },
  { label: "Contacto", path: "/contacto" },
]);
</script>

<template>
  <NavbarHorizontal :items="items" />
</template>
```

## Enlaces e iconos

`path` es el destino del enlace (y lo que `activePath` compara); `icon` es un string HTML
(SVG inline) que se inyecta antes del label. Un item **sin** `path` no navega: renderiza un
`<button>`.

> El HTML del `icon` se sanitiza con **DOMPurify** antes de inyectarse: los SVG válidos se
> conservan y se eliminan `<script>`, handlers `on*` y URLs peligrosas.

```vue
<script setup lang="ts">
import NavbarHorizontal from "@/components/navigation/NavbarHorizontal.vue";
import { ref } from "vue";

const casa =
  '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>';

const items = ref([
  { label: "Inicio", path: "/inicio", icon: casa },
  { label: "Ajustes", path: "/ajustes" },
  { label: "Sólo texto" },
]);
</script>

<template>
  <NavbarHorizontal :items="items" />
</template>
```

## Trigger

`trigger` decide cómo abren los submenús: `click` (**default**) o `hover`.

```vue
<script setup lang="ts">
import NavbarHorizontal from "@/components/navigation/NavbarHorizontal.vue";
import { ref } from "vue";

const items = ref([
  { label: "Inicio", path: "/inicio" },
  {
    label: "Producto",
    children: [
      { label: "Features", path: "/features" },
      { label: "Precios", path: "/precios" },
    ],
  },
]);
</script>

<template>
  <NavbarHorizontal :items="items" trigger="click" />
  <NavbarHorizontal :items="items" trigger="hover" />
</template>
```

## Activo

`activePath` marca el item activo (color `primary` + variante `soft`). Si el item activo está
dentro de un submenú, se resalta el padre.

```vue
<script setup lang="ts">
import NavbarHorizontal from "@/components/navigation/NavbarHorizontal.vue";
import { ref } from "vue";

const items = ref([
  { label: "Inicio", path: "/inicio" },
  {
    label: "Equipo",
    children: [
      { label: "Desarrollo", path: "/equipo/dev" },
      { label: "Diseño", path: "/equipo/diseno" },
    ],
  },
  { label: "Contacto", path: "/contacto" },
]);
</script>

<template>
  <!-- activo dentro de un submenú: se resalta «Equipo» -->
  <NavbarHorizontal :items="items" active-path="/equipo/dev" />
  <!-- activo suelto -->
  <NavbarHorizontal :items="items" active-path="/contacto" />
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

## Props

<!--@include: ../../partials/navbar-horizontal/props-vue.md-->

## Emits

<!--@include: ../../partials/navbar-horizontal/eventos.md-->

## Slots

<!--@include: ../../partials/navbar-horizontal/slots.md-->

## Expose

<!--@include: ../../partials/navbar-horizontal/metodos.md-->
