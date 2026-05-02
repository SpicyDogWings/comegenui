# Pagination - Componente de Paginación

**`<cu-pagination>`** es un componente de paginación para navegar entre múltiples páginas de datos. Soporta paginación básica, selector de tamaño de página y visualización de primera/última página.

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

| Prop | Tipo | Default | Valores válidos | Descripción |
|------|------|---------|----------------|-------------|
| `currentPage` | Number | `1` | >= 1 | Página actual (1-indexado) |
| `totalPages` | Number | `1` | >= 1 | Total de páginas disponibles |
| `totalItems` | Number | `0` | >= 0 | Total de items (para mostrar información "Mostrando X-Y de Z") |
| `itemsPerPage` | Number | `10` | >= 1 | Items por página (afecta el cálculo de startItem/endItem) |
| `showPageSize` | Boolean | `false` | `true`/`false` | Mostrar selector de items por página |
| `pageSizeOptions` | Array | `[5, 10, 20, 50]` | Array de números | Opciones para el selector de items por página |
| `showFirstAndLast` | Boolean | `false` | `true`/`false` | Mostrar botones de primera (1) y última página (totalPages) |

## Events

| Evento | Argumento | Descripción |
|--------|-----------|-------------|
| `update:currentPage` | `number` (nueva página) | Se emite cuando el usuario cambia de página |
| `update:itemsPerPage` | `number` (nuevo tamaño) | Se emite cuando el usuario cambia el tamaño de página |

## Slots

El componente no acepta slots. Todo el contenido se controla mediante props.

## Funciones Expuestas

El componente no expone métodos públicos. Todas las interacciones se manejan a través de eventos.

## Ejemplos por Propiedad

### Propiedad: `currentPage`

Controla y muestra la página actual:

```html
<cu-pagination 
  :total-pages="10" 
  :current-page="3"
  @update:current-page="handlePageChange"
/>

<script>
function handlePageChange(page) {
  console.log('Página cambiada a:', page);
}
</script>
```

### Propiedad: `totalPages`

Define el número total de páginas disponibles:

```html
<cu-pagination 
  :total-pages="20" 
  :current-page="1"
  @update:current-page="handlePageChange"
/>
```

### Propiedad: `totalItems`

Muestra información de rango de items (ej: "Mostrando 1-10 de 250"):

```html
<cu-pagination 
  :total-pages="25" 
  :total-items="250" 
  :items-per-page="10"
  :current-page="1"
  @update:current-page="handlePageChange"
/>
```

### Propiedad: `itemsPerPage`

Define cuántos items se muestran por página (afecta el cálculo de startItem/endItem):

```html
<cu-pagination 
  :total-pages="10" 
  :total-items="100" 
  :items-per-page="20"
  :current-page="1"
  @update:current-page="handlePageChange"
/>
```

### Propiedad: `showPageSize`

Habilita el selector para cambiar el número de items por página:

```html
<cu-pagination 
  :total-pages="10" 
  :total-items="100" 
  :items-per-page="10"
  :current-page="1"
  :show-page-size="true"
  @update:current-page="handlePageChange"
  @update:items-per-page="handlePageSizeChange"
/>

<script>
function handlePageChange(page) {
  console.log('Página:', page);
}

function handlePageSizeChange(size) {
  console.log('Tamaño de página:', size);
}
</script>
```

### Propiedad: `pageSizeOptions`

Personaliza las opciones del selector de tamaño de página:

```html
<cu-pagination 
  :total-pages="10" 
  :total-items="100" 
  :items-per-page="10"
  :current-page="1"
  :show-page-size="true"
  :page-size-options="[5, 15, 30, 100]"
  @update:current-page="handlePageChange"
  @update:items-per-page="handlePageSizeChange"
/>
```

### Propiedad: `showFirstAndLast`

Muestra botones para la primera (1) y última página:

```html
<cu-pagination 
  :total-pages="100" 
  :current-page="50"
  :show-first-and-last="true"
  @update:current-page="handlePageChange"
/>
```

## Ejemplos por Evento

### Evento: `update:currentPage`

Manejar el cambio de página:

```html
<cu-pagination 
  :total-pages="10" 
  :current-page="currentPage"
  @update:current-page="(page) => currentPage = page"
/>

<script>
let currentPage = 1;

// Cuando el usuario hace clic en un número de página o Anterior/Siguiente
// este evento se emite con el nuevo número de página
</script>
```

### Evento: `update:itemsPerPage`

Manejar el cambio de tamaño de página:

```html
<cu-pagination 
  :total-pages="10" 
  :total-items="100"
  :items-per-page="itemsPerPage"
  :current-page="currentPage"
  :show-page-size="true"
  @update:current-page="(page) => { currentPage = page; loadData(); }"
  @update:items-per-page="(size) => { itemsPerPage = size; currentPage = 1; loadData(); }"
/>

<script>
let currentPage = 1;
let itemsPerPage = 10;

function loadData() {
  console.log(`Cargando página ${currentPage} con ${itemsPerPage} items`);
  // fetch(`/api/data?page=${currentPage}&size=${itemsPerPage}`)
}
</script>
```

## Casos de Uso Combinados

### Paginación completa con todas las características

```html
<cu-pagination 
  :total-pages="totalPages" 
  :total-items="totalItems" 
  :items-per-page="itemsPerPage"
  :current-page="currentPage"
  :show-page-size="true"
  :page-size-options="[5, 10, 25, 50, 100]"
  :show-first-and-last="true"
  @update:current-page="handlePageChange"
  @update:items-per-page="handlePageSizeChange"
/>

<script>
let currentPage = 1;
let itemsPerPage = 10;
let totalPages = 50;
let totalItems = 500;

function handlePageChange(page) {
  currentPage = page;
  loadData();
}

function handlePageSizeChange(size) {
  itemsPerPage = size;
  currentPage = 1; // Resetear a primera página al cambiar tamaño
  totalPages = Math.ceil(totalItems / itemsPerPage);
  loadData();
}

function loadData() {
  // Lógica para cargar datos
}
</script>
```

### Paginación básica (mínima)

```html
<cu-pagination 
  :total-pages="5" 
  :current-page="1"
  @update:current-page="handlePageChange"
/>
```

### Paginación con información de items

Muestra "Mostrando X-Y de Z" automáticamente:

```html
<cu-pagination 
  :total-pages="10" 
  :total-items="250" 
  :items-per-page="25"
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
  currentPage = 1; // Volver a primera página
  loadData();
}

function loadData() {
  console.log(`Cargando: página=${currentPage}, tamaño=${pageSize}`);
}
</script>
```

### Paginación con primera y última página visibles

Útil cuando hay muchas páginas:

```html
<cu-pagination 
  :total-pages="100" 
  :current-page="currentPage"
  :show-first-and-last="true"
  @update:current-page="setCurrentPage"
/>

<script>
let currentPage = 50;

function setCurrentPage(page) {
  currentPage = page;
}
</script>
```

Visualización: `1 ... 48 49 50 51 52 ... 100`

### Paginación con JavaScript Vanilla

```html
<cu-pagination 
  id="myPagination"
  total-pages="10"
  current-page="1"
/>

<script>
const pagination = document.getElementById('myPagination');

// Escuchar evento de cambio de página
pagination.addEventListener('update:current-page', function(e) {
  console.log('Nueva página:', e.detail);
  fetchData(e.detail);
});

// Escuchar evento de cambio de tamaño (si showPageSize=true)
pagination.addEventListener('update:items-per-page', function(e) {
  console.log('Nuevo tamaño:', e.detail);
});

// Actualizar props desde JavaScript
pagination.setAttribute('total-pages', '15');
pagination.setAttribute('current-page', '3');
pagination.setAttribute('total-items', '300');
</script>
```

### Integración con Table

```html
<cu-table 
  :data="tableData"
  :columns="columns"
/>

<cu-pagination 
  :total-pages="totalPages"
  :total-items="totalItems"
  :items-per-page="itemsPerPage"
  :current-page="currentPage"
  :show-page-size="true"
  :show-first-and-last="true"
  @update:current-page="loadPage"
  @update:items-per-page="(size) => { itemsPerPage = size; loadPage(1); }"
/>

<script>
let currentPage = 1;
let itemsPerPage = 10;
let totalPages = 1;
let totalItems = 0;
let tableData = [];

function loadPage(page) {
  currentPage = page;
  fetch(`/api/data?page=${page}&size=${itemsPerPage}`)
    .then(res => res.json())
    .then(data => {
      tableData = data.items;
      totalItems = data.total;
      totalPages = Math.ceil(data.total / itemsPerPage);
    });
}

loadPage(1);
</script>
```

## Comportamiento Interno

### Lógica de páginas visibles

El componente calcula automáticamente qué páginas mostrar en la barra de navegación:

1. **Pocas páginas (totalPages <= 7)**: Muestra todas las páginas
   - Ejemplo: `1 2 3 4 5 6 7`

2. **Muchas páginas (totalPages > 7) con showFirstAndLast=false**:
   - Muestra la página actual ±1 página
   - Ejemplo: Si currentPage=5, muestra: `4 5 6`

3. **Muchas páginas (totalPages > 7) con showFirstAndLast=true**:
   - Muestra: `1 ... [páginas alrededor de currentPage] ... totalPages`
   - Las páginas alrededor de currentPage son: currentPage-1, currentPage, currentPage+1
   - Ejemplo: Si currentPage=50 y totalPages=100, muestra: `1 ... 49 50 51 ... 100`

### Ellipsis (...)

Los puntos suspensivos (`...`) aparecen automáticamente cuando hay un salto de 2 o más páginas entre los números mostrados.

### Cálculo de startItem y endItem

```javascript
startItem = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1
endItem = Math.min(currentPage * itemsPerPage, totalItems)
```

Ejemplo: currentPage=3, itemsPerPage=10, totalItems=250 → "Mostrando 21-30 de 250"

## Personalización CSS

El componente usa clases de UnoCSS. Para personalizar:

```css
/* Personalizar el contenedor */
cu-pagination {
  padding: 1rem;
  background-color: #f8f9fa;
}

/* Personalizar los botones */
cu-pagination button {
  transition: all 0.2s ease;
}

/* Personalizar el select */
cu-pagination select {
  border-radius: 0.375rem;
}

/* Personalizar el texto de información */
cu-pagination span {
  color: #6b7280;
}
```

## Notas Técnicas

- El componente usa internamente `<cu-button>` para los botones de navegación
- Los botones "Anterior" y "Siguiente" se deshabilitan automáticamente cuando currentPage es 1 o totalPages respectivamente
- Al cambiar el tamaño de página (itemsPerPage), el evento `update:currentPage` también se emite con valor 1 para resetear a la primera página
- El componente se oculta automáticamente si totalPages <= 1 y showPageSize=false

## Componentes Relacionados

- [Button](Button.md) - Usado internamente para los botones de navegación
- [Table](Table.md) - Usa Pagination para navegar entre páginas de datos
