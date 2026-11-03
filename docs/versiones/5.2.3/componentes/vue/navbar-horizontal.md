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
se pueden anidar sin límite. El disparador es un `<button type="button">` (dentro de un `<form>`
no lo envía) y sigue el patrón **menu button**: `aria-haspopup="menu"`, `aria-expanded` según el
estado del panel y `aria-controls` mientras está abierto. El panel es `role="menu"` y cada fila
`role="menuitem"` (los items sin `path`, `aria-disabled="true"`).

Con el foco en el disparador, `↓`/`↑` abren el menú y dejan el foco en la primera/última fila.
Dentro del menú: `↓`/`↑` recorren, `Home`/`End` van a los bordes, las letras buscan por label
(typeahead), `→`/`Enter` abren un submenú, `Espacio` activa un enlace y `Escape` cierra
devolviendo el foco al disparador.

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
(SVG inline) que se inyecta antes del label. Un item **sin** `path` no navega: en el nivel raíz
renderiza un `<button>` y dentro de un submenú una fila deshabilitada (no enfocable).

> El HTML del `icon` se sanitiza con un **allowlist de SVG inline** antes de inyectarse: se
> conservan los elementos de dibujo (`svg`, `g`, `path`, `circle`, `rect`, `line`, `polyline`,
> `polygon`, `ellipse`, `defs`, `linearGradient`, `radialGradient`, `stop`, `clipPath`, `mask`,
> `title`, `desc`) con sus atributos presentacionales, y se eliminan `<script>`, handlers `on*`,
> `<a>`, `<img>`, `<foreignObject>`, `<use>`/`href` (recursos externos) y `<style>`. Un icono que
> no es SVG no renderiza nada.

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

`activePath` marca el item activo (color `primary` + variante `soft`; el enlace expone
`aria-current="page"`). Si el item activo está dentro de un submenú, se resalta el padre (el
disparador toma el mismo color y el contenedor lleva `data-navbar-active`).

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
  icon?: string;        // SVG inline (allowlist de elementos SVG)
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
