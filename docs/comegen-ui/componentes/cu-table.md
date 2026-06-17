# `<cu-table>`

Tabla avanzada con búsqueda, edición inline, paginación, badges y botones por celda.

[← Volver](../SKILL.md)

---

## Props

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `theme` | `string` | `""` | Tema |
| `color` | `string` | `"neutral"` | Color semántico |
| `variant` | `string` | `"soft"` | `solid`, `outlined`, `soft`, `ghost`, `subtle`, `link` |
| `columns` | `array` | `[]` | Configuración de columnas (ver abajo) |
| `data` | `array` | `[]` | Datos de la tabla |
| `empty` | `string` | `""` | Texto cuando no hay datos |
| `pagination` | `boolean` | `false` | Habilita paginación |
| `items-per-page` | `number` | `10` | Items por página |
| `show-page-size` | `boolean` | `false` | Selector de items por página |
| `page-size-options` | `array` | `[5,10,20,50]` | Opciones del selector |
| `search-enabled` | `boolean` | `false` | Habilita búsqueda |
| `search-placeholder` | `string` | `"Buscar..."` | Placeholder del buscador |
| `search-fields` | `array` | `[]` | Columnas en las que buscar (vacío = todas) |
| `search-value` | `string` | `""` | Valor de búsqueda inicial |
| `filters` | `object` | `{}` | Filtros por columna: `{ estado: "Activo", tipo: ["1","3"] }` |
| `loading` | `boolean` | `false` | Muestra una barra de carga animada en el tope de la tabla |

> **`search-fields` como atributo HTML:** Los atributos se reciben como strings. Pasá siempre `search-fields='["campo1","campo2"]'` (JSON válido). Cuando lo seteés por JS, usá un array real: `tabla.searchFields = ["nombre", "tipo"]`.

---

## Interfaz de columna

```ts
interface Column {
  key: string;
  label?: string;
  cell?: (row) => string | string[];
  editable?: boolean | RegExp | ((row) => boolean);
  inputType?: 'input' | 'textarea' | 'select' | 'autocomplete';
  validator?: (value, row) => boolean;
  singleClick?: boolean;
  color?: string;              // Color hex para el editable (cualquier tipo)
  variant?: string;            // Variante para el editable (cualquier tipo)
  badges?: (row) => BadgeConfig[];
  buttons?: (row) => ButtonConfig[];

  // Props específicas por inputType:
  select?: {
    options: { value: string; label: string; disabled?: boolean; color?: string; variant?: string }[];
    color?: string;            // Color del Select (sobrescribe column.color)
    variant?: string;          // Variante del Select
    placement?: string;        // bottom-start, bottom-end, top-start, top-end
    placeholderWrap?: boolean;
  };
  autocomplete?: {
    items: { label: string; value?: string; icon?: string }[];
    minChars?: number;
    color?: string;
    variant?: string;
  };
  textarea?: {
    rows?: number;
    noResize?: boolean;
    color?: string;
    variant?: string;
  };
  input?: {
    type?: string;             // text, password, email, number, etc.
    startValue?: string;
    color?: string;
    variant?: string;
  };

  // ⚠️ Deprecated (usar select.options en su lugar):
  selectOptions?: ...;
  // ⚠️ Deprecated (usar autocomplete.items en su lugar):
  autocompleteItems?: ...;
}
interface BadgeConfig {
  value: string;
  color?: string;
  variant?: string;
}

interface ButtonConfig {
  label?: string;
  icon?: string;  // SVG inline
  onClick?: (row) => void;
  to?: string;
  target?: string;
  color?: string;
  variant?: string;
  disabled?: boolean;
}
```

---

## Eventos

| Evento | Payload | Descripción |
|--------|---------|-------------|
| `update:currentPage` | `number` | Cambio de página |
| `update:itemsPerPage` | `number` | Cambio de items por página |
| `update:search` | `string` | Cambio en la búsqueda |
| `edit-start` | `{ row, column, index }` | Inicia edición de celda |
| `edit-save` | `{ row, column, value, index }` | Guarda edición |
| `edit-cancel` | `{ row, column, index }` | Cancela edición |
| `row-click` | `{ row, index, event }` | Click en fila |
| `row-dblclick` | `{ row, index, event }` | Doble click en fila |
| `cell-click` | `{ row, col, index, event }` | Click en celda |

---

## Slots

Usá `<element slot="nombre">` para proyectar contenido:

| Slot | Bindings | Descripción |
|------|----------|-------------|
| `header` | `{ column, color, variant }` | Personaliza el header completo |
| `header-{key}` | `{ column, color, variant }` | Header de una columna específica |
| `cell-{key}` | `{ row, column, index, value }` | Celda de una columna específica |
| `empty` | — | Contenido cuando no hay datos |
| `search` | `{ query, update }` | Personaliza el input de búsqueda |

---

## Métodos expuestos

| Método | Descripción |
|--------|-------------|
| `.updateRow(index, newData)` | Actualiza una fila por índice (mergea el objeto) |
| `.getData()` | Devuelve copia de todos los datos |
| `.getRow(index)` | Devuelve copia de una fila |
| `.removeRow(index)` | Elimina una fila |
| `.addRow(newRow)` | Agrega una fila |
| `.pushData(items[])` | Agrega múltiples filas |

---

## Uso básico

```html
<script src="dist/CuTable.umd.js"></script>

<cu-table id="miTabla" color="primary" variant="soft" search-enabled pagination items-per-page="5"></cu-table>

<script>
  const tabla = document.getElementById('miTabla');

  tabla.columns = [
    { key: 'nombre', label: 'Nombre', editable: true },
    { key: 'email', label: 'Correo', editable: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
    { key: 'rol', label: 'Rol', badges: (row) => [
      { value: row.rol, color: row.rol === 'Admin' ? 'danger' : 'primary', variant: 'soft' }
    ]},
    { key: 'acciones', label: '', buttons: (row) => [
      { label: 'Editar', color: 'primary', variant: 'ghost', onClick: (r) => console.log('Editar', r) },
      { label: 'Eliminar', color: 'danger', variant: 'ghost', onClick: (r) => console.log('Eliminar', r) },
    ]},
  ];

  tabla.data = [
    { nombre: 'Juan Pérez', email: 'juan@ejemplo.com', rol: 'Admin' },
    { nombre: 'María García', email: 'maria@ejemplo.com', rol: 'Usuario' },
  ];
</script>
```

---

## Búsqueda en la tabla

### Comportamiento general

- Sin `search-fields` busca en **todas** las claves del objeto `row`.
- Con `search-fields` busca solo en las columnas indicadas.
- La búsqueda es **case-insensitive** y **acento-insensitive** (buscar `"matricula"` encuentra `"Matrícula"`).

### Columnas normales (texto, input)

Busca directamente sobre el valor guardado:

```html
<cu-table search-enabled search-fields='["nombre","email"]'></cu-table>
```

### Columnas `inputType: 'select'`

La búsqueda resuelve el valor guardado (ID numérico) a su **label** usando `selectOptions` y busca sobre la label. Si el campo guarda `"1"` pero la label es `"Certificado de notas"`, buscar `"certificado"` o `"notas"` lo encuentra.

```html
<cu-table search-enabled></cu-table>
```

```js
tabla.columns = [
  { key: 'nombre', label: 'Nombre' },
  {
    key: 'tipo',
    label: 'Tipo',
    editable: true,
    inputType: 'select',
    selectOptions: [
      { value: '1', label: 'Certificado de notas' },
      { value: '2', label: 'Acta de grado' },
    ],
  },
];

tabla.data = [
  { nombre: 'Juan Pérez', tipo: '1' },
  { nombre: 'María García', tipo: '2' },
];
```

En este ejemplo, buscar `"notas"` o `"certificado"` encuentra la fila de Juan Pérez aunque el valor guardado sea `"1"`. Buscar `"grado"` encuentra a María García.

### search-fields desde HTML

Los atributos se reciben como strings. Usá formato JSON con comillas dobles internas:

```html
<!-- ✅ Correcto -->
<cu-table search-enabled search-fields='["nombre","tipo"]'></cu-table>
```

Si preferís setearlo por JS:

```js
tabla.searchFields = ['nombre', 'tipo'];
```

### Ejemplo completo con búsqueda y select

```html
<cu-table
  id="tablaBusqueda"
  color="primary"
  variant="soft"
  search-enabled
  search-placeholder="Buscar archivo..."
  search-fields='["nombre","tipo"]'
  pagination
  items-per-page="10"
  empty="No hay resultados"
></cu-table>

<script>
  const t = document.getElementById('tablaBusqueda');
  t.columns = [
    { key: 'nombre', label: 'Nombre', editable: true, singleClick: true },
    {
      key: 'tipo',
      label: 'Tipo',
      editable: true,
      inputType: 'select',
      singleClick: true,
      selectOptions: [
        { value: '1', label: 'Certificado de notas' },
        { value: '2', label: 'Acta de grado' },
        { value: '3', label: 'Hoja de matrícula' },
      ],
    },
    {
      key: 'estado',
      label: 'Estado',
      badges: (row) => [{
        value: row.estado,
        color: row.estado === 'Activo' ? 'success' : 'warning',
        variant: 'soft',
      }],
    },
  ];
  t.data = [
    { nombre: 'Juan Pérez', tipo: '1', estado: 'Activo' },
    { nombre: 'María García', tipo: '2', estado: 'Activo' },
    { nombre: 'Carlos López', tipo: '3', estado: 'Inactivo' },
  ];
</script>
```

Probá buscar: `"certificado"`, `"matricula"` (sin acento), `"hoja"`, `"grado"` — todas funcionan.

---

## Estado de carga

Cuando `loading` es `true`, se muestra una barra delgada animada en el tope de la tabla:

```html
<cu-table id="miTabla" search-enabled pagination loading></cu-table>
<!-- o por JS -->
<script>
  const t = document.getElementById('miTabla');
  t.loading = true;   // muestra la barra
  // ... después de cargar datos
  t.loading = false;  // oculta la barra
</script>
```

La barra usa el color de texto de la tabla (`fgClasses.main`) y un ciclo de 3s.

---

## Filtros por columna

Además del buscador textual, podés aplicar filtros por columna con la prop `filters`. Los filtros se combinan con la búsqueda (AND):

```js
tabla.filters = {
  estado: 'Activo',            // match exacto
  tipo: ['1', '3'],            // match contra cualquier valor del array
  nombre: (val, row) => val.length > 5,  // función custom
};
```

```html
<cu-table id="tablaFiltros" search-enabled pagination></cu-table>

<script>
  const t = document.getElementById('tablaFiltros');
  t.columns = [
    { key: 'nombre', label: 'Nombre' },
    { key: 'estado', label: 'Estado' },
  ];
  t.data = [
    { nombre: 'Juan Pérez', estado: 'Activo' },
    { nombre: 'María García', estado: 'Inactivo' },
  ];

  // Mostrar solo activos
  t.filters = { estado: 'Activo' };

  // También funciona combinado con búsqueda textual
  // t.filters = { estado: 'Activo' }
  // escribir "Juan" en el buscador → solo activos que contengan "Juan"
</script>
```

Los filtros se agregan al pipeline después de la búsqueda y antes del ordenamiento:

```
data → search → filters → sort → pagination
```

---

## Edición condicional por fila

`editable` también acepta una función que recibe la fila y devuelve `true`/`false`. Útil para bloquear edición según el estado de la fila:

```js
{
  key: 'nombre',
  label: 'Nombre',
  editable: (row) => row.estado === 'Activo',  // solo editable si está activo
}
```

```html
<cu-table id="tablaCondicional" search-enabled pagination></cu-table>

<script>
  const t = document.getElementById('tablaCondicional');
  t.columns = [
    {
      key: 'nombre',
      label: 'Nombre',
      editable: (row) => row.estado === 'Activo',
    },
    {
      key: 'estado',
      label: 'Estado',
      badges: (row) => [{
        value: row.estado,
        color: row.estado === 'Activo' ? 'success' : 'warning',
        variant: 'soft',
      }],
    },
  ];
  t.data = [
    { nombre: 'Juan Pérez', estado: 'Activo' },    // editable
    { nombre: 'Carlos López', estado: 'Inactivo' }, // NO editable
  ];
</script>
```

Sigue siendo compatible con `boolean` y `RegExp` como antes.

---

## Edición con select

Usá `inputType: 'select'` y `selectOptions` (o `select.options`) para que una columna editable renderice un **Select** al hacer clic. En modo vista se muestra la **label** de la opción seleccionada, no el value.

### Con API legacy:

```html
<script src="dist/CuTable.umd.js"></script>

<cu-table id="tablaSelect" color="primary" variant="soft"></cu-table>

<script>
  const ts = document.getElementById('tablaSelect');
  ts.columns = [
    { key: 'nombre', label: 'Nombre', editable: true },
    {
      key: 'rol',
      label: 'Rol',
      editable: true,
      inputType: 'select',
      singleClick: true,
      selectOptions: [
        { value: '1', label: 'Administrador' },
        { value: '2', label: 'Editor' },
        { value: '3', label: 'Visor' },
      ],
    },
  ];
  ts.data = [
    { nombre: 'Juan Pérez', rol: '1' },
    { nombre: 'María García', rol: '2' },
  ];
</script>
```

### Con API nueva (`select.options`):

```js
ts.columns = [
  { key: 'nombre', label: 'Nombre', editable: true },
  {
    key: 'rol',
    label: 'Rol',
    editable: true,
    inputType: 'select',
    singleClick: true,
    // Nueva API:
    select: {
      options: [
        { value: '1', label: 'Administrador' },
        { value: '2', label: 'Editor' },
        { value: '3', label: 'Visor' },
      ],
      color: '#1774A4',     // Color del Select (opcional)
      variant: 'outlined',   // Variante (opcional)
      placement: 'bottom-end', // Posición del dropdown (opcional)
    },
  },
];
```

`selectOptions` también puede ser una función que recibe la fila y devuelve opciones dinámicas:

```js
{
  key: 'categoria',
  label: 'Categoría',
  editable: true,
  inputType: 'select',
  selectOptions: (row) => row.rol === '1'
    ? [{ value: 'a', label: 'Categoría A' }, { value: 'b', label: 'Categoría B' }]
    : [{ value: 'a', label: 'Categoría A' }],
}
```

---

## Uso con iconos SVG en botones

Los botones aceptan SVG en su contenido mediante la propiedad `icon`. Usá `stroke="currentColor"` para que el icono herede el color:

```html
<cu-table id="tablaIconos" color="primary" variant="soft"></cu-table>

<script>
  const ti = document.getElementById('tablaIconos');
  ti.columns = [
    { key: 'nombre', label: 'Nombre' },
    {
      key: 'acciones',
      label: '',
      buttons: (row) => [
        {
          icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>`,
          color: 'primary',
          variant: 'ghost',
          onClick: (r) => console.log('Editar', r),
        },
        {
          icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>`,
          color: 'danger',
          variant: 'ghost',
          onClick: (r) => console.log('Eliminar', r),
        },
      ],
    },
  ];
  ti.data = [
    { nombre: 'Proyecto Alpha', estado: 'Activo' },
    { nombre: 'Proyecto Beta', estado: 'Pendiente' },
  ];
</script>
```

---

## Botones condicionales por estado de la fila

```js
{
  key: 'acciones',
  label: '',
  buttons: (row) => {
    const btns = [];

    if (row.editado) {
      btns.push({
        icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"/><path d="M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7"/><path d="M7 3v4a1 1 0 0 0 1 1h7"/></svg>`,
        color: 'primary',
        variant: 'solid',
        onClick: (r) => guardarCambios(r),
      });
    }

    btns.push({
      icon: row.activo
        ? `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6 9 17l-5-5"/></svg>`
        : `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14"/></svg>`,
      color: row.activo ? 'success' : 'neutral',
      variant: 'soft',
      onClick: (r) => toggleActivo(r),
    });

    btns.push({
      icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>`,
      color: 'danger',
      variant: 'soft',
      onClick: (r) => eliminar(r),
    });

    return btns;
  },
}
```

---

## Patrón: edición inline con guardado

```js
tabla.columns = [
  { key: 'nombre', label: 'Nombre', editable: true, singleClick: true },
  {
    key: 'tipo',
    label: 'Tipo',
    editable: true,
    inputType: 'select',
    singleClick: true,
    selectOptions: [
      { value: '1', label: 'Documento' },
      { value: '2', label: 'Expediente' },
    ],
  },
];

tabla.data = [
  { id: 1, nombre: 'Acta', tipo: '1', editado: false },
];

tabla.addEventListener('edit-save', (e) => {
  // Marcar la fila como editada (aparece el botón guardar)
  tabla.updateRow(e.detail.index, { editado: true });
});
```

---

## Ordenamiento por columna

Cualquier columna puede ser ordenable agregando `sortable` a su definición:

```js
{ key: 'nombre', label: 'Nombre', sortable: 'string' }
{ key: 'edad', label: 'Edad', sortable: 'number' }
{ key: 'activo', label: 'Activo', sortable: 'boolean' }
{ key: 'ciudad', label: 'Ciudad', sortable: true }  // auto-detecta
```

### Tipos soportados

| Valor | Comportamiento |
|-------|---------------|
| `'string'` | Orden alfabético (`localeCompare`, español) |
| `'number'` | Orden numérico |
| `'boolean'` | `false` primero, `true` después |
| `true` | Auto-detecta por el tipo del primer valor en los datos |

### Comportamiento

- Hacé click en el header de una columna ordenable.
- Ciclo: `↕` (sin orden) → `▲` (ascendente) → `▼` (descendente) → `↕` (sin orden).
- El ordenamiento se aplica sobre los datos ya filtrados por búsqueda y filtros.
- Al cambiar el orden, la paginación vuelve a la página 1.

```html
<cu-table id="tablaOrdenable" search-enabled pagination></cu-table>

<script>
  const t = document.getElementById('tablaOrdenable');
  t.columns = [
    { key: 'nombre', label: 'Nombre', sortable: 'string' },
    { key: 'edad', label: 'Edad', sortable: 'number' },
    { key: 'activo', label: 'Activo', sortable: 'boolean' },
    { key: 'tipo', label: 'Tipo', editable: true, inputType: 'select' },
  ];
  t.data = [
    { nombre: 'Ana', edad: 30, activo: true, tipo: '1' },
    { nombre: 'Carlos', edad: 25, activo: false, tipo: '2' },
    { nombre: 'Beatriz', edad: 35, activo: true, tipo: '1' },
  ];
</script>
```

---

## Notas importantes

- **`search-fields` desde HTML:** Usá siempre formato JSON con comillas dobles internas y comillas simples externas: `search-fields='["campo1","campo2"]'`. Alternativamente, setéalo por JS: `tabla.searchFields = ["campo1", "campo2"]`.
- **Búsqueda sin `search-fields`:** Busca en TODAS las claves del objeto `row`. Si tenés columnas con `inputType: 'select'`, busca por la label.
- **Búsqueda con `search-fields`:** Busca solo en los campos indicados. Si algún campo es `inputType: 'select'`, busca por la label.
- **Acentos:** La búsqueda es acento-insensitive. `"matricula"` encuentra `"Matrícula"`, `"certificado"` encuentra `"Certificado"`.
- **`singleClick: true`:** Permite editar la celda con un solo clic (por defecto requiere doble clic).
- **`updateRow`:** Hace merge del objeto, no reemplaza toda la fila. Útil para campos como `editado`.
- **Iconos SVG:** Usá `stroke="currentColor"` para que hereden el color del botón.
- **Columnas select en modo vista:** Muestran la label, no el value guardado.
- **`edit-save`:** La tabla ya actualizó `row[key] = value` antes de emitir el evento.

---

## Sticky Header

Cuando la tabla tiene un `max-height` (o está dentro de un contenedor con altura fija), los headers se vuelven `position: sticky` para mantenerse visibles al scrollear.

Para variants que no sean `solid`, el header tiene `backdrop-filter: blur(8px)` que difumina el contenido scrolleado detrás, manteniendo la legibilidad sin perder el estilo semi-transparente.

```html
<cu-table
  id="miTabla"
  search-enabled
  search-placeholder="Buscar..."
  style="max-height: 400px; width: 100%;"
></cu-table>

<script>
  const t = document.getElementById('miTabla');
  t.columns = [
    { key: 'codigo', label: 'Código' },
    { key: 'nombre', label: 'Nombre' },
    { key: 'categoria', label: 'Categoría' },
    { key: 'stock', label: 'Stock', align: 'center' },
  ];
  t.data = Array.from({ length: 50 }, (_, i) => ({
    codigo: `P-${String(i + 1).padStart(3, '0')}`,
    nombre: `Producto ${i + 1}`,
    categoria: ['Electrónica', 'Oficina', 'Audio'][i % 3],
    stock: Math.floor(Math.random() * 50),
  }));
</script>
```
