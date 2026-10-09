# Pagination — `<cu-pagination>` / `<Pagination>`

Paginación numérica con selector de tamaño de página, botones de primera/última y rango visible ("Mostrando X - Y de Z").

## Cuándo usarlo

Debajo de una tabla o lista paginada, para moverte entre páginas y cambiar cuántos items se
muestran por página.

## Receta

1. El componente es controlado: pasá `current-page`/`total-pages` (y `items-per-page`/
   `total-items`) y actualizá tu estado con `update:currentPage` / `update:itemsPerPage`.
2. `total-items` sólo alimenta el texto del rango; sin él no hay "Mostrando X - Y de Z".
3. Para el selector de tamaño agregá `show-page-size` y, si querés otras opciones, asigná
   `pageSizeOptions` como propiedad JS.
4. `show-first-and-last` agrega los saltos a primera/última página.
5. `color`/`variant` se aplican a los botones; la página activa siempre se pinta `solid`.
6. Al cambiar el tamaño de página se emite `update:itemsPerPage` y además `update:currentPage` = 1.

```html
<!-- HTML plano (UMD) -->
<script src="dist-libs/umd-core/CuPagination.umd.js"></script>

<cu-pagination
  id="paginacion"
  current-page="1"
  total-pages="20"
  total-items="195"
  items-per-page="10"
  show-page-size
  show-first-and-last
  color="primary"
  variant="outlined"
></cu-pagination>

<script>
  const p = document.getElementById('paginacion');
  p.pageSizeOptions = [10, 25, 50, 100];

  p.addEventListener('update:currentPage', (e) => {
    console.log('Página:', e.detail);
  });
  p.addEventListener('update:itemsPerPage', (e) => {
    console.log('Items por página:', e.detail);
  });
</script>
```

```vue
<!-- Vue -->
<script setup lang="ts">
import Pagination from "@/components/controls/Pagination.vue";
import { ref } from "vue";

const currentPage = ref(1);
const itemsPerPage = ref(10);
const pageSizeOptions = [10, 25, 50, 100];
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
    :page-size-options="pageSizeOptions"
  />
</template>
```

## Qué puede y qué no puede

**Puede:** 6 colores y 5 variantes (`outlined`, `soft`, `ghost`, `subtle`, `none`), selector de
tamaño de página con opciones configurables (`showPageSize` + `pageSizeOptions`), botones de
primera/última (`showFirstAndLast`) y el texto de rango (`totalItems`).

**No puede:**

- **No expone métodos ni slots.**
- **Sólo emite `update:currentPage` y `update:itemsPerPage`.** No hay `change` ni un evento que
  traiga página y tamaño juntos.
- **No calcula `total-pages` por vos:** se lo pasás.
- **`pageSizeOptions` es un array:** no se puede pasar como atributo HTML, sólo como propiedad
  JS (`pagination.pageSizeOptions = [...]`).
- **Si `totalPages <= 1` y `showPageSize` es `false`, no renderiza nada**, ni siquiera el texto
  del rango.
- **No hay input para saltar a una página arbitraria:** sólo botones y primera/última.
- **La página activa ignora `variant`:** siempre se pinta `solid`.
- No controla el contenido: sólo muestra y emite número de página y tamaño.

## API del custom element

### Atributos

<!-- @api:atributos -->
| Atributo | Tipo | Default | Descripción |
| ------ | ------ | ------ | ------ |
| `items-per-page` | `number` | `10` | Items por página (atributo HTML: `items-per-page`) |
| `show-page-size` | `boolean` | `false` | Muestra el selector de tamaño de página (atributo HTML: `show-page-size`) |
| `page-size-options` | `number[]` | `[5, 10, 20, 50]` | Opciones del selector (atributo HTML: `page-size-options`) |
| `color` | `"primary" \| "secondary" \| "neutral" \| "success" \| "warning" \| "danger"` | `"neutral"` | Color semántico: `primary`, `neutral`, `success`, `warning`, `danger` |
| `variant` | `"outlined" \| "soft" \| "ghost" \| "subtle" \| "none"` | `"soft"` | `outlined`, `soft`, `ghost`, `subtle`, `none` |
| `current-page` | `number` | `1` | Página actual (atributo HTML: `current-page`) |
| `total-pages` | `number` | `1` | Total de páginas (atributo HTML: `total-pages`) |
| `total-items` | `number` | `0` | Total de items, útil para mostrar "X–Y de Z" (atributo HTML: `total-items`) |
| `show-first-and-last` | `boolean` | `false` | Muestra botones "primera" y "última" página (atributo HTML: `show-first-and-last`) |
<!-- /@api:atributos -->

### Eventos

<!-- @api:eventos -->
| Evento | Payload (`e.detail`) | Descripción |
| ------ | ------ | ------ |
| `update:currentPage` | — | — |
| `update:itemsPerPage` | — | — |
<!-- /@api:eventos -->

### Slots

<!-- @api:slots -->
Ninguno.
<!-- /@api:slots -->

### Métodos expuestos

<!-- @api:metodos -->
No expone métodos.
<!-- /@api:metodos -->

## API del componente Vue

### Props

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

### Emits

<!-- @api:emits -->
| Evento | Payload | Descripción |
| ------ | ------ | ------ |
| `update:currentPage` | — | — |
| `update:itemsPerPage` | — | — |
<!-- /@api:emits -->

### Slots

<!-- @api:slots-vue -->
Ninguno.
<!-- /@api:slots-vue -->

### Expose

<!-- @api:expose -->
No expone métodos.
<!-- /@api:expose -->
