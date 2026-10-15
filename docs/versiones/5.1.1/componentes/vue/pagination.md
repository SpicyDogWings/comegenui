[← Volver](../README.md)

# `Pagination`

Paginación numérica con selector de tamaño de página y botones de primera/última. Pensado para
usarse dentro de tablas o listas.

## Uso en Vue

```vue
<script setup lang="ts">
import Pagination from "@/components/controls/Pagination.vue";
import { ref } from "vue";

const currentPage = ref(1);
const itemsPerPage = ref(10);
</script>

<template>
  <Pagination
    v-model:current-page="currentPage"
    v-model:items-per-page="itemsPerPage"
    :total-pages="10"
    :total-items="100"
    color="primary"
    variant="soft"
  />
</template>
```

En HTML plano, cargá el bundle `CuPagination` (ver [ficha vanilla](/componentes/cu-pagination)).

`currentPage` es la página actual, `totalPages` cuántas hay (si es `1` no renderiza nada) y
`totalItems` el total de registros, que se usa para el texto «Mostrando X - Y de Z».

## Colores

`color` es un nombre semántico: se resuelve con los tokens del tema activo, así que el mismo
nombre se ve distinto en cada tema. Pinta el botón de la página activa.

```vue
<script setup lang="ts">
import Pagination from "@/components/controls/Pagination.vue";
</script>

<template>
  <Pagination :current-page="5" :total-pages="10" :total-items="95" color="primary" />
  <Pagination :current-page="5" :total-pages="10" :total-items="95" color="secondary" />
  <Pagination :current-page="5" :total-pages="10" :total-items="95" color="neutral" />
  <Pagination :current-page="5" :total-pages="10" :total-items="95" color="success" />
  <Pagination :current-page="5" :total-pages="10" :total-items="95" color="warning" />
  <Pagination :current-page="5" :total-pages="10" :total-items="95" color="danger" />
</template>
```

## Variantes

`variant` es la variante de los botones: `outlined` (borde), `soft` (fondo tenue, el
**default**), `ghost` (transparente), `subtle` (tenue con borde) y `none` (sin estilo propio).

```vue
<script setup lang="ts">
import Pagination from "@/components/controls/Pagination.vue";
</script>

<template>
  <Pagination :current-page="5" :total-pages="10" :total-items="95" color="primary" variant="outlined" />
  <Pagination :current-page="5" :total-pages="10" :total-items="95" color="primary" variant="soft" />
  <Pagination :current-page="5" :total-pages="10" :total-items="95" color="primary" variant="ghost" />
  <Pagination :current-page="5" :total-pages="10" :total-items="95" color="primary" variant="subtle" />
  <Pagination :current-page="5" :total-pages="10" :total-items="95" color="primary" variant="none" />
</template>
```

## Tamaño de página

`show-page-size` agrega el selector «Por página:», alimentado por `page-size-options`
(default `[5, 10, 20, 50]`) y con `items-per-page` como valor actual. Al elegir un tamaño
vuelve a la página 1.

```vue
<script setup lang="ts">
import Pagination from "@/components/controls/Pagination.vue";
import { ref } from "vue";

const currentPage = ref(1);
const itemsPerPage = ref(20);
</script>

<template>
  <Pagination
    v-model:current-page="currentPage"
    v-model:items-per-page="itemsPerPage"
    :page-size-options="[10, 20, 50, 100]"
    show-page-size
    :total-pages="10"
    :total-items="195"
  />
</template>
```

## Primera y última

`show-first-and-last` agrega los botones de salto a la primera y a la última página.

```vue
<script setup lang="ts">
import Pagination from "@/components/controls/Pagination.vue";
import { ref } from "vue";

const currentPage = ref(10);
</script>

<template>
  <Pagination
    v-model:current-page="currentPage"
    show-first-and-last
    :total-pages="20"
    :total-items="195"
    color="primary"
  />
</template>
```

## Interacción

`update:currentPage` lleva el número de página nuevo y `update:itemsPerPage` el tamaño nuevo:
son los dos los que consumen `v-model:current-page` / `v-model:items-per-page`.

```vue
<script setup lang="ts">
import Pagination from "@/components/controls/Pagination.vue";
import { ref } from "vue";

const currentPage = ref(1);
const itemsPerPage = ref(10);

function onUpdatePage(value: number) {
  console.log("update:currentPage →", value);
}
function onUpdateItemsPerPage(value: number) {
  console.log("update:itemsPerPage →", value);
}
</script>

<template>
  <Pagination
    v-model:current-page="currentPage"
    v-model:items-per-page="itemsPerPage"
    show-page-size
    :total-pages="10"
    :total-items="95"
    color="primary"
    @update:current-page="onUpdatePage"
    @update:items-per-page="onUpdateItemsPerPage"
  />
</template>
```

## Props

<!--@include: ../../partials/pagination/props-vue.md-->

## Emits

<!--@include: ../../partials/pagination/eventos.md-->

## Slots

<!--@include: ../../partials/pagination/slots.md-->

## Expose

<!--@include: ../../partials/pagination/metodos.md-->
