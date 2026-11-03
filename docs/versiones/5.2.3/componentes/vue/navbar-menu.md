[← Volver](../README.md)

# `NavbarMenu`

Menú recursivo que renderiza **un nivel** del árbol de navegación como una columna de items
`role="menuitem"`. Cada item con `children` es un Dropdown anidado que vuelve a renderizar
`NavbarMenu`, así que el anidamiento es infinito. Es la pieza que abre
[`NavbarHorizontal`](/componentes/vue/navbar-horizontal) dentro de sus submenús.

El contenedor es `role="none"`: el `role="menu"` lo pone el `Dropdown` que envuelve al menú, así
que las filas quedan como hijos directos del menú en el árbol de accesibilidad. Por eso
`NavbarMenu` está pensado para vivir **dentro del panel de un `Dropdown`** (los flyouts de
`NavbarHorizontal`/`NavbarList`); montarlo suelto deja filas `menuitem` sin un `menu` que las
contenga.

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

`path` convierte el item en un `<a>` `role="menuitem"`; `icon` es un SVG inline que va antes del
label. Un item **sin** `path` no navega: se renderiza como un span atenuado con
`aria-disabled="true"` (fuera del recorrido de tabulación).

Un `path` con esquema ejecutable (`javascript:`, `vbscript:`, `data:`, incluso ofuscado con
espacios o controles como `java\tscript:`) tampoco navega: cae al mismo span deshabilitado.

> El HTML del `icon` se sanitiza con un **allowlist de SVG inline** antes de inyectarse: se
> conservan los elementos de dibujo SVG con sus atributos presentacionales y se eliminan
> `<script>`, handlers `on*`, `<a>`, `<img>`, `<foreignObject>`, `<use>`/`href` y `<style>`.

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

## Teclado

Patrón menu button: el menú es **una sola parada de tabulación** (roving tabindex: sólo la fila
activa tiene `tabindex="0"`). Con el foco en una fila:

- `↓` / `↑` recorren las filas; `Home` / `End` van a los bordes.
- Las letras buscan por label (typeahead, se resetea al medio segundo).
- `→` (y `Enter`) sobre una fila de submenú lo abre y deja el foco en su primera fila.
- `Espacio` activa un enlace (el navegador sólo scrollearía con Espacio).
- `Escape` cierra el menú y devuelve el foco al trigger (lo resuelve el `Dropdown`/`Popover`).
- `Tab` sale del panel.

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
