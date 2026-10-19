[← Volver](../README.md)

# `<cu-pagination>`

Paginación numérica con selector de tamaño de página y botones de primera/última. Pensado para
usarse dentro de tablas o listas.

## Uso en HTML plano

```html
<script src="dist-libs/umd-core/CuPagination.umd.js"></script>

<cu-pagination
  id="paginacion"
  current-page="1"
  total-pages="10"
  total-items="100"
  color="primary"
  variant="soft"
></cu-pagination>

<script>
  const p = document.getElementById('paginacion');
  // el CE emite; la página visible la manda `current-page`
  p.addEventListener('update:currentPage', (e) => {
    p.currentPage = e.detail;
  });
</script>
```

<!-- demo:pagination-uso -->

`current-page` es la página actual, `total-pages` cuántas hay (si es `1` no renderiza nada) y
`total-items` el total de registros, que se usa para el texto «Mostrando X - Y de Z».

## Colores

`color` es un nombre semántico: se resuelve con los tokens del tema activo, así que el mismo
nombre se ve distinto en cada tema. Pinta el botón de la página activa.

```html
<cu-pagination current-page="5" total-pages="10" total-items="95" color="primary"></cu-pagination>
<cu-pagination current-page="5" total-pages="10" total-items="95" color="secondary"></cu-pagination>
<cu-pagination current-page="5" total-pages="10" total-items="95" color="neutral"></cu-pagination>
<cu-pagination current-page="5" total-pages="10" total-items="95" color="success"></cu-pagination>
<cu-pagination current-page="5" total-pages="10" total-items="95" color="warning"></cu-pagination>
<cu-pagination current-page="5" total-pages="10" total-items="95" color="danger"></cu-pagination>
```

<!-- demo:pagination-colores -->

## Variantes

`variant` es la variante de los botones: `outlined` (borde), `soft` (fondo tenue, el
**default**), `ghost` (transparente), `subtle` (tenue con borde) y `none` (sin estilo propio).

```html
<cu-pagination current-page="5" total-pages="10" total-items="95" color="primary" variant="outlined"></cu-pagination>
<cu-pagination current-page="5" total-pages="10" total-items="95" color="primary" variant="soft"></cu-pagination>
<cu-pagination current-page="5" total-pages="10" total-items="95" color="primary" variant="ghost"></cu-pagination>
<cu-pagination current-page="5" total-pages="10" total-items="95" color="primary" variant="subtle"></cu-pagination>
<cu-pagination current-page="5" total-pages="10" total-items="95" color="primary" variant="none"></cu-pagination>
```

<!-- demo:pagination-variantes -->

## Tamaño de página

`show-page-size` agrega el selector «Por página:», alimentado por `page-size-options`
(default `[5, 10, 20, 50]`) y con `items-per-page` como valor actual. Al elegir un tamaño
vuelve a la página 1.

```html
<cu-pagination
  id="paginacion"
  current-page="1"
  items-per-page="20"
  total-pages="10"
  total-items="195"
  show-page-size
></cu-pagination>

<script>
  const p = document.getElementById('paginacion');
  // `page-size-options` es un array: se asigna como propiedad, no como atributo
  p.pageSizeOptions = [10, 20, 50, 100];
  p.addEventListener('update:currentPage', (e) => { p.currentPage = e.detail; });
  p.addEventListener('update:itemsPerPage', (e) => { p.itemsPerPage = e.detail; });
</script>
```

<!-- demo:pagination-tamano-de-pagina -->

## Primera y última

`show-first-and-last` agrega los botones de salto a la primera y a la última página.

```html
<cu-pagination
  id="paginacion"
  current-page="10"
  total-pages="20"
  total-items="195"
  show-first-and-last
  color="primary"
></cu-pagination>

<script>
  const p = document.getElementById('paginacion');
  p.addEventListener('update:currentPage', (e) => { p.currentPage = e.detail; });
</script>
```

<!-- demo:pagination-primera-y-ultima -->

## Interacción

`update:currentPage` lleva el número de página nuevo y `update:itemsPerPage` el tamaño nuevo
(`number`), los dos en `e.detail`: la paginación no cambia sola, hay que reasignar la prop.

```html
<cu-pagination
  id="paginacion"
  current-page="1"
  items-per-page="10"
  total-pages="10"
  total-items="95"
  show-page-size
  color="primary"
></cu-pagination>

<script>
  const p = document.getElementById('paginacion');

  p.addEventListener('update:currentPage', (e) => {
    console.log('Página:', e.detail);
    p.currentPage = e.detail;
  });

  p.addEventListener('update:itemsPerPage', (e) => {
    console.log('Items por página:', e.detail);
    p.itemsPerPage = e.detail;
  });
</script>
```

<!-- demo:pagination-interaccion -->

## Atributos

<!--@include: ../partials/pagination/props-vanilla.md-->

> **Atributos en HTML:** Todas las props se convierten a kebab-case. Ej.: `current-page`, `items-per-page`, `page-size-options`, `show-page-size`, `show-first-and-last`.

> **`pageSizeOptions`:** se asigna como propiedad JS (`pagination.pageSizeOptions = [10, 25, 50]`). Como atributo HTML no se soporta (es un array).

## Eventos

<!--@include: ../partials/pagination/eventos.md-->

> Los eventos custom se escuchan con `addEventListener` y el payload está en `e.detail`.

## Slots

<!--@include: ../partials/pagination/slots.md-->

## Métodos expuestos

<!--@include: ../partials/pagination/metodos.md-->
