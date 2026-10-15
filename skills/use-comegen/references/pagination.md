# Pagination — `<cu-pagination>` / `<Pagination>`

Paginación numérica con selector de tamaño de página, botones de primera/última y rango visible
(«Mostrando X - Y de Z»). Va debajo de una tabla o lista paginada.

## Receta

- Componente controlado: pasá `current-page`/`total-pages` y actualizá tu estado con `update:currentPage` / `update:itemsPerPage`.
- `total-items` sólo alimenta el texto del rango.
- Selector de tamaño: `show-page-size` + `pageSizeOptions` (propiedad JS).
- `show-first-and-last` agrega los saltos a primera/última página.
- `color`/`variant` se aplican a los botones; la página activa siempre se pinta `solid`.
- Al cambiar el tamaño de página se emite `update:itemsPerPage` y además `update:currentPage` = 1.

```html
<cu-pagination current-page="<number>" total-pages="<number>" total-items="<number>" items-per-page="<number>" show-page-size show-first-and-last></cu-pagination>
```

```vue
<Pagination v-model:current-page="<number>" v-model:items-per-page="<number>" :total-pages="<number>" :total-items="<number>" show-page-size show-first-and-last :page-size-options="<items>" />
```

Los valores de `color` / `variant` están en «Atributos» / «Props», abajo.

## Límites

- No expone métodos ni slots.
- Sólo emite `update:currentPage` y `update:itemsPerPage`: no hay `change` ni un evento con página y tamaño juntos.
- No calcula `total-pages`: se lo pasás.
- `pageSizeOptions` es un array: sólo propiedad JS, no atributo HTML.
- Si `totalPages <= 1` y `showPageSize` es `false` no renderiza nada, ni el texto del rango.
- No hay input para saltar a una página arbitraria: sólo botones y primera/última.
- La página activa ignora `variant`: siempre `solid`.
- No controla el contenido: sólo muestra y emite página y tamaño.

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
