# Table - Componente de Tabla de Datos

**`<cu-table>`** es un componente de tabla avanzado con soporte para búsqueda, paginación, celdas editables, badges y botones de acción.

## Importación

```html
<script src="../dist/vendor/vue-runtime.iife.js"></script>
<script src="../dist/cuTable.umd.js"></script>
```

**Nota:** Este componente usa internamente otros componentes, por lo que también necesitas importarlos:

```html
<script src="../dist/cuBadge.umd.js"></script>
<script src="../dist/cuButton.umd.js"></script>
<script src="../dist/cuInput.umd.js"></script>
<script src="../dist/cuTextarea.umd.js"></script>
<script src="../dist/cuPagination.umd.js"></script>
```

## Uso Básico

```html
<cu-table :data="myData" :columns="myColumns" />
```

## Props

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `data` | Array | `[]` | Array de objetos con los datos a mostrar |
| `columns` | Array | `[]` | Configuración de columnas. Si no se entrega, se extraen del primer objeto de data |
| `empty` | String | `"No hay datos que mostrar"` | Mensaje a mostrar cuando no hay datos |
| `searchPlaceholder` | String | `"Buscar..."` | Placeholder del campo de búsqueda |
| `searchEnabled` | Boolean | `false` | Habilitar campo de búsqueda |
| `searchFields` | Array | `[]` | Campos por los que buscar. Si está vacío, busca en todas las columnas |
| `searchValue` | String | `""` | Valor inicial del campo de búsqueda |
| `pagination` | Boolean | `false` | Habilitar paginación |
| `itemsPerPage` | Number | `10` | Items por página |
| `showPageSize` | Boolean | `false` | Mostrar selector de items por página en la paginación |
| `pageSizeOptions` | Array | `[5, 10, 20, 50]` | Opciones para el selector de items por página |

## Events

| Evento | Descripción |
|--------|-------------|
| `update:search` | Se emite cuando cambia el valor de búsqueda |
| `update:currentPage` | Se emite cuando cambia la página |
| `update:itemsPerPage` | Se emite cuando cambia el número de items por página |

## Métodos Expuestos

El componente expone métodos para manipular los datos:

### `updateRow(index, newData)`

Actualiza una fila específica.

```javascript
const table = document.querySelector('cu-table');
table.updateRow(0, { name: 'Nuevo nombre' });
```

### `getData(filterFn?)`

Obtiene los datos de la tabla, opcionalmente filtrados.

```javascript
const allData = table.getData();
const filteredData = table.getData(item => item.active);
```

### `getRow(index)`

Obtiene una fila específica por índice.

```javascript
const row = table.getRow(0);
```

### `removeRow(index)`

Elimina una fila por su índice. Devuelve `true` si la eliminación fue exitosa, `false` si el índice no es válido.

```javascript
// Eliminar la primera fila
const success = table.removeRow(0);
if (success) {
  console.log('Fila eliminada');
}

// Eliminar la última fila
const lastIndex = table.getData().length - 1;
if (lastIndex >= 0) {
  table.removeRow(lastIndex);
}
```

### `addRow(newItem)`

Añade una nueva fila al final de la tabla. El objeto debe tener la misma estructura (mismas claves) que los datos existentes. Devuelve `true` si la fila fue añadida, `false` si la estructura no coincide.

```javascript
const newItem = { id: 5, name: 'Nuevo Usuario', email: 'nuevo@test.com' };
const success = table.addRow(newItem);
if (success) {
  console.log('Fila añadida');
} else {
  console.error('Error: estructura de datos no válida');
}
```

### `pushData(items)`

Añade múltiples filas a la tabla. Todos los objetos deben tener la misma estructura (mismas claves) que los datos existentes. Devuelve `true` si todas las filas fueron añadidas, `false` si alguna estructura no coincide.

```javascript
const newItems = [
  { id: 6, name: 'Pedro Martínez', email: 'pedro@test.com' },
  { id: 7, name: 'Laura Hernández', email: 'laura@test.com' }
];
const success = table.pushData(newItems);
if (success) {
  console.log('Filas añadidas');
} else {
  console.error('Error: alguna fila tiene estructura no válida');
}
```

> **Nota sobre validación:** Si la tabla está vacía (no hay datos), `addRow` y `pushData` añadirán los elementos sin validación de estructura. Una vez hay datos en la tabla, todos los nuevos elementos deben coincidir con las claves del primer elemento.

## Estructura de Columnas

Cada columna es un objeto con las siguientes propiedades:

| Prop | Tipo | Descripción |
|------|------|-------------|
| `key` | String | Clave del campo en el objeto de datos (obligatorio) |
| `label` | String | Etiqueta a mostrar en el header |
| `cell` | Function | Función personalizada para renderizar el contenido de la celda |
| `badges` | Function | Función que devuelve un array de [BadgeConfig](#badgeconfig) para mostrar badges |
| `buttons` | Function | Función que devuelve un array de [ButtonConfig](#buttonconfig) para mostrar botones |
<<<<<<< HEAD
| `editable` | Boolean/RegExp/Function | Permite editar la celda. Si es RegExp, valida el valor. Si es Function, recibe el valor y debe devolver `true` para aceptar o `false` para rechazar |
||||||| f9f5597
| `editable` | Boolean/RegExp | Permite editar la celda. Si es RegExp, valida el valor |
=======
| `editable` | Boolean/RegExp | Permite editar la celda. Si es RegExp, valida el valor |
| `validator` | Function | Función de validación personalizada: `(value: string, row: object) => boolean`. Si devuelve `false`, la edición se cancela |
>>>>>>> components/table
| `inputType` | String | Tipo de input para edición (`'input'` o `'textarea'`) |
| `singleClick` | Boolean | `false` | Habilitar edición con un solo clic (por defecto es doble clic) |

### BadgeConfig

```typescript
interface BadgeConfig {
  value: string;      // Texto del badge
  color?: string;    // Color: primary, neutral, success, warning, danger
  variant?: string;  // Variante: solid, outlined, soft, ghost, subtle
}
```

### ButtonConfig

```typescript
interface ButtonConfig {
  label: string;      // Texto del botón
  color?: string;    // Color: primary, neutral, success, warning, danger
  variant?: string;  // Variante: solid, outlined, soft, ghost, subtle, link
  to?: string;       // URL para enlace
  target?: string;   // Target para el enlace: _self, _blank, _parent, _top
  onClick?: () => void;  // Función a ejecutar al hacer clic
  html?: boolean;    // Si es true, el label se renderiza como HTML
}
```

## Función `cell:` para Columnas

La función `cell` permite personalizar cómo se muestra el contenido de una celda.

### Ejemplo 1: Formatear valores

```javascript
const columns = [
  {
    key: 'price',
    label: 'Precio',
    cell: (row) => `$${row.price.toFixed(2)}`
  }
];
```

### Ejemplo 2: Mostrar múltiples valores

```javascript
const columns = [
  {
    key: 'user',
    label: 'Usuario',
    cell: (row) => `${row.firstName} ${row.lastName}`
  }
];
```

### Ejemplo 3: Condicional

```javascript
const columns = [
  {
    key: 'status',
    label: 'Estado',
    cell: (row) => row.active ? 'Activo' : 'Inactivo'
  }
];
```

### Ejemplo 4: Retornar array (para múltiples líneas)

```javascript
const columns = [
  {
    key: 'address',
    label: 'Dirección',
    cell: (row) => [row.street, row.city, row.country]
  }
];
```

## Función `badges:` para Columnas

La función `badges` permite mostrar múltiples badges en una celda.

### Ejemplo 1: Badge de status único

```javascript
const columns = [
  {
    key: 'status',
    label: 'Estado',
    badges: (row, index) => [
      { value: row.status, color: getStatusColor(row.status) }
    ]
  }
];

function getStatusColor(status) {
  switch(status) {
    case 'active': return 'success';
    case 'pending': return 'warning';
    case 'inactive': return 'danger';
    default: return 'neutral';
  }
}
```

### Ejemplo 2: Múltiples badges

```javascript
const columns = [
  {
    key: 'tags',
    label: 'Etiquetas',
    badges: (row, index) => row.tags.map(tag => (
      { value: tag, color: 'primary', variant: 'ghost' }
    ))
  }
];
```

### Ejemplo 3: Badges condicionales

```javascript
const columns = [
  {
    key: 'priority',
    label: 'Prioridad',
    badges: (row, index) => {
      if (row.highPriority) {
        return [{ value: 'Alta', color: 'danger' }];
      }
      if (row.mediumPriority) {
        return [{ value: 'Media', color: 'warning' }];
      }
      return [{ value: 'Baja', color: 'success' }];
    }
  }
];
```

## Función `buttons:` para Columnas

La función `buttons` permite mostrar botones de acción en una celda.

### Ejemplo 1: Botones de acciones básicas

```javascript
const columns = [
  {
    key: 'actions',
    label: 'Acciones',
    buttons: (row, index) => [
      {
        label: 'Editar',
        color: 'primary',
        variant: 'ghost',
        onClick: () => editRow(row)
      },
      {
        label: 'Eliminar',
        color: 'danger',
        variant: 'ghost',
        onClick: () => deleteRow(row)
      }
    ]
  }
];

function editRow(row) {
  console.log('Editando:', row);
}

function deleteRow(row) {
  if (confirm('¿Estás seguro?')) {
    console.log('Eliminando:', row);
  }
}
```

### Ejemplo 2: Botones con iconos

```javascript
const columns = [
  {
    key: 'actions',
    label: 'Acciones',
    buttons: (row, index) => [
      {
        label: '<span>✏️</span> Editar',
        color: 'primary',
        variant: 'ghost',
        html: true,
        onClick: () => editRow(row)
      },
      {
        label: '<span>🗑️</span> Eliminar',
        color: 'danger',
        variant: 'ghost',
        html: true,
        onClick: () => deleteRow(row)
      }
    ]
  }
];
```

### Ejemplo 3: Botones con enlaces

```javascript
const columns = [
  {
    key: 'details',
    label: 'Detalles',
    buttons: (row, index) => [
      {
        label: 'Ver',
        color: 'primary',
        variant: 'link',
        to: `/items/${row.id}`,
        target: '_blank'
      }
    ]
  }
];
```

### Ejemplo 4: Botones condicionales

```javascript
const columns = [
  {
    key: 'actions',
    label: 'Acciones',
    buttons: (row, index) => {
      const buttons = [];
      
      if (row.canEdit) {
        buttons.push({
          label: 'Editar',
          color: 'primary',
          onClick: () => editRow(row)
        });
      }
      
      if (row.canDelete) {
        buttons.push({
          label: 'Eliminar',
          color: 'danger',
          onClick: () => deleteRow(row)
        });
      }
      
      if (row.canApprove) {
        buttons.push({
          label: 'Aprobar',
          color: 'success',
          onClick: () => approveRow(row)
        });
      }
      
      return buttons;
    }
  }
];
```

## Celdas Editables

Las celdas pueden ser editables configuran`do la propiedad `editable` en la columna.

### Ejemplo 1: Edición básica

```javascript
const columns = [
  {
    key: 'name',
    label: 'Nombre',
    editable: true
  }
];
```

### Ejemplo 2: Validación con RegExp

```javascript
const columns = [
  {
    key: 'email',
    label: 'Correo',
    editable: /^[^@]+@[^@]+\.[^@]+$/,  // Validar formato de email
    inputType: 'input'
  }
];
```

### Ejemplo 3: Usando textarea para edición

```javascript
const columns = [
  {
    key: 'description',
    label: 'Descripción',
    editable: true,
    inputType: 'textarea',
    singleClick: true  // Edaditar con un solo clic
  }
];
```

### Ejemplo 4: edición condicional

```javascript
const columns = [
  {
    key: 'name',
    label: 'Nombre',
    editable: (row) => row.canEdit  // Solo editable si el dato tiene permisos
  }
];
```

<<<<<<< HEAD
### Ejemplo 5: Validación con función callback

Puedes pasar una función que reciba el valor editado y devuelva `true` para aceptar o `false` para rechazar:

```javascript
const columns = [
  {
    key: 'email',
    label: 'Correo Electrónico',
    editable: (value) => {
      // Validación personalizada
      return value.includes('@') && value.includes('.');
    }
  },
  {
    key: 'age',
    label: 'Edad',
    editable: (value) => {
      const age = parseInt(value);
      return !isNaN(age) && age >= 18 && age <= 120;
    }
  }
];
```

> **Nota:** La función callback recibe el valor editado (string) y debe devolver un booleano. Si devuelve `false`, la edición se cancela y el valor no se guarda.
||||||| f9f5597
=======
### Ejemplo 5: Validación personalizada con `validator`

Usa `validator` para validar el valor de la celda basado en el contexto completo de la fila:

```javascript
const columns = [
  {
    key: 'name',
    label: 'Producto',
    editable: true
  },
  {
    key: 'stock',
    label: 'Stock',
    editable: true
  },
  {
    key: 'count',
    label: 'Cantidad',
    editable: true,
    validator: (value, row) => {
      const num = parseInt(value, 10);
      // Validar que count es un número válido y no excede el stock
      return !isNaN(num) && num >= 0 && num <= row.stock;
    }
  }
];
```

La función `validator` recibe dos parámetros:
- `value`: El nuevo valor ingresado (siempre es string)
- `row`: El objeto completo de la fila siendo editada

Si la función devuelve `false`, la edición se cancela y el valor no se guarda.

### Ejemplo 6: Validación con expresiones regulares Y validator

Puedes combinar `editable` con RegExp para validación de formato y `validator` para validación lógica:

```javascript
const columns = [
  {
    key: 'email',
    label: 'Correo',
    editable: /^[^@]+@[^@]+\.[^@]+$/,  // Validar formato de email
    validator: (value, row) => {
      // Validar que el dominio coincide con el de la empresa
      return value.endsWith('@empresa.com');
    }
  }
];
```

> **Nota:** El orden de validación es: primero se valida el RegExp (si `editable` es un RegExp), luego se ejecuta el `validator`. Si cualquiera falla, la edición se cancela.
>>>>>>> components/table

## Búsqueda

El componente soporta búsqueda en múltiples campos.

### Ejemplo 1: Búsqueda básica

```html
<cu-table 
  :data="data" 
  :columns="columns"
  :search-enabled="true"
  @update:search="handleSearch"
/>

<script>
const searchValue = '';

function handleSearch(value) {
  searchValue = value;
  // Filtrar datos manualmente si es necesario
}
</script>
```

### Ejemplo 2: Búsqueda en campos específicos

```html
<cu-table 
  :data="data" 
  :columns="columns"
  :search-enabled="true"
  :search-fields="['name', 'email', 'phone']"
/>
```

### Ejemplo 3: Búsqueda con valor inicial

```html
<cu-table 
  :data="data" 
  :columns="columns"
  :search-enabled="true"
  :search-value="initialSearchValue"
/>
```

## Paginación

### Ejemplo 1: Paginación básica

```html
<cu-table 
  :data="data" 
  :columns="columns"
  :pagination="true"
  :items-per-page="10"
  @update:current-page="handlePageChange"
/>

<script>
function handlePageChange(page) {
  console.log('Cambiando a página:', page);
  // Cargar datos para la página
}
</script>
```

### Ejemplo 2: Paginación con selector de tamaño

```html
<cu-table 
  :data="data" 
  :columns="columns"
  :pagination="true"
  :items-per-page="10"
  :show-page-size="true"
  :page-size-options="[5, 10, 25, 50, 100]"
  @update:current-page="handlePageChange"
  @update:items-per-page="handlePageSizeChange"
/>

<script>
function handlePageSizeChange(size) {
  console.log('Nuevo tamaño:', size);
}
</script>
```

## Slots

El componente soporta varios slots para personalización:

### Slot `empty`

Personaliza el mensaje cuando no hay datos:

```html
<cu-table :data="[]" :columns="columns">
  <template #empty>
    <div class="text-center p-8">
      <p>No se encontraron resultados</p>
      <cu-button color="primary" onclick="loadData()">
        Recargar
      </cu-button>
    </div>
  </template>
</cu-table>
```

### Slot `header-{key}`

Personaliza el header de una columna:

```html
<cu-table :data="data" :columns="columns">
  <template #header-name="{ column }">
    <div class="flex items-center gap-2">
      <span>Nombre</span>
      <span>ℹ️</span>
    </div>
  </template>
</cu-table>
```

### Slot `cell-{key}`

Personaliza el contenido de una celda para una columna específica:

```html
<cu-table :data="data" :columns="columns">
  <template #cell-status="{ row, column, index }">
    <cu-badge :color="getStatusColor(row.status)">
      {{ row.status }}
    </cu-badge>
  </template>
</cu-table>
```

## Ejemplos Complejos

### Ejemplo 1: Tabla con todas las características

```javascript
const data = [
  { id: 1, name: 'Juan Pérez', email: 'juan@ejemplo.com', status: 'active', tags: ['admin', 'user'] },
  { id: 2, name: 'María García', email: 'maria@ejemplo.com', status: 'pending', tags: ['user'] },
  { id: 3, name: 'Carlos López', email: 'carlos@ejemplo.com', status: 'inactive', tags: ['guest'] }
];

const columns = [
  {
    key: 'id',
    label: 'ID',
    cell: (row) => `#${row.id}`
  },
  {
    key: 'name',
    label: 'Nombre',
    editable: true
  },
  {
    key: 'email',
    label: 'Correo',
    editable: /^[^@]+@[^@]+\.[^@]+$/,
    inputType: 'input'
  },
  {
    key: 'status',
    label: 'Estado',
    badges: (row) => [
      { value: row.status, color: getStatusColor(row.status) }
    ]
  },
  {
    key: 'tags',
    label: 'Etiquetas',
    badges: (row) => row.tags.map(tag => (
      { value: tag, color: 'primary', variant: 'ghost' }
    ))
  },
  {
    key: 'actions',
    label: 'Acciones',
    buttons: (row) => [
      {
        label: '<span>✏️</span>',
        color: 'primary',
        variant: 'ghost',
        html: true,
        onClick: () => editRow(row)
      },
      {
        label: '<span>🗑️</span>',
        color: 'danger',
        variant: 'ghost',
        html: true,
        onClick: () => deleteRow(row)
      }
    ]
  }
];

function getStatusColor(status) {
  const colors = {
    active: 'success',
    pending: 'warning',
    inactive: 'danger'
  };
  return colors[status] || 'neutral';
}

function editRow(row) {
  console.log('Editando:', row);
}

function deleteRow(row) {
  console.log('Eliminando:', row);
}
</script>

<cu-table 
  :data="data" 
  :columns="columns"
  :search-enabled="true"
  :search-fields="['name', 'email']"
  :pagination="true"
  :items-per-page="5"
  :show-page-size="true"
  @update:search="handleSearch"
  @update:current-page="handlePageChange"
/>
```

### Ejemplo 2: Tabla con datos de API

```javascript
const data = [];
const columns = [
  { key: 'id', label: 'ID' },
  { key: 'title', label: 'Título' },
  { key: 'completed', label: 'Completado', cell: (row) => row.completed ? '✓' : '✗' }
];

async function loadData(page = 1, search = '') {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/todos?_page=${page}&_limit=10&q=${search}`
  );
  data = await response.json();
}

// Cargar datos iniciales
loadData();
</script>

<cu-table 
  :data="data" 
  :columns="columns"
  :search-enabled="true"
  :pagination="true"
  @update:search="(value) => loadData(1, value)"
  @update:current-page="(page) => loadData(page, searchValue)"
/>
```

## Estilos CSS

```css
cu-table {
  --uno-border-radius: 0.375rem;
  --uno-border-color: #e5e7eb;
}

cu-table table {
  --uno-border-spacing: 0;
}

cu-table th {
  --uno-bg: #374151;
  --uno-text-color: #f9fafb;
}

cu-table tbody tr:hover {
  --uno-bg: #f3f4f6;
}
```

## Componentes Relacionados

- [Badge](Badge.md) - Usado para mostrar status en celdas
- [Button](Button.md) - Usado para acciones en celdas
- [Input](Input.md) - Usado para celdas editables
- [Textarea](Textarea.md) - Usado para celdas editables de texto largo
- [Pagination](Pagination.md) - Usado para la paginación
