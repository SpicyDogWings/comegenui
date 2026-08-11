# `<cu-table>`

Tabla avanzada con búsqueda, paginación, edición inline, ordenamiento, badges y botones por celda. Pensada para reemplazar tablas HTML estáticas en apps con UMD.

[← Volver](../SKILL.md)

---

## Props

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `theme` | `string` | `""` | Tema: `light`, `dark`, `sigacadv2` (hereda de `<html data-theme>` si se omite) |
| `color` | `string` | `"neutral"` | Color semántico: `primary`, `neutral`, `success`, `warning`, `danger` |
| `variant` | `string` | `"soft"` | `solid`, `outlined`, `soft`, `ghost`, `subtle` |
| `columns` | `array` | `[]` | Definición de columnas (ver [Interfaz de columna](#interfaz-de-columna)). Se asigna como propiedad JS |
| `data` | `array` | `[]` | Filas de la tabla. Se asigna como propiedad JS |
| `empty` | `string` | `""` | Texto a mostrar cuando no hay datos. Si se omite, usa `"No hay datos que mostrar"` |
| `pagination` | `boolean` | `false` | Habilita paginación interna |
| `itemsPerPage` | `number` | `10` | Tamaño de página (atributo HTML: `items-per-page`) |
| `showPageSize` | `boolean` | `false` | Muestra selector de items por página (atributo HTML: `show-page-size`) |
| `pageSizeOptions` | `array` | `[5, 10, 20, 50]` | Opciones del selector (atributo HTML: `page-size-options`). Se asigna como propiedad JS |
| `searchEnabled` | `boolean` | `false` | Habilita barra de búsqueda (atributo HTML: `search-enabled`) |
| `searchPlaceholder` | `string` | `"Buscar..."` | Placeholder del input de búsqueda (atributo HTML: `search-placeholder`) |
| `searchFields` | `array` | `[]` | Columnas donde buscar (atributo HTML: `search-fields`). Vacío = todas |
| `searchValue` | `string` | `""` | Valor controlado del buscador (atributo HTML: `search-value`) |
| `filters` | `object` | `{}` | Filtros por columna. Se asigna como propiedad JS |
| `loading` | `boolean` | `false` | Muestra una barra de carga animada en el tope |
| `actions` | `array` | `[]` | Acciones de fila (botón "..." al final de cada fila). Se asigna como propiedad JS |

> **Pipeline interno:** `data → search → filters → sort → pagination`. El ordenamiento y la paginación operan sobre los datos ya filtrados.

> **`search-fields` como atributo HTML:** Es el único caso donde podés pasar un array como atributo. Usá JSON válido:
> ```html
> <cu-table search-fields='["nombre","tipo"]'></cu-table>
> ```
> Equivalente por JS: `tabla.searchFields = ["nombre", "tipo"]`.

---

## Interfaz de columna

Esta es la interface declarada en el `.ce.vue`. **La prop `columns` se pasa tal cual al componente interno `AdvancedTable.vue`**, que acepta además los campos `width`, `align` y `sortable` (ver [Campos extendidos](#campos-extendidos-forwarded)).

```ts
interface Column {
  key: string;                                                       // Identificador de la columna
  label?: string;                                                   // Texto del header
  cell?: (row: Record<string, any>) => string | string[];            // Render custom de la celda
  editable?: boolean | RegExp | ((row: Record<string, any>) => boolean);  // Editable: bool, regex validator, o función condicional
  inputType?: "input" | "textarea" | "select";                       // Tipo de editor
  selectOptions?: { value: string; label: string }[] | ((row: Record<string, any>) => { value: string; label: string }[]);  // Opciones del select
  validator?: (value: string, row: Record<string, any>) => boolean;  // Validador custom
  singleClick?: boolean;                                             // Si true, edita con un click (default: doble click)
  badges?: (row: Record<string, any>) => BadgeConfig[];              // Badges por celda
  buttons?: (row: Record<string, any>) => ButtonConfig[];            // Botones por celda
}

interface BadgeConfig {
  value: string;
  color?: string;   // Color semántico
  variant?: string; // Variante
}

interface ButtonConfig {
  label?: string;
  icon?: string;                                                       // SVG inline completo
  onClick?: (row: Record<string, any>) => void;
  to?: string;
  target?: string;
  color?: string;
  variant?: string;
  disabled?: boolean;
}
```

### Celdas editables — dos modos

Por defecto las columnas con `editable` muestran el valor con un **lápiz**; hacé click
(o doble click si `singleClick: false`) para editar inline.

**Estado por columna** (forma principal): agregá `inlineEdit: true` en la columna para
que esa columna renderice el editor directo (input / select / textarea), sin lápiz:

```ts
{ key: "email", label: "Email", editable: true, inlineEdit: true }
```

**Estado global en la tabla** (opcional, por compatibilidad): `inlineEditing` activa el
inline en todas las columnas editables:

```vue
<AdvancedTable :columns="columns" :data="data" :inline-editing="inlineEditing" />
```

> Ambos son **estados reactivos**, no propiedades estáticas: podés alternarlos cuando
> quieras (ej: botón "lápiz" en la columna de acciones que togglea el estado global).
> El estado de la **columna** tiene prioridad sobre el de la tabla.

### Acciones de fila (`actions`)

Es un array de `ButtonConfig`. Cuando se asigna, la tabla agrega automáticamente una columna al final con un dropdown "..." que muestra las acciones. El `onClick` recibe la fila completa.

```ts
tabla.actions = [
  { label: 'Editar',   color: 'primary', variant: 'ghost', onClick: (row) => editar(row) },
  { label: 'Eliminar', color: 'danger',  variant: 'ghost', onClick: (row) => eliminar(row) },
];
```

---

## Campos extendidos (forwarded)

Como `columns` se pasa sin filtrar al `AdvancedTable.vue` interno, podés usar estos campos adicionales. **No están tipados en el `.ce.vue`** pero funcionan porque se reenvían tal cual:

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `width` | `string` | Ancho de la columna (CSS, ej. `"120px"`, `"20%"`) |
| `align` | `"left" \| "center" \| "right"` | Alineación del contenido |
| `sortable` | `boolean \| "string" \| "number" \| "boolean"` | Habilita ordenamiento. Ver [Ordenamiento](#ordenamiento) |

---

## Eventos

| Evento | Payload (`e.detail`) | Descripción |
|--------|----------------------|-------------|
| `update:currentPage` | `number` | Cambio de página (tras búsqueda, filtro, sort o click) |
| `update:itemsPerPage` | `number` | Cambio del tamaño de página |
| `update:search` | `string` | Cambio en la query de búsqueda |
| `edit-start` | `{ row, column, index }` | Inicia edición de celda |
| `edit-save` | `{ row, column, value, index }` | Celda editada y guardada. La tabla ya actualizó `row[key]` antes de emitir |
| `edit-cancel` | `{ row, column, index }` | Edición cancelada |

> El Custom Element **no re-emite** los eventos `row-click`, `row-dblclick` ni `cell-click` (existen internamente pero no atraviesan el wrapper). Si necesitás reaccionar a clicks en filas, agregá un `ButtonConfig` o `BadgeConfig` a la columna correspondiente.

---

## Slots

| Slot | Bindings | Descripción |
|------|----------|-------------|
| `header` | `{ column, color, variant }` | Personaliza el header completo (todas las columnas) |
| `header-{key}` | `{ column, color, variant }` | Header de una columna específica (key dinámico) |
| `empty` | — | Contenido cuando no hay datos (override del texto `empty`) |

> **Importante:** Los slots `cell-{key}` y `search` que aparecen en algunos ejemplos **no están expuestos** por el `<cu-table>` (el `.ce.vue` no los reenvía). Solo `header`, `header-{key}` y `empty`.

### Ejemplo de slot header

```html
<cu-table id="miTabla">
  <span slot="header-rol" style="color: var(--primary)">ROL</span>
</cu-table>
```

### Ejemplo de slot empty

```html
<cu-table id="miTabla">
  <div slot="empty" style="padding: 24px; text-align: center;">
    <p>No hay datos para mostrar.</p>
    <cu-button color="primary" variant="soft">Crear registro</cu-button>
  </div>
</cu-table>
```

---

## Métodos expuestos

| Método | Descripción |
|--------|-------------|
| `.updateRow(index, newData)` | Actualiza una fila por índice. Hace **merge** del objeto, no reemplazo total |
| `.getData()` | Devuelve copia de todos los datos |
| `.getRow(index)` | Devuelve copia de una fila |
| `.removeRow(index)` | Elimina una fila por índice |
| `.addRow(newRow)` | Agrega una fila al final |
| `.pushData(items[])` | Agrega múltiples filas al final |

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

## Búsqueda

### Comportamiento general

- **Sin `search-fields`:** busca en **todas** las claves del objeto `row`.
- **Con `search-fields`:** busca solo en las columnas indicadas.
- Búsqueda **case-insensitive** y **acento-insensitive** (`"matricula"` encuentra `"Matrícula"`).

### Como atributo HTML

```html
<cu-table
  search-enabled
  search-placeholder="Buscar..."
  search-fields='["nombre","email"]'
></cu-table>
```

### Como propiedad JS

```js
const t = document.getElementById('miTabla');
t.searchFields = ['nombre', 'email'];
t.searchEnabled = true;
```

### Búsqueda sobre columnas `select`

Las columnas con `inputType: 'select'` se buscan por la **label** de la opción, no por el `value` guardado:

```js
tabla.columns = [
  { key: 'nombre', label: 'Nombre' },
  {
    key: 'tipo',
    label: 'Tipo',
    inputType: 'select',
    selectOptions: [
      { value: '1', label: 'Certificado de notas' },
      { value: '2', label: 'Acta de grado' },
    ],
  },
];
tabla.data = [
  { nombre: 'Juan', tipo: '1' },  // buscar "notas" lo encuentra
];
```

---

## Filtros por columna

Además del buscador, podés aplicar filtros exactos con la prop `filters`. Se combinan con la búsqueda (AND) y se aplican antes del ordenamiento:

```js
tabla.filters = {
  estado: 'Activo',                  // match exacto
  tipo: ['1', '3'],                  // match contra cualquier valor del array
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
</script>
```

Pipeline: `data → search → filters → sort → pagination`.

---

## Ordenamiento

Agregá `sortable` a la definición de la columna. Hacé click en el header para ciclar: `↕` → `▲` (asc) → `▼` (desc) → `↕`.

```js
tabla.columns = [
  { key: 'nombre', label: 'Nombre', sortable: 'string' },
  { key: 'edad',   label: 'Edad',   sortable: 'number' },
  { key: 'activo', label: 'Activo', sortable: 'boolean' },
  { key: 'ciudad', label: 'Ciudad', sortable: true },  // auto-detecta
];
```

| Valor de `sortable` | Comportamiento |
|--------------------|----------------|
| `'string'` | Orden alfabético (`localeCompare`, español) |
| `'number'` | Orden numérico |
| `'boolean'` | `false` primero, `true` después |
| `true` | Auto-detecta según el tipo del primer valor |

> **Nota:** `sortable` es un campo extendido (no está en la interface de `Column` del `.ce.vue`). Funciona porque se reenvía al `AdvancedTable.vue` interno.

---

## Edición condicional

`editable` también acepta una función que decide según la fila:

```js
{
  key: 'nombre',
  label: 'Nombre',
  editable: (row) => row.estado === 'Activo',  // solo editable si está activo
}
```

También acepta `RegExp` para validar al guardar:

```js
{
  key: 'email',
  label: 'Correo',
  editable: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
}
```

> Con `singleClick: true` la celda entra en modo edición con un solo click (default: doble click).

---

## Edición con select

`inputType: 'select'` + `selectOptions` para que la celda editable renderice un `<cu-select>`. En modo vista se muestra la **label**, no el `value`.

```js
tabla.columns = [
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
```

`selectOptions` también puede ser una función para opciones dinámicas:

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

## Badges y botones por celda

### Badges dinámicos

```js
{
  key: 'estado',
  label: 'Estado',
  badges: (row) => [{
    value: row.estado,
    color: row.estado === 'Activo' ? 'success' : 'warning',
    variant: 'soft',
  }],
}
```

### Botones condicionales

```js
{
  key: 'acciones',
  label: '',
  buttons: (row) => {
    const btns = [];
    if (row.editado) {
      btns.push({
        icon: '<svg ...></svg>',
        color: 'primary',
        variant: 'solid',
        onClick: (r) => guardarCambios(r),
      });
    }
    btns.push({
      icon: row.activo
        ? '<svg ... check ...></svg>'
        : '<svg ... plus ...></svg>',
      color: row.activo ? 'success' : 'neutral',
      variant: 'soft',
      onClick: (r) => toggleActivo(r),
    });
    btns.push({
      icon: '<svg ... trash ...></svg>',
      color: 'danger',
      variant: 'soft',
      onClick: (r) => eliminar(r),
    });
    return btns;
  },
}
```

> Los iconos SVG deben usar `stroke="currentColor"` para que hereden el color del botón.

---

## Acciones de fila (botón "..." al final)

Más simple que definir una columna `buttons` para cada fila: pasá un array en `actions` y la tabla agrega automáticamente una columna al final con un dropdown.

```js
tabla.actions = [
  {
    label: 'Editar',
    color: 'primary',
    variant: 'ghost',
    onClick: (row) => editar(row),
  },
  {
    label: 'Duplicar',
    color: 'neutral',
    variant: 'ghost',
    onClick: (row) => duplicar(row),
  },
  { divider: true },
  {
    label: 'Eliminar',
    color: 'danger',
    variant: 'ghost',
    onClick: (row) => eliminar(row),
  },
];
```

> Items con `divider: true` renderizan una línea divisoria. Cada `onClick` recibe la fila completa.

---

## Estado de carga

Cuando `loading` es `true`, se muestra una barra delgada animada en el tope de la tabla:

```js
const t = document.getElementById('miTabla');
t.loading = true;   // mostrar
// ...fetch...
t.loading = false;  // ocultar
```

---

## Patrón: edición con marca de "editado"

```js
tabla.columns = [
  { key: 'nombre', label: 'Nombre', editable: true, singleClick: true },
  { key: 'tipo', label: 'Tipo', editable: true, inputType: 'select', singleClick: true,
    selectOptions: [{ value: '1', label: 'Documento' }, { value: '2', label: 'Expediente' }] },
];

tabla.data = [{ id: 1, nombre: 'Acta', tipo: '1', editado: false }];

tabla.addEventListener('edit-save', (e) => {
  // Marcar la fila como editada (aparece el botón guardar)
  tabla.updateRow(e.detail.index, { editado: true });
});
```

`updateRow` hace merge, así que solo actualiza `editado` sin pisar el resto.

---

## Sticky header

El header es `position: sticky`. Sigue el scroll del contenedor de scroll más cercano:

- **Scroll de página:** si la tabla está en una página que scrollea (y ningún ancestro intermedio tiene `overflow` que cree un scroll container propio), el header se pega al tope de la página.
- **Scroll interno:** con `max-height` en la tabla, el header se pega al tope del área de scroll de la tabla.

En variantes transparentes (`outlined`, `ghost`) se aplica `backdrop-filter: blur(8px)` al header para mantener la legibilidad al scrollear contenido por debajo.

```html
<cu-table
  id="miTabla"
  search-enabled
  search-placeholder="Buscar..."
  style="width: 100%;"
></cu-table>
```
