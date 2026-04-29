# Pagination - Componente de Paginación

**`<cu-pagination>`** es un componente de paginación para navegar entre múltiples páginas de datos.

## Importación

```html
<script src="../dist/vendor/vue-runtime.iife.js"></script>
<script src="../dist/cuPagination.umd.js"></script>
```

**Nota:** Este componente usa internamente `<cu-button>`, por lo que también necesitas importar el componente Button:

```html
<script src="../dist/cuButton.umd.js"></script>
```

## Uso Básico

```html
<cu-pagination 
  :total-pages="10" 
  :current-page="1"
  @update:current-page="handlePageChange"
/>
```

## Props

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `currentPage` | Number | `1` | Pública actual (1-indexado) |
| `totalPages` | Number | `1` | Total de páginas disponibles |
| `totalItems` | Number | `0` | Total de items (para mostrar información) |
| `itemsPerPage` | Number | `10` | Items por página |
| `showPageSize` | Boolean | `false` | Mostrar selector de items por página |
| `pageSizeOptions` | Array | `[5, 10, 20, 50]` | Opciones para el selector de items por página |
| `showFirstAndLast` | Boolean | `false` | Mostrar botones de primera y última página |

## Events

| Evento | Descripción |
|--------|-------------|
| `update:currentPage` | Se emite cuando cambia la página |
| `update:itemsPerPage` | Se emite cuando cambia el número de items por página |

## Casos de Uso

### Paginación básica

```html
<cu-pagination 
  :total-pages="5" 
  :current-page="currentPage"
  @update:current-page="setCurrentPage"
/>

<script>
let currentPage = 1;

function setCurrentPage(page) {
  currentPage = page;
  console.log('Página actual:', page);
  // Cargar datos para la página
}
</script>
```

### Paginación con información de items

```html
<cu-pagination 
  :total-pages="10" 
  :total-items="250"
  :items-per-page="10"
  :current-page="currentPage"
  @update:current-page="setCurrentPage"
/>
```

### Paginación con selector de tamaño

```html
<cu-pagination 
  :total-pages="20" 
  :total-items="200"
  :current-page="currentPage"
  :items-per-page="pageSize"
  :show-page-size="true"
  :page-size-options="[5, 10, 25, 50]"
  @update:current-page="setCurrentPage"
  @update:items-per-page="setPageSize"
/>

<script>
let currentPage = 1;
let pageSize = 10;

function setCurrentPage(page) {
  currentPage = page;
  loadData();
}

function setPageSize(size) {
  pageSize = size;
  loadData();
}

function loadData() {
  console.log(`Cargando página ${currentPage} con ${pageSize} items`);
}
</script>
```

### Paginación con primera y última página visibles

```html
<cu-pagination 
  :total-pages="100" 
  :current-page="currentPage"
  :show-first-and-last="true"
  @update:current-page="setCurrentPage"
/>
```

### Paginación con erklärt (puntos suspensivos)

```html
<cu-pagination 
  :total-pages="50" 
  :current-page="25"
  :show-first-and-last="true"
  @update:current-page="setCurrentPage"
/>
```

Cuando hay muchas páginas, el componente muestrageons automáticamente:
```
1 ... 23 24 25 26 27 ... 50
```

### Integración con Table

Ver [Table - Paginación](Table.md#paginación)

```html
<cu-table 
  :data="tableData"
  :pagination="true"
  :items-per-page="10"
  @update:current-page="loadPage"
/>

<cu-pagination 
  :total-pages="totalPages"
  :current-page="currentPage"
  @update:current-page="loadPage"
/>
```

## Uso con JavaScript Vanilla

```html
<cu-pagination 
  id="myPagination"
  total-pages="10"
  current-page="1"
/>

<script>
const pagination = document.getElementById('myPagination');

// Usando el evento custom event
pagination.addEventListener('update:current-page', function(e) {
  console.log('Nueva página:', e.detail);
  fetchData(e.detail);
});

// Actualizando props con JavaScript
pagination.setAttribute('total-pages', '15');
pagination.setAttribute('current-page', '3');
</script>
```

## Estilos CSS

El componente usa clases de UnoCSS. Para personalizar:

```css
cu-pagination {
  --uno-border-radius: 0.375rem;
}

cu-pagination button {
  --uno-transition: all 0.2s ease;
}
```

## Slots

El componente no acepta slots críticos, pero se puede personalizar mediante props.

## Funcionalidad interna

### Lógica de páginas visibles

El componente calcula automáticamente qué páginas mostrar:

- Si `totalPages <= 7`: muestra todas las páginas
- Si `totalPages > 7`: muestra la página actual con 1-2 páginas a cada lado
- Si `showFirstAndLast=true`: muestra la primera página, páginas intermedias y última página

### Ellipsis (...)

Cuando hay un salto grande entre páginas, se muestra `...` como separador.

## Componentes Relacionados

- [Button](Button.md) - Usado internamente para los botones de navegación
- [Table](Table.md) - Usa Pagination para navegar entre páginas de datos
