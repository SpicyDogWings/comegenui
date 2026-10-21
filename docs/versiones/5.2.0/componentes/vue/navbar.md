[← Volver](../README.md)

# `Navbar`

Barra de navegación vertical (tipo sidebar) con submenús, búsqueda (`filter`/`scroll`), modo
compacto y opción responsive con hamburguesa + panel lateral.

## Uso en Vue

```vue
<script setup lang="ts">
import Navbar from "@/components/navigation/Navbar.vue";
import { ref } from "vue";

const items = ref([
  { label: "Inicio", path: "#inicio" },
  {
    label: "Usuarios",
    children: [
      { label: "Lista", path: "#usuarios-lista" },
      { label: "Roles", path: "#usuarios-roles" },
    ],
  },
  { label: "Ajustes", path: "#ajustes" },
]);

function onSearch(query: string) {
  console.log("buscando:", query);
}
</script>

<template>
  <Navbar :items="items" active-path="#usuarios-lista" @search="onSearch" />
</template>
```

En HTML plano, cargá el bundle `CuNavbar` (ver [ficha vanilla](/componentes/cu-navbar)).

`items` es la estructura de navegación (es el único prop requerido):

```ts
interface NavItem {
  label: string;
  path?: string;        // enlaces y detección de activo
  icon?: string;        // string HTML (puede ser un SVG inline)
  children?: NavItem[]; // submenús
}
```

## Búsqueda

`search` muestra el input (`searchPlaceholder` cambia su texto). `searchMode` decide qué pasa con
los items que no matchean: `filter` (**default**) los oculta y `scroll` los deja y resalta +
desplaza al primero. `searchFields` limita en qué campos busca (vacío = todos los strings).

```vue
<script setup lang="ts">
import Navbar from "@/components/navigation/Navbar.vue";

const items = [
  { label: "Inicio", path: "#inicio" },
  { label: "Usuarios", path: "#usuarios" },
  { label: "Reportes", path: "#reportes" },
  { label: "Ajustes", path: "#ajustes" },
];
</script>

<template>
  <Navbar
    :items="items"
    search
    search-placeholder="Buscar sección…"
    :search-fields="['label']"
    @search="(query) => console.log(query)"
  />

  <Navbar
    :items="items"
    search
    search-mode="scroll"
    search-placeholder="Buscar y resaltar…"
  />
</template>
```

## Modo compacto

`compact` deja sólo los iconos (o la inicial del label) y los submenús abren como flyout;
`trigger` define si abren con `click` (**default**) o con `hover`.

```vue
<script setup lang="ts">
import Navbar from "@/components/navigation/Navbar.vue";

const items = [
  {
    label: "Usuarios",
    children: [
      { label: "Lista", path: "#usuarios-lista" },
      { label: "Roles", path: "#usuarios-roles" },
    ],
  },
  { label: "Ajustes", path: "#ajustes" },
];
</script>

<template>
  <Navbar :items="items" compact trigger="click" />
  <Navbar :items="items" compact trigger="hover" />
</template>
```

> `trigger` sólo aplica en modo compacto: con la nav expandida los submenús siempre abren con
> click.

## Compactable y colapsado

`compactable` agrega el botón nativo que alterna el modo compacto (sin manejar estado afuera) y
`collapsed` hace que los submenús arranquen cerrados.

```vue
<script setup lang="ts">
import Navbar from "@/components/navigation/Navbar.vue";

const items = [/* … */];
</script>

<template>
  <Navbar :items="items" compactable collapsed trigger="click" />
</template>
```

## Responsive

`responsive` reemplaza la nav inline por una hamburguesa que abre el menú en un panel lateral.
`responsiveMode` acepta `auto` (**default**: fullscreen en pantallas muy chicas y lateral en el
resto), `side` (siempre lateral) y `fullscreen`; `sideOverPosition` elige desde qué borde desliza
(`left` —**default**—, `right`, `top`, `bottom`).

```vue
<script setup lang="ts">
import Navbar from "@/components/navigation/Navbar.vue";

const items = [/* … */];
</script>

<template>
  <Navbar :items="items" responsive responsive-mode="auto" />
  <Navbar :items="items" responsive responsive-mode="side" />
  <Navbar :items="items" responsive responsive-mode="fullscreen" />

  <Navbar :items="items" responsive responsive-mode="side" side-over-position="left" />
  <Navbar :items="items" responsive responsive-mode="side" side-over-position="right" />
  <Navbar :items="items" responsive responsive-mode="side" side-over-position="top" />
  <Navbar :items="items" responsive responsive-mode="side" side-over-position="bottom" />
</template>
```

## Activo y resaltado

`activePath` marca qué item se ve como activo (si se omite y hay router, se toma de la ruta
actual). `highlightItem` resalta un item puntual, por identidad.

```vue
<script setup lang="ts">
import Navbar from "@/components/navigation/Navbar.vue";

const destacado = { label: "Reportes", path: "#reportes" };

const items = [
  { label: "Inicio", path: "#inicio" },
  { label: "Usuarios", path: "#usuarios" },
  destacado,
  { label: "Ajustes", path: "#ajustes" },
];
</script>

<template>
  <Navbar :items="items" :highlight-item="destacado" active-path="#usuarios" />
</template>
```

> `highlightItem` sólo existe en Vue: el custom element expone únicamente `active-path`.

## Props

<!--@include: ../../partials/navbar/props-vue.md-->

## Emits

<!--@include: ../../partials/navbar/eventos.md-->

## Slots

<!--@include: ../../partials/navbar/slots.md-->

## Expose

<!--@include: ../../partials/navbar/metodos.md-->
