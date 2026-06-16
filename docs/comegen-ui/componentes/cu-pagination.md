# `<cu-pagination>`

Paginación para tablas o listas.

[← Volver](../SKILL.md)

---

## Props

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `theme` | `string` | `""` | Tema |
| `color` | `string` | `"neutral"` | Color semántico |
| `variant` | `string` | `"soft"` | `outlined`, `soft`, `ghost`, `subtle` |
| `current-page` | `number` | `1` | Página actual |
| `total-pages` | `number` | `1` | Total de páginas |
| `total-items` | `number` | `0` | Total de items |
| `items-per-page` | `number` | `10` | Items por página |
| `show-page-size` | `boolean` | `false` | Muestra selector de items por página |
| `page-size-options` | `array` | `[5,10,20,50]` | Opciones del selector |
| `show-first-and-last` | `boolean` | `false` | Muestra botones de primera/última página |

## Eventos

| Evento | Payload | Descripción |
|--------|---------|-------------|
| `update:currentPage` | `number` | Cambio de página |
| `update:itemsPerPage` | `number` | Cambio de items por página |

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
  document.getElementById('paginacion').addEventListener('update:currentPage', (e) => {
    console.log('Página:', e.detail);
  });
  document.getElementById('paginacion').addEventListener('update:itemsPerPage', (e) => {
    console.log('Items por página:', e.detail);
  });
</script>
```

> **Nota:** Los eventos de Custom Elements usan `e.detail` para acceder al payload.
