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

<!-- @api:props -->
| Prop | Tipo | Default | Descripción |
| ------ | ------ | ------ | ------ |
| `itemsPerPage` | `number` | `10` | — |
| `showPageSize` | `boolean` | `false` | — |
| `pageSizeOptions` | `number[]` | `[5, 10, 20, 50]` | — |
| `color` | `"primary" \| "secondary" \| "neutral" \| "success" \| "warning" \| "danger"` | `"neutral"` | — |
| `variant` | `"outlined" \| "soft" \| "ghost" \| "subtle" \| "none"` | `"soft"` | — |
| `currentPage` | `number` | `1` | — |
| `totalPages` | `number` | `1` | — |
| `totalItems` | `number` | `0` | — |
| `showFirstAndLast` | `boolean` | `false` | — |
<!-- /@api:props -->

> **`pageSizeOptions`:** se asigna como propiedad JS (`pagination.pageSizeOptions = [10, 25, 50]`). Como atributo HTML no se soporta (es un array).

## Emits

<!-- @api:emits -->
| Evento | Payload | Descripción |
| ------ | ------ | ------ |
| `update:currentPage` | — | — |
| `update:itemsPerPage` | — | — |
<!-- /@api:emits -->

> Los eventos custom se escuchan con `addEventListener` y el payload está en `e.detail`.

## Slots

<!-- @api:slots -->
Ninguno.
<!-- /@api:slots -->

## Expose

<!-- @api:expose -->
No expone métodos.
<!-- /@api:expose -->
