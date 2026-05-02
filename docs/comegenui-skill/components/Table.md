# Table - Componente de Tabla de Datos

**`<cu-table>`** es un componente de tabla avanzado con soporte para búsqueda, paginación, celdas editables, badges, botones de acción, validación y renderizado personalizado. Es el componente más completo para visualización y manipulación de datos tabulares.

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

| Prop | Tipo | Default | Valores válidos | Descripción |
|------|------|---------|----------------|-------------|
| `data` | Array | `[]` | Array de objetos | Array de objetos con los datos a mostrar |
| `columns` | Array | `[]` | Array de [Column](#estructura-de-columnas) | Configuración de columnas. Si está vacío, se extraen del primer objeto de data |
| `empty` | String | `"No hay datos que mostrar"` | - | Mensaje a mostrar cuando no hay datos |
| `searchPlaceholder` | String | `"Buscar..."` | - | Placeholder del campo de búsqueda |
| `searchEnabled` | Boolean | `false` | `true`/`false` | Habilitar campo de búsqueda |
| `searchFields` | Array | `[]` | Array de strings (claves de columnas) | Campos por los que buscar. Si está vacío, busca en todas las columnas |
| `searchValue` | String | `""` | - | Valor inicial del campo de búsqueda |
| `pagination` | Boolean | `false` | `true`/`false` | Habilitar paginación |
| `itemsPerPage` | Number | `10` | >= 1 | Items por página |
| `showPageSize` | Boolean | `false` | `true`/`false` | Mostrar selector de items por página en la paginación |
| `pageSizeOptions` | Array | `[5, 10, 20, 50]` | Array de números | Opciones para el selector de items por página |

## Events

| Evento | Argumento | Descripción |
|--------|-----------|-------------|
| `update:search` | `string` (valor de búsqueda) | Se emite cuando cambia el valor de búsqueda |
| `update:currentPage` | `number` (número de página) | Se emite cuando cambia la página |
| `update:itemsPerPage` | `number` (nuevo tamaño) | Se emite cuando cambia el número de items por página |

## Slots

| Nombre | Descripción | Props disponibles |
|--------|-------------|-------------------|
| `empty` | Contenido a mostrar cuando no hay datos | - |
| `header-{key}` | Personaliza el header de una columna específica | `{ column }` |
| `cell-{key}` | Personaliza el contenido de una celda para una columna específica | `{ row, column, index }` |

## Métodos Expuestos

El componente expone métodos para manipular los datos programáticamente:

| Método | Argumentos | Retorno | Descripción |
|--------|------------|---------|-------------|
| `updateRow(index, newData)` | `number`, `object` | `void` | Actualiza una fila específica |
| `getData(filterFn?)` | `function?` (opcional) | `Array` | Obtiene los datos de la tabla, opcionalmente filtrados |
| `getRow(index)` | `number` | `object \| undefined` | Obtiene una fila específica por índice |
| `removeRow(index)` | `number` | `boolean` | Elimina una fila por su índice. Devuelve `true` si fue exitosa |
| `addRow(newItem)` | `object` | `boolean` | Añade una nueva fila. Devuelve `true` si la estructura coincide |
| `pushData(items)` | `Array` | `boolean` | Añade múltiples filas. Devuelve `true` si todas las estructuras coinciden |

## Estructura de Columnas

Cada columna es un objeto con las siguientes propiedades:

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `key` | String | - | **Obligatorio**. Clave del campo en el objeto de datos |
| `label` | String | `key` | Etiqueta a mostrar en el header |
| `cell` | Function | - | Función personalizada: `(row) => string \| string[]` para renderizar el contenido |
| `badges` | Function | - | Función: `(row, index) => BadgeConfig[]` para mostrar badges |
| `buttons` | Function | - | Función: `(row, index) => ButtonConfig[]` para mostrar botones |
| `editable` | Boolean/RegExp | `false` | Permite editar la celda. Si es RegExp, valida el formato |
| `validator` | Function | - | `(value: string, row: object) => boolean` - Validación personalizada |
| `inputType` | String | `'input'` | Tipo de input para edición: `'input'` o `'textarea'` |
| `singleClick` | Boolean | `false` | Habilitar edición con un solo clic (por defecto es doble clic) |

### Interfaces de Configuración

#### BadgeConfig

```typescript
interface BadgeConfig {
  value: string;      // Texto del badge
  color?: string;    // Color: primary, neutral, success, warning, danger
  variant?: string;  // Variante: solid, outlined, soft, ghost, subtle
}
```

#### ButtonConfig

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

---

## Ejemplos por Propiedad

### Propiedad: `data`

Datos a mostrar en la tabla:

```html
<cu-table 
  :data="[
    { id: 1, name: 'Juan', age: 25 },
    { id: 2, name: 'María', age: 30 },
    { id: 3, name: 'Carlos', age: 22 }
  ]"
/>
```

### Propiedad: `columns`

Definición de columnas:

```html
<cu-table 
  :data="users"
  :columns="[
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Nombre' },
    { key: 'age', label: 'Edad' }
  ]"
/>

<script>
const users = [
  { id: 1, name: 'Juan', age: 25 },
  { id: 2, name: 'María', age: 30 }
];
</script>
```

### Propiedad: `empty`

Mensaje personalizado cuando no hay datos:

```html
<cu-table :data="[]" :columns="columns" empty="No hay usuarios registrados" />
```

### Propiedad: `searchPlaceholder`

Placeholder del campo de búsqueda:

```html
<cu-table 
  :data="data" 
  :columns="columns"
  :search-enabled="true"
  search-placeholder="Buscar por nombre o email..."
/>
```

### Propiedad: `searchEnabled`

Habilitar búsqueda:

```html
<cu-table 
  :data="data" 
  :columns="columns"
  :search-enabled="true"
/>
```

### Propiedad: `searchFields`

Campos específicos para buscar:

```html
<cu-table 
  :data="data" 
  :columns="columns"
  :search-enabled="true"
  :search-fields="['name', 'email']"
/>
```

### Propiedad: `searchValue`

Valor inicial de búsqueda:

```html
<cu-table 
  :data="data" 
  :columns="columns"
  :search-enabled="true"
  search-value="Juan"
/>
```

### Propiedad: `pagination`

Habilitar paginación:

```html
<cu-table 
  :data="data" 
  :columns="columns"
  :pagination="true"
/>
```

### Propiedad: `itemsPerPage`

Número de items por página:

```html
<cu-table 
  :data="data" 
  :columns="columns"
  :pagination="true"
  :items-per-page="20"
/>
```

### Propiedad: `showPageSize`

Mostrar selector de tamaño de página:

```html
<cu-table 
  :data="data" 
  :columns="columns"
  :pagination="true"
  :show-page-size="true"
/>
```

### Propiedad: `pageSizeOptions`

Opciones para el selector de tamaño:

```html
<cu-table 
  :data="data" 
  :columns="columns"
  :pagination="true"
  :show-page-size="true"
  :page-size-options="[5, 15, 30, 100]"
/>
```

---

## Ejemplos por Evento

### Evento: `update:search`

Manejar cambios en la búsqueda:

```html
<cu-table 
  :data="data" 
  :columns="columns"
  :search-enabled="true"
  @update:search="handleSearch"
/>

<script>
function handleSearch(value) {
  console.log('Buscando:', value);
  // Puedes filtrar datos manualmente o enviar a API
}
</script>
```

### Evento: `update:currentPage`

Manejar cambios de página:

```html
<cu-table 
  :data="data" 
  :columns="columns"
  :pagination="true"
  @update:current-page="handlePageChange"
/>

<script>
function handlePageChange(page) {
  console.log('Página:', page);
  // Cargar datos para la página
}
</script>
```

### Evento: `update:itemsPerPage`

Manejar cambios en el tamaño de página:

```html
<cu-table 
  :data="data" 
  :columns="columns"
  :pagination="true"
  :show-page-size="true"
  @update:items-per-page="handlePageSizeChange"
/>

<script>
function handlePageSizeChange(size) {
  console.log('Tamaño de página:', size);
  // Recalcular paginación
}
</script>
```

---

## Ejemplos por Método

### Método: `updateRow(index, newData)`

Actualizar una fila específica:

```html
<cu-table id="myTable" :data="data" :columns="columns" />
<cu-button onclick="updateFirstRow()">Actualizar Primera Fila</cu-button>

<script>
const table = document.getElementById('myTable');

function updateFirstRow() {
  table.updateRow(0, { name: 'Nuevo Nombre', age: 30 });
}
</script>
```

### Método: `getData(filterFn?)`

Obtener todos los datos:

```html
<cu-table id="myTable" :data="data" :columns="columns" />
<cu-button onclick="getAllData()">Obtener Datos</cu-button>

<script>
const table = document.getElementById('myTable');

function getAllData() {
  const allData = table.getData();
  console.log('Todos los datos:', allData);
  
  // Con filtro
  const activeOnly = table.getData(item => item.active);
  console.log('Datos activos:', activeOnly);
}
</script>
```

### Método: `getRow(index)`

Obtener una fila específica:

```html
<cu-table id="myTable" :data="data" :columns="columns" />
<cu-button onclick="getFirstRow()">Obtener Primera Fila</cu-button>

<script>
const table = document.getElementById('myTable');

function getFirstRow() {
  const row = table.getRow(0);
  console.log('Primera fila:', row);
}
</script>
```

### Método: `removeRow(index)`

Eliminar una fila:

```html
<cu-table id="myTable" :data="data" :columns="columns" />
<cu-button onclick="removeFirstRow()">Eliminar Primera Fila</cu-button>

<script>
const table = document.getElementById('myTable');

function removeFirstRow() {
  const success = table.removeRow(0);
  if (success) {
    console.log('Fila eliminada');
  } else {
    console.log('Índice inválido');
  }
}
</script>
```

### Método: `addRow(newItem)`

Añadir una nueva fila:

```html
<cu-table id="myTable" :data="data" :columns="columns" />
<cu-button onclick="addNewRow()">Añadir Fila</cu-button>

<script>
const table = document.getElementById('myTable');

function addNewRow() {
  const newItem = { id: 4, name: 'Ana', age: 28 };
  const success = table.addRow(newItem);
  if (success) {
    console.log('Fila añadida');
  } else {
    console.log('Error: estructura no válida');
  }
}
</script>
```

### Método: `pushData(items)`

Añadir múltiples filas:

```html
<cu-table id="myTable" :data="data" :columns="columns" />
<cu-button onclick="addMultipleRows()">Añadir Múltiples Filas</cu-button>

<script>
const table = document.getElementById('myTable');

function addMultipleRows() {
  const newItems = [
    { id: 4, name: 'Ana', age: 28 },
    { id: 5, name: 'Pedro', age: 35 }
  ];
  const success = table.pushData(newItems);
  if (success) {
    console.log('Filas añadidas');
  } else {
    console.log('Error: alguna fila tiene estructura no válida');
  }
}
</script>
```

---

## Ejemplos por Estructura de Columnas

### Columna: `key` y `label`

Columnas básicas:

```html
<cu-table 
  :data="data"
  :columns="[
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Nombre Completo' },
    { key: 'email', label: 'Correo Electrónico' }
  ]"
/>
```

### Columna: `cell` (función personalizada)

Personalizar cómo se muestra el contenido:

```html
<cu-table 
  :data="data"
  :columns="[
    { key: 'id', label: 'ID', cell: (row) => `#${row.id}` },
    { key: 'price', label: 'Precio', cell: (row) => `$${row.price.toFixed(2)}` },
    { 
      key: 'active', 
      label: 'Estado', 
      cell: (row) => row.active ? '✓ Activo' : '✗ Inactivo' 
    }
  ]"
/>
```

### Columna: `badges` (mostrar badges)

Mostrar badges en una celda:

```html
<cu-table 
  :data="data"
  :columns="[
    {
      key: 'status',
      label: 'Estado',
      badges: (row) => [
        { value: row.status, color: getStatusColor(row.status) }
      ]
    }
  ]"
/>

<script>
function getStatusColor(status) {
  const colors = {
    active: 'success',
    pending: 'warning',
    inactive: 'danger'
  };
  return colors[status] || 'neutral';
}
</script>
```

### Columna: `buttons` (botones de acción)

Añadir botones a una celda:

```html
<cu-table 
  :data="data"
  :columns="[
    {
      key: 'actions',
      label: 'Acciones',
      buttons: (row) => [
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
  ]"
/>

<script>
function editRow(row) {
  console.log('Editando:', row);
}

function deleteRow(row) {
  console.log('Eliminando:', row);
}
</script>
```

### Columna: `editable` (celda editable)

Habilitar edición en una celda:

```html
<cu-table 
  :data="data"
  :columns="[
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Nombre', editable: true },
    { key: 'email', label: 'Email', editable: true }
  ]"
/>
```

### Columna: `editable` con RegExp (validación de formato)

Validación de formato al editar:

```html
<cu-table 
  :data="data"
  :columns="[
    { key: 'name', label: 'Nombre', editable: true },
    { 
      key: 'email', 
      label: 'Email', 
      editable: /^[^@]+@[^@]+\.[^@]+$/,  // Validar formato de email
      inputType: 'input'
    },
    { 
      key: 'age', 
      label: 'Edad', 
      editable: /^\d+$/,  // Solo números
      inputType: 'input'
    }
  ]"
/>
```

### Columna: `validator` (validación personalizada)

Validación personalizada con acceso al row completo:

```html
<cu-table 
  :data="data"
  :columns="[
    {
      key: 'quantity',
      label: 'Cantidad',
      editable: true,
      validator: (value, row) => {
        const num = parseInt(value, 10);
        return !isNaN(num) && num >= 0 && num <= row.stock;
      }
    }
  ]"
/>
```

**Firma:** `(value: string, row: Record<string, any>) => boolean`
- `value`: El valor ingresado por el usuario (siempre es string)
- `row`: El objeto completo de la fila siendo editada
- **Retorna `true`** para aceptar el valor, **`false`** para cancelar la edición

> **⚠️ Orden de validación:** Si `editable` es un RegExp, primero se valida con ese RegExp, luego con `validator`. Si cualquiera falla, la edición se cancela.

### Columna: `inputType` (tipo de input para edición)

Elegir entre input o textarea:

```html
<cu-table 
  :data="data"
  :columns="[
    { key: 'name', label: 'Nombre', editable: true, inputType: 'input' },
    { key: 'description', label: 'Descripción', editable: true, inputType: 'textarea' }
  ]"
/>
```

### Columna: `singleClick` (edición con un clic)

Habilitar edición con un solo clic:

```html
<cu-table 
  :data="data"
  :columns="[
    { key: 'name', label: 'Nombre', editable: true, singleClick: true }
  ]"
/>
```

---

## Ejemplos por Slot

### Slot: `empty`

Personalizar el mensaje cuando no hay datos:

```html
<cu-table :data="[]" :columns="columns">
  <template #empty>
    <div class="text-center p-8">
      <p class="text-lg">No se encontraron resultados</p>
      <cu-button color="primary" onclick="loadData()" class="mt-4">
        Recargar Datos
      </cu-button>
    </div>
  </template>
</cu-table>

<script>
function loadData() {
  console.log('Cargando datos...');
}
</script>
```

### Slot: `header-{key}`

Personalizar el header de una columna:

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

### Slot: `cell-{key}`

Personalizar el contenido de una celda para casos avanzados:

```html
<cu-table :data="data" :columns="columns">
  <template #cell-status="{ row, column, index }">
    <cu-badge :color="getStatusColor(row.status)">
      {{ row.status }}
    </cu-badge>
  </template>
</cu-table>

<script>
function getStatusColor(status) {
  const colors = {
    active: 'success',
    pending: 'warning',
    inactive: 'danger'
  };
  return colors[status] || 'neutral';
}
</script>
```

> **Nota:** Para mostrar badges en celdas, la forma recomendada es usar la propiedad [`badges`](#columna-badges-mostrar-badges) de la columna. Usa el slot `cell-{key}` solo cuando necesites un control total sobre el renderizado de la celda.

---

## Función `cell` para Columnas

La función `cell` permite personalizar cómo se muestra el contenido de una celda.

### Ejemplo 1: Formatear valores numéricos

```javascript
const columns = [
  {
    key: 'price',
    label: 'Precio',
    cell: (row) => `$${row.price.toFixed(2)}`
  }
];
```

### Ejemplo 2: Combinar múltiples valores

```javascript
const columns = [
  {
    key: 'user',
    label: 'Usuario',
    cell: (row) => `${row.firstName} ${row.lastName}`
  }
];
```

### Ejemplo 3: Valor condicional

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

### Ejemplo 5: **⚠️ IMPORTANTE** - cell dinámica

La función `cell` **solo afecta el renderizado**, no el valor real del dato. Usa una función dinámica que lea el valor actual:

```javascript
// ❌ MAL: valor estático
cell: () => 0  // Siempre mostrará 0 aunque el dato cambie

// ✅ BIEN: función dinámica
cell: (row) => row.count ?? 0  // Lee el valor actual
```

---

## Función `badges` para Columnas

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

---

## Función `buttons` para Columnas

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

### Ejemplo 2: Botones con iconos (HTML)

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

---

## Celdas Editables

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
    singleClick: true  // Editar con un solo clic
  }
];
```

### Ejemplo 4: Campo dinámico (no existe en datos iniciales)

Cuando un campo **no existe en los datos iniciales** pero la columna es editable:
- **Valor inicial:** El input muestra vacío (`""`) en lugar de `"undefined"`
- **Al guardar:** El campo se añadirá al objeto con el valor editado

```javascript
const columns = [
  {
    key: 'notes',      // ✅ Este campo no existe en los datos iniciales
    label: 'Notas',
    editable: true,
    cell: (row) => row.notes ?? ''  // Muestra vacío si no existe
  }
];

// Datos iniciales: [{ id: 1, name: 'Producto' }]
// Tras editar 'notes': [{ id: 1, name: 'Producto', notes: 'Mi nota' }]
```

### Ejemplo 5: Validación personalizada con `validator`

```javascript
const columns = [
  {
    key: 'count',
    label: 'Cantidad',
    editable: true,
    cell: (row) => row.count ?? 0,  // ✅ Dinámica
    validator: (value, row) => {
      const num = parseInt(value, 10);
      return !isNaN(num) && num >= 0 && num <= row.stock;
    }
  }
];
```

---

## 📌 Observaciones Importantes

### Sobre `cell` y valores por defecto

La función `cell` **solo afecta el renderizado**, no el valor real del dato:

```javascript
// ❌ PROBLEMA: valor estático
cell: () => 0  // Siempre mostrará 0 aunque el dato haya cambiado al editar

// ✅ SOLUCIÓN: función dinámica
cell: (row) => row.count ?? 0  // ✅ Lee el valor actual o usa 0
```

### Sobre edición de campos no existentes

Cuando un campo **no existe en los datos iniciales** pero la columna es editable:
- **Valor inicial:** El input muestra vacío (`""`) en lugar de `"undefined"` (gracias a `row[col.key] != null ? String(row[col.key]) : ""`)
- **Al guardar:** El campo se añadirá al objeto con el valor editado

### Ejemplo completo: Campo dinámico con `cell` + `validator`

```javascript
const table = document.getElementById('order-table');

table.data = [
  { id: 1, name: 'Apple', stock: 100 },
  { id: 2, name: 'Banana', stock: 50 }
];

table.columns = [
  { key: 'name', label: 'Producto' },
  { key: 'stock', label: 'Stock' },
  {
    key: 'quantity',
    label: 'Cantidad',
    editable: true,
    // cell dinámica: muestra el valor actual o 0 si no existe
    cell: (row) => row.quantity ?? 0,
    // validator: no permite exceder el stock
    validator: (value, row) => {
      const num = parseInt(value, 10);
      return !isNaN(num) && num >= 0 && num <= row.stock;
    }
  }
];

// Al editar quantity de Apple a 50:
// - cell muestra 50 (no 0, porque lee row.quantity)
// - validator valida que 50 <= 100 (stock) ✅
// El objeto resulta: { id: 1, name: 'Apple', stock: 100, quantity: 50 }
```

---

## Búsqueda

### Ejemplo 1: Búsqueda básica

```html
<cu-table 
  :data="data" 
  :columns="columns"
  :search-enabled="true"
  @update:search="handleSearch"
/>

<script>
function handleSearch(value) {
  console.log('Buscando:', value);
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
  search-value="Juan"
/>
```

---

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

---

## Casos de Uso Combinados

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
    editable: /^[^@]+@[^@]+\.[^@]+$/,  // Validar formato de email
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
  id="full-table"
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

### Ejemplo 3: Tabla con limpieza de datos

```html
<cu-table id="clearable-table" :data="data" :columns="columns" />
<cu-button onclick="clearTable()">Limpiar Tabla</cu-button>

<script>
const table = document.getElementById('clearable-table');

function clearTable() {
  // Opción 1: Asignar array vacío
  table.data = [];
  
  // Opción 2: Remover todas las filas
  // while (table.getData().length > 0) {
  //   table.removeRow(0);
  // }
}
</script>
```

### Ejemplo 4: Tabla editable con guardado masivo

```javascript
const data = [
  { id: 1, name: 'Producto A', stock: 100, quantity: 0 },
  { id: 2, name: 'Producto B', stock: 50, quantity: 0 }
];

const columns = [
  { key: 'id', label: 'ID' },
  { key: 'name', label: 'Producto' },
  { key: 'stock', label: 'Stock' },
  {
    key: 'quantity',
    label: 'Cantidad',
    editable: true,
    cell: (row) => row.quantity ?? 0,
    validator: (value, row) => {
      const num = parseInt(value, 10);
      return !isNaN(num) && num >= 0 && num <= row.stock;
    }
  }
];

function saveAll() {
  const allData = table.getData();
  console.log('Datos a guardar:', allData);
  // Enviar a API
}

function addNewProduct() {
  const newProduct = { id: 0, name: 'Nuevo', stock: 0, quantity: 0 };
  table.addRow(newProduct);
}
</script>

<cu-table id="editable-table" :data="data" :columns="columns" />
<div class="flex gap-2 mt-4">
  <cu-button color="primary" onclick="saveAll()">Guardar Todo</cu-button>
  <cu-button color="success" onclick="addNewProduct()">Añadir Producto</cu-button>
</div>
```

### Ejemplo 5: Tabla con badges y botones combinados

```javascript
const data = [
  { id: 1, name: 'Tarea 1', status: 'pending', priority: 'high' },
  { id: 2, name: 'Tarea 2', status: 'active', priority: 'medium' },
  { id: 3, name: 'Tarea 3', status: 'completed', priority: 'low' }
];

const columns = [
  { key: 'id', label: 'ID' },
  { key: 'name', label: 'Nombre', editable: true },
  {
    key: 'status',
    label: 'Estado',
    badges: (row) => [
      { value: row.status, color: getStatusColor(row.status) }
    ]
  },
  {
    key: 'priority',
    label: 'Prioridad',
    badges: (row) => [
      { value: row.priority, color: getPriorityColor(row.priority) }
    ]
  },
  {
    key: 'actions',
    label: 'Acciones',
    buttons: (row) => [
      {
        label: 'Aprobar',
        color: 'success',
        variant: 'ghost',
        onClick: () => approveTask(row)
      }
    ]
  }
];

function getStatusColor(status) {
  return { pending: 'warning', active: 'primary', completed: 'success' }[status] || 'neutral';
}

function getPriorityColor(priority) {
  return { high: 'danger', medium: 'warning', low: 'success' }[priority] || 'neutral';
}

function approveTask(row) {
  row.status = 'completed';
  table.updateRow(table.getData().indexOf(row), row);
}
</script>

<cu-table :data="data" :columns="columns" />
```

---

## Estilos CSS

```css
/* Personalizar border-radius de la tabla */
cu-table {
  --uno-border-radius: 0.375rem;
}

/* Personalizar color de borde */
cu-table table {
  --uno-border-color: #e5e7eb;
}

/* Personalizar header de la tabla */
cu-table th {
  --uno-bg: #374151;
  --uno-text-color: #f9fafb;
}

/* Personalizar hover de filas */
cu-table tbody tr:hover {
  --uno-bg: #f3f4f6;
}

/* Personalizar pagination */
cu-table cu-pagination {
  margin-top: 1rem;
}
```

---

## Componentes Relacionados

- [Badge](Badge.md) - Usado para mostrar status en celdas
- [Button](Button.md) - Usado para acciones en celdas
- [Input](Input.md) - Usado para celdas editables
- [Textarea](Textarea.md) - Usado para celdas editables de texto largo
- [Pagination](Pagination.md) - Usado para la paginación
- [Modal](Modal.md) - Para mostrar tablas dentro de modales
- [Alert](Alert.md) - Para mostrar mensajes de alerta relacionados con la tabla
