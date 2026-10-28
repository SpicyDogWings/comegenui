[← Volver](../README.md)

# `NavbarList`

Lista de navegación vertical: items, submenús colapsables, buscador, modo compacto y resaltado
del item activo o buscado. Es la variante en columna de
[`NavbarHorizontal`](/componentes/vue/navbar-horizontal) (y la que usa el `Navbar` responsive).

## Uso en Vue

```vue
<script setup lang="ts">
import NavbarList from "@/components/navigation/NavbarList.vue";

const items = [
  { label: "Inicio", path: "/inicio" },
  {
    label: "Usuarios",
    children: [
      { label: "Lista", path: "/usuarios/lista" },
      { label: "Roles", path: "/usuarios/roles" },
    ],
  },
  { label: "Ajustes", path: "/ajustes" },
];
</script>

<template>
  <NavbarList :items="items" />
</template>
```

## Submenús

Un item con `children` se renderiza como un `Collapse` (abierto por default). `collapsed` hace
que arranquen cerrados y `trigger` decide si abren con `click` (**default**) o `hover`.

```vue
<script setup lang="ts">
import NavbarList from "@/components/navigation/NavbarList.vue";

const items = [
  { label: "Inicio", path: "/inicio" },
  {
    label: "Usuarios",
    children: [
      { label: "Lista", path: "/usuarios/lista" },
      { label: "Roles", path: "/usuarios/roles" },
    ],
  },
  { label: "Ajustes", path: "/ajustes" },
];
</script>

<template>
  <!-- submenús cerrados al inicio, abren con click -->
  <NavbarList :items="items" collapsed trigger="click" />
  <!-- submenús abiertos, abren al pasar el mouse -->
  <NavbarList :items="items" trigger="hover" />
</template>
```

## Búsqueda

`search` agrega el buscador arriba de la lista y `search-placeholder` su placeholder. El texto
viaja por `v-model:query` (y el emit `update:query`); `search-fields` limita los campos sobre
los que se busca y `search-mode` elige entre `filter` (**default**, filtra los items) y `scroll`
(no filtra, resalta y desplaza al primer match).

```vue
<script setup lang="ts">
import NavbarList from "@/components/navigation/NavbarList.vue";
import { ref } from "vue";

const query = ref("");

const items = [
  { label: "Inicio", path: "/inicio" },
  { label: "Usuarios", path: "/usuarios" },
  { label: "Reportes", path: "/reportes" },
  { label: "Ajustes", path: "/ajustes" },
];

function onUpdateQuery(valor: string) {
  console.log("@update:query →", valor);
}
</script>

<template>
  <!-- searchMode="filter" (default): filtra los items -->
  <NavbarList
    v-model:query="query"
    :items="items"
    search
    search-placeholder="Filtrar…"
    :search-fields="['label']"
    @update:query="onUpdateQuery"
  />

  <!-- searchMode="scroll": no filtra, resalta y desplaza al primer match -->
  <NavbarList
    :items="items"
    search
    search-mode="scroll"
    search-placeholder="Buscar y resaltar…"
  />
</template>
```

## Compacto

`compact` deja la lista sólo con iconos (o la inicial del label); `compactable` muestra el
botón que alterna compacto/expandido y avisa con `toggle-compact`.

```vue
<script setup lang="ts">
import NavbarList from "@/components/navigation/NavbarList.vue";

const items = [
  { label: "Inicio", path: "/inicio" },
  {
    label: "Usuarios",
    children: [
      { label: "Lista", path: "/usuarios/lista" },
      { label: "Roles", path: "/usuarios/roles" },
    ],
  },
  { label: "Ajustes", path: "/ajustes" },
];

function onToggleCompact() {
  console.log("@toggle-compact");
}
</script>

<template>
  <!-- compact: modo compacto fijo (sólo iconos o la inicial) -->
  <NavbarList :items="items" compact />

  <!-- compactable: botón nativo que alterna compact/expandido -->
  <NavbarList :items="items" compactable @toggle-compact="onToggleCompact" />
</template>
```

## Activo y resaltado

`active-path` detecta el activo por ruta; `active-item` y `highlight-target` marcan un item
puntual de forma explícita (el segundo es el que usa la búsqueda en modo `scroll`).

```vue
<script setup lang="ts">
import NavbarList from "@/components/navigation/NavbarList.vue";

const activo = { label: "Usuarios", path: "/usuarios" };
const resaltado = { label: "Reportes", path: "/reportes" };

const items = [
  { label: "Inicio", path: "/inicio" },
  activo,
  resaltado,
  { label: "Ajustes", path: "/ajustes" },
];
</script>

<template>
  <NavbarList
    :items="items"
    active-path="/usuarios"
    :active-item="activo"
    :highlight-target="resaltado"
  />
</template>
```

## Props

<!--@include: ../../partials/navbar-list/props.md-->

## Emits

<!--@include: ../../partials/navbar-list/eventos.md-->

## Slots

<!--@include: ../../partials/navbar-list/slots.md-->

## Expose

<!--@include: ../../partials/navbar-list/metodos.md-->
