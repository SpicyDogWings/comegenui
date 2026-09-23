# `<cu-pagination>`

Paginación numérica con soporte para selector de tamaño de página y botones de primera/última. Pensado para usarse dentro de tablas o listas.

[← Volver](../SKILL.md)

---

---

## Uso en HTML plano

```html
<script src="dist/CuPagination.umd.js"></script>

<cu-pagination
  current-page="1"
  total-pages="10"
  total-items="100"
  color="primary"
  variant="soft"
  show-page-size
  id="paginacion"
></cu-pagination>

<script>
  // Cambiar opciones del selector dinámicamente
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

---

## Ejemplo con todos los controles

```html
<cu-pagination
  current-page="1"
  total-pages="20"
  total-items="195"
  items-per-page="10"
  show-page-size
  show-first-and-last
  color="primary"
  variant="outlined"
></cu-pagination>
```

---

## Atributos booleanos en HTML

```html
<cu-pagination
  show-page-size
  show-first-and-last
  total-pages="5"
></cu-pagination>
```

## Props

| Prop | Tipo | Default | Descripción |
|------|------|------|------|
| `theme` | `string` | `""` | Tema: `light`, `dark`, `sigacadv2` (hereda de `<html data-theme>` si se omite) |
| `color` | `string` | `"neutral"` | Color semántico: `primary`, `neutral`, `success`, `warning`, `danger` |
| `variant` | `string` | `"soft"` | `outlined`, `soft`, `ghost`, `subtle`, `none` |
| `currentPage` | `number` | `1` | Página actual (atributo HTML: `current-page`) |
| `totalPages` | `number` | `1` | Total de páginas (atributo HTML: `total-pages`) |
| `totalItems` | `number` | `0` | Total de items, útil para mostrar "X–Y de Z" (atributo HTML: `total-items`) |
| `itemsPerPage` | `number` | `10` | Items por página (atributo HTML: `items-per-page`) |
| `showPageSize` | `boolean` | `false` | Muestra el selector de tamaño de página (atributo HTML: `show-page-size`) |
| `pageSizeOptions` | `number[]` | `[5, 10, 20, 50]` | Opciones del selector (atributo HTML: `page-size-options`) |
| `showFirstAndLast` | `boolean` | `false` | Muestra botones "primera" y "última" página (atributo HTML: `show-first-and-last`) |
| `hightContrast` | `boolean` | `false` | Modo de alto contraste |

> **Atributos en HTML:** Todas las props se convierten a kebab-case. Ej.: `current-page`, `items-per-page`, `page-size-options`, `show-page-size`, `show-first-and-last`.

> **`pageSizeOptions`:** se asigna como propiedad JS (`pagination.pageSizeOptions = [10, 25, 50]`). Como atributo HTML no se soporta (es un array).

## Eventos

| Evento | Payload (`e.detail`) | Descripción |
|------|------|------|
| `update:currentPage` | `number` | Se emite cuando cambia la página actual |
| `update:itemsPerPage` | `number` | Se emite cuando cambia el tamaño de página |

> Los eventos custom se escuchan con `addEventListener` y el payload está en `e.detail`.

## Slots

Ninguno.

## Métodos expuestos

No expone métodos. El control se hace via props y eventos.
