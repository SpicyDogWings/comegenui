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
| `columns` | `array` | `[]` | Configuración de columnas |
| `data` | `array` | `[]` | Datos de la tabla |
| `empty` | `string` | `""` | Texto cuando no hay datos |
| `pagination` | `boolean` | `false` | Habilita paginación |
| `items-per-page` | `number` | `10` | Items por página |
| `show-page-size` | `boolean` | `false` | Selector de items por página |
| `page-size-options` | `array` | `[5,10,20,50]` | Opciones del selector |
| `search-enabled` | `boolean` | `false` | Habilita búsqueda |
| `search-placeholder` | `string` | `"Buscar..."` | Placeholder del buscador |
| `search-fields` | `array` | `[]` | Columnas en las que buscar |
| `search-value` | `string` | `""` | Valor de búsqueda inicial |

## Interfaz de columna

```ts
interface Column {
  key: string;
  label?: string;
  cell?: (row) => string | string[];
  editable?: boolean | RegExp;
  inputType?: 'input' | 'textarea' | 'select';
  selectOptions?: { value: string; label: string }[] | ((row) => { value: string; label: string }[]);
  validator?: (value, row) => boolean;
  singleClick?: boolean;
  badges?: (row) => BadgeConfig[];
  buttons?: (row) => ButtonConfig[];
}

interface BadgeConfig {
  value: string;
  color?: string;
  variant?: string;
}

interface ButtonConfig {
  label?: string;
  icon?: string | Component;
  onClick?: (row) => void;
  to?: string;
  target?: string;
  color?: string;
  variant?: string;
  disabled?: boolean;
}
```

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

## Slots

| Slot | Bindings | Descripción |
|------|----------|-------------|
| `#header` | `{ column, color, variant }` | Personaliza el header completo |
| `#header-{key}` | `{ column, color, variant }` | Header de una columna específica |
| `#cell-{key}` | `{ row, column, index, value }` | Celda de una columna específica |
| `#empty` | — | Contenido cuando no hay datos |
| `#search` | `{ query, update }` | Personaliza el input de búsqueda |

## Métodos expuestos

| Método | Descripción |
|--------|-------------|
| `.updateRow(index, newData)` | Actualiza una fila por índice |
| `.getData()` | Devuelve copia de todos los datos |
| `.getRow(index)` | Devuelve copia de una fila |
| `.removeRow(index)` | Elimina una fila |
| `.addRow(newRow)` | Agrega una fila |
| `.pushData(items[])` | Agrega múltiples filas |

## Uso en HTML plano

```html
<script src="dist/CuTable.umd.js"></script>

<cu-table
  id="miTabla"
  color="primary"
  variant="soft"
  search-enabled
  pagination
  items-per-page="5"
></cu-table>

<script>
  const tabla = document.getElementById('miTabla');

  tabla.columns = [
    { key: 'nombre', label: 'Nombre', editable: true },
    { key: 'email', label: 'Correo', editable: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
    { key: 'rol', label: 'Rol', badges: (row) => [
      { value: row.rol, color: row.rol === 'Admin' ? 'danger' : 'primary', variant: 'soft' }
    ]},
    { key: 'acciones', label: 'Acciones', buttons: (row) => [
      { label: 'Editar', color: 'primary', variant: 'ghost', onClick: (r) => console.log('Editar', r) },
      { label: 'Eliminar', color: 'danger', variant: 'ghost', onClick: (r) => console.log('Eliminar', r) },
    ]},
  ];

  tabla.data = [
    { nombre: 'Juan Pérez', email: 'juan@ejemplo.com', rol: 'Admin' },
    { nombre: 'María García', email: 'maria@ejemplo.com', rol: 'Usuario' },
    { nombre: 'Carlos López', email: 'carlos@ejemplo.com', rol: 'Editor' },
  ];

  tabla.addEventListener('edit-save', (e) => {
    console.log('Celda editada:', e.detail);
  });

  // Manipulación programática
  tabla.addRow({ nombre: 'Nuevo', email: 'nuevo@ejemplo.com', rol: 'Usuario' });
  tabla.removeRow(0);
  console.log(tabla.getData());
</script>
```

## Uso con badges y botones

```html
<cu-table id="tablaAvanzada" color="primary" variant="soft"></cu-table>

<script>
  const t = document.getElementById('tablaAvanzada');
  t.columns = [
    { key: 'nombre', label: 'Nombre' },
    {
      key: 'estado',
      label: 'Estado',
      badges: (row) => [{
        value: row.estado,
        color: row.estado === 'Activo' ? 'success' : 'warning',
        variant: 'soft',
      }],
    },
    {
      key: 'acciones',
      label: '',
      buttons: (row) => [
        { label: 'Editar', color: 'primary', variant: 'ghost', onClick: (r) => editar(r) },
        { label: 'Eliminar', color: 'danger', variant: 'ghost', onClick: (r) => eliminar(r) },
      ],
    },
  ];
  t.data = [
    { nombre: 'Proyecto Alpha', estado: 'Activo' },
    { nombre: 'Proyecto Beta', estado: 'Pendiente' },
  ];
</script>
```

## Uso con iconos SVG en botones

Los botones aceptan SVG en su contenido. Usá `stroke="currentColor"` para que el icono herede el color del botón según su variante:

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
          label: 'Editar',
          icon: `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
            </svg>
          `,
          color: 'primary',
          variant: 'ghost',
          onClick: (r) => console.log('Editar', r),
        },
        {
          label: 'Eliminar',
          icon: `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
            </svg>
          `,
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

## Edición con select

Usá `inputType: 'select'` y `selectOptions` para que una columna editable renderice un `<select>` al hacer doble click. En modo vista se muestra la `label` de la opción seleccionada (no el `value`).

```html
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
      selectOptions: [
        { value: 'admin', label: 'Administrador' },
        { value: 'editor', label: 'Editor' },
        { value: 'viewer', label: 'Visor' },
      ],
    },
  ];
  ts.data = [
    { nombre: 'Juan Pérez', rol: 'admin' },
    { nombre: 'María García', rol: 'editor' },
  ];

  ts.addEventListener('edit-save', (e) => {
    console.log('Cambio:', e.detail);
  });
</script>
```

`selectOptions` también puede ser una función que recibe la fila y devuelve opciones dinámicas:

```js
{
  key: 'categoria',
  label: 'Categoría',
  editable: true,
  inputType: 'select',
  selectOptions: (row) => row.rol === 'admin'
    ? [{ value: 'a', label: 'Categoría A' }, { value: 'b', label: 'Categoría B' }]
    : [{ value: 'a', label: 'Categoría A' }],
}
```
