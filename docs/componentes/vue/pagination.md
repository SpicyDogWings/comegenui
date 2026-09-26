# `Pagination`

Paginación numérica con soporte para selector de tamaño de página y botones de primera/última. Pensado para usarse dentro de tablas o listas.

[← Volver](../README.md)

---

## Uso en Vue

```vue
<script setup lang="ts">
import Pagination from "@/components/controls/Pagination.vue";
import { ref } from "vue";

const currentPage = ref(1);
const itemsPerPage = ref(10);
const pageSizeOptions = ref([10, 25, 50, 100]);
</script>

<template>
  <Pagination
    v-model:current-page="currentPage"
    v-model:items-per-page="itemsPerPage"
    :total-pages="10"
    :total-items="100"
    color="primary"
    variant="soft"
    show-page-size
    :page-size-options="pageSizeOptions"
  />
</template>
```

## Ejemplo con todos los controles

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
    :total-pages="20"
    :total-items="195"
    show-page-size
    show-first-and-last
    color="primary"
    variant="outlined"
  />
</template>
```

## Atributos booleanos en HTML

```vue
<script setup lang="ts">
import Pagination from "@/components/controls/Pagination.vue";
</script>

<template>
  <Pagination
    show-page-size
    show-first-and-last
    :total-pages="5"
  />
</template>
```

---

## Props

| Prop | Tipo | Default | Descripción |
|------|------|------|------|
| `theme` | `string` | `""` | Tema: `light`, `dark`, `sigacadv2` (hereda de `<html data-theme>` si se omite) |
| `color` | `"primary" \| "secondary" \| "neutral" \| "success" \| "warning" \| "danger"` | `"neutral"` | Color semántico: `primary`, `neutral`, `success`, `warning`, `danger` |
| `variant` | `"outlined" \| "soft" \| "ghost" \| "subtle" \| "none"` | `"soft"` | `outlined`, `soft`, `ghost`, `subtle`, `none` |
| `currentPage` | `number` | `1` | Página actual (atributo HTML: `current-page`) |
| `totalPages` | `number` | `1` | Total de páginas (atributo HTML: `total-pages`) |
| `totalItems` | `number` | `0` | Total de items, útil para mostrar "X–Y de Z" (atributo HTML: `total-items`) |
| `itemsPerPage` | `number` | `10` | Items por página (atributo HTML: `items-per-page`) |
| `showPageSize` | `boolean` | `false` | Muestra el selector de tamaño de página (atributo HTML: `show-page-size`) |
| `pageSizeOptions` | `number[]` | `[5, 10, 20, 50]` | Opciones del selector (atributo HTML: `page-size-options`) |
| `showFirstAndLast` | `boolean` | `false` | Muestra botones "primera" y "última" página (atributo HTML: `show-first-and-last`) |
| `hightContrast` | `boolean` | `false` | Modo de alto contraste |

> **`pageSizeOptions`:** se asigna como propiedad JS (`pagination.pageSizeOptions = [10, 25, 50]`). Como atributo HTML no se soporta (es un array).

## Emits

| Evento | Payload | Descripción |
|------|------|------|
| `update:currentPage` | `number` | Se emite cuando cambia la página actual |
| `update:itemsPerPage` | `number` | Se emite cuando cambia el tamaño de página |

> Los eventos custom se escuchan con `addEventListener` y el payload está en `e.detail`.

## Slots

Ninguno.

## Expose

No expone métodos. El control se hace via props y eventos.
