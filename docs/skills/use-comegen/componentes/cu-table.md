# `<cu-table>`

Tabla avanzada con búsqueda, paginación, edición inline, ordenamiento, badges y botones por celda. Pensada para reemplazar tablas HTML estáticas en apps con UMD.

[← Volver](../SKILL.md)

---

## Interfaz de columna

Esta es la interface declarada en el `.ce.vue`. **La prop `columns` se pasa tal cual al componente interno `AdvancedTable.vue`**, que acepta además los campos `width`, `align` y `sortable` (ver [Campos extendidos](#campos-extendidos-forwarded)).

```ts
interface Column {
  key: string;                                                       // Identificador de la columna
  label?: string;                                                   // Texto del header
  cell?: (row: Record<string, any>) => string | string[];            // Render custom de la celda
  editable?: boolean | RegExp | ((row: Record<string, any>) => boolean);  // Editable: bool, regex validator, o función condicional
  inputType?: "input" | "textarea" | "select" | "autocomplete" | "date" | "switch";  // Tipo de editor
  selectOptions?: { value: string; label: string }[] | ((row: Record<string, any>) => { value: string; label: string }[]);  // Opciones del select
  validator?: (value: string, row: Record<string, any>) => boolean;  // Validador custom
  singleClick?: boolean;                                             // Si true, edita con un click (default: doble click)
  editorAlign?: "start" | "center" | "end";                          // Alineación del editor dentro de la celda (default: switch centrado, resto start)
  badges?: (row: Record<string, any>) => BadgeConfig[];              // Badges por celda
  buttons?: (row: Record<string, any>) => ButtonConfig[];            // Botones por celda
  disabled?: boolean | ((row: Record<string, any>) => boolean);      // Columna deshabilitada (boolean o por fila)
  cellDisabled?: (row: Record<string, any>) => boolean;              // Celda deshabilitada (intersección fila × columna)
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

### Estados de las celdas editables

Una columna con `editable` tiene **dos estados** posibles. Ambos son **reactivos**: podés alternarlos en runtime (ej: un botón "lápiz" que togglea el estado global).

#### Estado 1 — Modo lápiz (default)

La celda muestra el valor con un **lápiz** ✏️. Hacé click (o doble click si `singleClick: false`) para entrar al editor.

| Acción | Comportamiento |
|--------|----------------|
| Click / doble click | Entra en edición, emite `edit-start` |
| `Enter` (o blur) | Guarda, emite `edit-save`, **vuelve al lápiz** |
| `Escape` | Cancela, emite `edit-cancel`, **vuelve al lápiz** |

#### Estado 2 — Inline (editor siempre visible)

La celda renderiza el editor (input / select / textarea / autocomplete) **directamente**, sin lápiz. Se activa **por columna** o **globalmente**:

**Por columna** (forma principal — funciona también en `<cu-table>`):

```ts
{ key: "email", label: "Email", editable: true, inlineEdit: true }
```

**Global en la tabla** (solo componente Vue `AdvancedTable`, por compatibilidad):

```vue
<AdvancedTable :columns="columns" :data="data" :inline-editing="inlineEditing" />
```

> ⚠️ **En HTML plano:** el `<cu-table>` (Custom Element) **no expone** la prop `inlineEditing`. Para celdas siempre editables con UMD usá `inlineEdit: true` en cada columna (las `columns` se reenvían tal cual al interno).

| Acción | Comportamiento en estado inline |
|--------|---------------------------------|
| `Enter` (o blur) | Guarda, emite `edit-save`, **el editor permanece** |
| `Escape` | Cancela, emite `edit-cancel`, **el editor permanece** (en estado global revierte además el valor al original) |
| Apagar el estado | Vuelve al modo lápiz sin perder lo ya guardado |

**Prioridad:** el estado de la **columna** (`column.inlineEdit`) tiene prioridad sobre el global (`inlineEditing`). Una columna con `inlineEdit: true` queda inline aunque la tabla tenga `inlineEditing: false`.

> 💡 **`inputType: 'switch'` es una excepción:** el switch **siempre** se renderiza visible, sin lápiz y sin depender de los estados lápiz/inline. Ver [Edición con switch](#edición-con-switch).

> Ver [Recetas](#recetas) para ejemplos completos de cada estado, incluyendo el preset de playground `examples/table-inline-editing.js`.

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

> 💡 Si la validación falla, el editor se tiñe de rojo y se emite `edit-error`. Ver [Receta 4 — Validar formato con regex](#receta-4--validar-formato-con-regex-precio-con-2-decimales) para el patrón completo (con `inlineEdit` y feedback visible).

---

## Deshabilitar filas, columnas y celdas

Podés deshabilitar la edición y el estado visual a **tres niveles**, con prioridad **fila > columna > celda**:

| Nivel | Cómo | Alcance |
|---|---|---|
| **Fila** | prop `rowDisabled` (boolean o `(row) => boolean`) | Toda la fila se atenúa, no edita, no emite clicks |
| **Columna** | campo `column.disabled` (boolean o `(row) => boolean`) | Deshabilita la columna completa o solo en ciertas filas |
| **Celda** | campo `column.cellDisabled` (`(row) => boolean`) | Deshabilita una celda puntual (intersección fila × columna) |

Al deshabilitar una celda:
- La celda se **atenúa** y muestra `cursor: not-allowed`.
- No entra en modo edición (ni lápiz ni inline; en inline muestra la vista atenuada).
- Los **botones** de la celda y las **acciones** del dropdown "..." se deshabilitan.
- Los **badges** se siguen viendo (solo atenuados con la fila).

```js
tabla.rowDisabled = (row) => row.bloqueado === true;   // fila deshabilitada

tabla.columns = [
  { key: 'nombre', label: 'Nombre', editable: true },
  {
    key: 'email',
    label: 'Correo',
    editable: true,
    disabled: (row) => row.rol === 'invitado',          // columna disabled solo para invitados
  },
  {
    key: 'activo',
    label: 'Activo',
    editable: true,
    inputType: 'switch',
    cellDisabled: (row) => row.nombre === 'Carol',       // celda puntual deshabilitada
  },
];
```

> `rowDisabled` como `boolean` deshabilita **todas** las filas; como función, decide por fila.

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

## Edición con fecha

`inputType: 'date'` + `date.*` para que la celda editable renderice un `<cu-date-picker>` como editor. El valor se guarda como **string `"YYYY-MM-DD"`** (en modo vista se muestra con `date.format`, default `dd/MM/yyyy`):

```js
tabla.columns = [
  { key: 'nombre', label: 'Nombre', editable: true },
  {
    key: 'fecha',
    label: 'Fecha',
    editable: true,
    inputType: 'date',
    singleClick: true,
    date: {
      format: 'dd/MM/yyyy',        // tokens iguales al <cu-date-picker>
      min: '2026-01-01',           // límite inferior (desde)
      max: '2026-12-31',           // límite superior (hasta)
      yearNavigation: true,        // botones « » de año en el calendario
      disabledWeekdays: '0,6',     // fines de semana deshabilitados
      disabledDates: '2026-08-15', // feriados puntuales
      position: 'top', align: 'start',      // panel arriba (o position: 'top', align: 'start', fixed: false)
    },
  },
];
```

> El evento `edit-save` entrega el valor como `"YYYY-MM-DD"`. La config `date.*` acepta los mismos valores que las props del `<cu-date-picker>` (string `"0,6"` o array `[0,6]` para `disabledWeekdays`, etc.).

### Posición del panel (calendario arriba, etc.)

La config `date.*` acepta las props de posicionamiento del `<cu-date-picker>`:

| Prop de `date.*` | Valores | Default | Descripción |
|---|---|---|---|

| `position` | `"bottom"` \| `"top"` \| `"left"` \| `"right"` | `"bottom"` | Panel debajo, arriba o a los costados del trigger |
| `align` | `"start"` \| `"center"` \| `"end"` | `"start"` | Alineación horizontal del panel |
| `fixed` | `boolean` | `true` | Panel en `position: fixed` (default `true` en celdas editables para no romper el layout de la tabla) |

```js
// Panel arriba del trigger, alineado a la derecha
{ key: 'fecha', label: 'Fecha', editable: true, inputType: 'date', date: { position: 'top', align: 'end' } }
```

> Con `fixed: false` el panel se posiciona en `absolute` respecto al trigger (puede recortarse si la celda/tabla tiene `overflow`). El default es `true` justamente para evitarlo.

---

## Edición con switch

`inputType: 'switch'` + `switch.*` para que la celda editable renderice un `<cu-switch>` **directamente, sin lápiz** (el switch siempre está visible, como el estado inline). El valor de la fila es booleano (`true` / `false`).

```js
tabla.columns = [
  { key: 'nombre', label: 'Nombre', editable: true },
  {
    key: 'activo',
    label: 'Activo',
    editable: true,
    inputType: 'switch',
    switch: {
      size: 'sm',        // "sm" | "md" (default "md")
      color: 'success',  // color semántico del switch (default: el de la tabla)
    },
  },
];
```

| Campo de `switch.*` | Valores | Default | Descripción |
|---|---|---|---|
| `size` | `"sm"` \| `"md"` | `"md"` | Tamaño del switch |
| `color` | color semántico | color de la tabla | Color del switch |

> **Comportamiento:** al alternar el switch se emite `edit-save` inmediatamente con `value` **booleano** (`true` / `false`) y la tabla actualiza `row[key]`. El switch no pasa por modo lápiz ni por validación regex/`validator` (su valor siempre es booleano válido). Para arrancar "encendido", el dato debe venir con `activo: true`.

> **Alineación y ancho:** el switch **no ocupa todo el ancho de la celda** (`width: fit-content`) — queda con su tamaño natural y por defecto **centrado** para que el thumb recorra el recorrido completo sin deformarse. Para moverlo dentro de la celda usá `editorAlign` (campo de columna):

| Campo de columna | Valores | Default | Descripción |
|---|---|---|---|
| `editorAlign` | `"start"` \| `"center"` \| `"end"` | `"center"` para switch (si no hay `align`) | Alineación del editor dentro de la celda. Aplica a cualquier `inputType` cuyo editor no ocupe todo el ancho |

```js
// Switch centrado (default) / a la izquierda / a la derecha
{ key: 'activo', label: 'Activo', editable: true, inputType: 'switch' }
{ key: 'envio', label: 'Envío', editable: true, inputType: 'switch', editorAlign: 'start', switch: { color: 'primary', size: 'sm' } }
{ key: 'garantia', label: 'Garantía', editable: true, inputType: 'switch', editorAlign: 'end', switch: { color: 'warning' } }
```

```js
tabla.addEventListener('edit-save', (e) => {
  console.log(`Fila ${e.detail.index}: activo = ${e.detail.value}`);  // true / false
});
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

### Multi-badge con wrap

Si la función `badges` devuelve **varios** badges, el contenedor usa `flex-wrap: wrap`: los badges **saltan de línea entre sí** en lugar de estirarse en una fila larga. Ideal para columnas con etiquetas/tags múltiples (skills, roles, permisos). Limitá el ancho de la columna con `width` para que el wrap se active a partir de ese ancho.

```js
tabla.columns = [
  { key: 'nombre', label: 'Nombre' },
  {
    key: 'skills',
    label: 'Skills',
    width: '220px',   // a partir de este ancho los badges hacen wrap
    badges: (row) => [
      { value: 'Vue', color: 'primary', variant: 'soft' },
      { value: 'TypeScript', color: 'primary', variant: 'soft' },
      { value: 'Docker', color: 'neutral', variant: 'soft' },
      { value: 'PostgreSQL', color: 'warning', variant: 'soft' },
      ...(row.senior ? [{ value: 'Arquitectura', color: 'secondary', variant: 'soft' }] : []),
    ],
  },
];
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

## Footer (API programática)

Además del slot `footer` (ver [Slots](#slots)), el `<cu-table>` expone una **propiedad `footer`** que permite definir filas de pie de forma programática — ideal para totales, resúmenes o notas al pie.

```js
const t = document.getElementById('miTabla');
t.columns = [
  { key: 'producto', label: 'Producto' },
  { key: 'precio', label: 'Precio', align: 'right' },
];
t.data = [
  { producto: 'Widget A', precio: 250.00 },
  { producto: 'Widget B', precio: 175.50 },
  { producto: 'Widget C', precio: 320.00 },
];

const total = t.data.reduce((sum, row) => sum + row.precio, 0);

// Definir footer (múltiples filas)
t.footer = [
  {
    cells: [
      { value: 'Total', colspan: 1 },
      { value: `$${total.toFixed(2)}`, align: 'right' },
    ],
  },
  {
    cells: [
      { value: '* Precios sin IVA', colspan: 2 },
    ],
  },
];
```

**Interfaz:**

```ts
interface FooterCell {
  value: string;
  colspan?: number;
  align?: "left" | "center" | "right";
}

interface FooterRow {
  cells: FooterCell[];
}
```

> **Prioridad:** si el slot `footer` tiene contenido, tiene prioridad sobre la prop `footer`. Si no usás el slot, el `<tfoot>` se renderiza si `footer.length > 0`.

> **Múltiples filas:** cada elemento del array `footer` es una fila `<tr>` independiente.

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

## Recetas: estados de las celdas editables

### Receta 1 — Modo edición masiva con toggle (Vue)

Un botón que alterna toda la tabla entre modo lápiz y modo inline (todos los editores visibles). Ideal para "editar en lote".

```vue
<script setup lang="ts">
import { ref } from "vue";
import AdvancedTable from "@/components/data/AdvancedTable.vue";

const inlineEditing = ref(false); // ← estado reactivo
const data = ref([
  { id: 1, nombre: "Juan", email: "juan@x.com", rol: "admin" },
  { id: 2, nombre: "María", email: "maria@x.com", rol: "editor" },
]);

const columns = [
  { key: "nombre", label: "Nombre", editable: true },
  { key: "email", label: "Correo", editable: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
  {
    key: "rol", label: "Rol", editable: true, inputType: "select",
    selectOptions: [
      { value: "admin", label: "Admin" },
      { value: "editor", label: "Editor" },
    ],
  },
];
</script>

<template>
  <button @click="inlineEditing = !inlineEditing">
    {{ inlineEditing ? "Terminar edición" : "Editar en lote" }}
  </button>
  <AdvancedTable :columns="columns" :data="data" :inline-editing="inlineEditing" />
</template>
```

> Al apagar el estado, todas las celdas vuelven al lápiz sin perder los valores ya guardados (cada `edit-save` actualizó `data` en el momento).

### Receta 2 — Columna siempre editable en HTML plano (`<cu-table>`)

El Custom Element no expone `inlineEditing`, así que el estado inline se activa **por columna**:

```html
<script src="dist/CuTable.umd.js"></script>

<cu-table id="tablaInline"></cu-table>

<script>
  const t = document.getElementById('tablaInline');

  t.columns = [
    { key: 'nombre', label: 'Nombre', editable: true, inlineEdit: true }, // siempre inline
    { key: 'email',  label: 'Correo', editable: true },                   // modo lápiz
    {
      key: 'rol', label: 'Rol', editable: true, inlineEdit: true,
      inputType: 'select',
      selectOptions: [
        { value: 'admin',  label: 'Administrador' },
        { value: 'editor', label: 'Editor' },
      ],
    },
  ];

  t.data = [
    { nombre: 'Juan Pérez', email: 'juan@ejemplo.com', rol: 'admin' },
    { nombre: 'María García', email: 'maria@ejemplo.com', rol: 'editor' },
  ];

  t.addEventListener('edit-save', (e) => {
    console.log(`Guardado: ${e.detail.column.key} = "${e.detail.value}" (fila ${e.detail.index})`);
  });
</script>
```

### Receta 3 — Estados mixtos + validación y edición condicional

Combiná lápiz e inline en la misma tabla, con validación por columna y celdas habilitadas según la fila:

```js
tabla.columns = [
  {
    key: 'nombre', label: 'Nombre',
    editable: true, inlineEdit: true,                    // siempre inline
    validator: (v) => v.trim().length >= 3,              // valida al guardar
  },
  {
    key: 'email', label: 'Correo',
    editable: (row) => row.activo,                       // modo lápiz, solo si la fila está activa
    validator: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
  },
  {
    key: 'estado', label: 'Estado',
    editable: true,                                      // modo lápiz (default)
    inputType: 'select',
    selectOptions: [
      { value: 'activo', label: 'Activo' },
      { value: 'inactivo', label: 'Inactivo' },
    ],
  },
];
```

> **Nota:** `editable` como función controla el **modo lápiz** (habilita/deshabilita el click y atenúa la celda con `.cu-editable-cell-view--disabled`). En estado inline el editor se renderiza igual aunque la función devuelva `false`; usá `validator` para controlar qué se guarda.

### Receta 4 — Validar formato con regex (precio con 2 decimales)

`editable` acepta un **`RegExp`** como validador (además de `boolean` y función). Es la forma más corta de validar formato al guardar: precios, emails, DNIs, códigos, etc. **Los agentes rara vez lo usan** — acá está el patrón completo.

El regex se evalúa con `.test(value)` al guardar (Enter / blur / elegir opción en select). Si no matchea:

- El valor **no se guarda** (no se emite `edit-save`).
- Se emite [`edit-error`](#eventos) con `{ row, column, value, index }`.
- El editor se tiñe de rojo (prop `color: danger`) — aplica a **todos** los tipos de editor (input, textarea, select, autocomplete, date), no solo al input de texto.

Ejemplo: tabla de productos donde `precio` solo acepta números con **exactamente 2 decimales**:

```js
const priceRegex = /^\d+\.\d{2}$/;   // "1200.50" ✓ | "1200.555" ✗ | "1200.5" ✗ | "abc" ✗ | "12,50" ✗

const columns = [
  { key: 'producto', label: 'Producto' },
  { key: 'precio', label: 'Precio', editable: priceRegex },                    // modo lápiz (default)
];

const columnsInline = [
  { key: 'producto', label: 'Producto' },
  { key: 'precio', label: 'Precio', editable: priceRegex, inlineEdit: true },  // modo inline
];
```

En HTML plano (`<cu-table>`), mismo ejemplo con el editor siempre visible:

```js
tabla.columns = [
  { key: 'producto', label: 'Producto' },
  { key: 'precio', label: 'Precio', editable: /^\d+\.\d{2}$/, inlineEdit: true },
];
```

**Comportamiento al validar:**

| Acción | Resultado |
|--------|-----------|
| Escribís `1200.555` (más de 2 decimales) | No se guarda, el input se tiñe de rojo, emite `edit-error` |
| Escribís `25.99` (válido) | Se guarda (emite `edit-save`), el rojo desaparece |
| `Escape` | Cancela y limpia el estado de error |

> El tintado rojo no es un CSS aparte: es la misma prop `color="danger"` que recibe el editor cuando la validación falla. Si querés mostrar tu propio mensaje, escuchá `edit-error` (en `<cu-table>`: `tabla.addEventListener('edit-error', ...)`).

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

---

## Vista Vue

### Interfaz de columna

Esta es la interface declarada en el `.ce.vue`. **La prop `columns` se pasa tal cual al componente interno `AdvancedTable.vue`**, que acepta además los campos `width`, `align` y `sortable` (ver [Campos extendidos](#campos-extendidos-forwarded)).

```ts
interface Column {
  key: string;                                                       // Identificador de la columna
  label?: string;                                                   // Texto del header
  cell?: (row: Record<string, any>) => string | string[];            // Render custom de la celda
  editable?: boolean | RegExp | ((row: Record<string, any>) => boolean);  // Editable: bool, regex validator, o función condicional
  inputType?: "input" | "textarea" | "select" | "autocomplete" | "date" | "switch";  // Tipo de editor
  selectOptions?: { value: string; label: string }[] | ((row: Record<string, any>) => { value: string; label: string }[]);  // Opciones del select
  validator?: (value: string, row: Record<string, any>) => boolean;  // Validador custom
  singleClick?: boolean;                                             // Si true, edita con un click (default: doble click)
  editorAlign?: "start" | "center" | "end";                          // Alineación del editor dentro de la celda (default: switch centrado, resto start)
  badges?: (row: Record<string, any>) => BadgeConfig[];              // Badges por celda
  buttons?: (row: Record<string, any>) => ButtonConfig[];            // Botones por celda
  disabled?: boolean | ((row: Record<string, any>) => boolean);      // Columna deshabilitada (boolean o por fila)
  cellDisabled?: (row: Record<string, any>) => boolean;              // Celda deshabilitada (intersección fila × columna)
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

### Estados de las celdas editables

Una columna con `editable` tiene **dos estados** posibles. Ambos son **reactivos**: podés alternarlos en runtime (ej: un botón "lápiz" que togglea el estado global).

#### Estado 1 — Modo lápiz (default)

La celda muestra el valor con un **lápiz** ✏️. Hacé click (o doble click si `singleClick: false`) para entrar al editor.

| Acción | Comportamiento |
|--------|----------------|
| Click / doble click | Entra en edición, emite `edit-start` |
| `Enter` (o blur) | Guarda, emite `edit-save`, **vuelve al lápiz** |
| `Escape` | Cancela, emite `edit-cancel`, **vuelve al lápiz** |

#### Estado 2 — Inline (editor siempre visible)

La celda renderiza el editor (input / select / textarea / autocomplete) **directamente**, sin lápiz. Se activa **por columna** o **globalmente**:

**Por columna** (forma principal — funciona también en `<cu-table>`):

```ts
{ key: "email", label: "Email", editable: true, inlineEdit: true }
```

**Global en la tabla** (solo componente Vue `AdvancedTable`, por compatibilidad):

```vue
<AdvancedTable :columns="columns" :data="data" :inline-editing="inlineEditing" />
```

> ⚠️ **En HTML plano:** el `<cu-table>` (Custom Element) **no expone** la prop `inlineEditing`. Para celdas siempre editables con UMD usá `inlineEdit: true` en cada columna (las `columns` se reenvían tal cual al interno).

| Acción | Comportamiento en estado inline |
|--------|---------------------------------|
| `Enter` (o blur) | Guarda, emite `edit-save`, **el editor permanece** |
| `Escape` | Cancela, emite `edit-cancel`, **el editor permanece** (en estado global revierte además el valor al original) |
| Apagar el estado | Vuelve al modo lápiz sin perder lo ya guardado |

**Prioridad:** el estado de la **columna** (`column.inlineEdit`) tiene prioridad sobre el global (`inlineEditing`). Una columna con `inlineEdit: true` queda inline aunque la tabla tenga `inlineEditing: false`.

> 💡 **`inputType: 'switch'` es una excepción:** el switch **siempre** se renderiza visible, sin lápiz y sin depender de los estados lápiz/inline. Ver [Edición con switch](#edición-con-switch).

> Ver [Recetas](#recetas) para ejemplos completos de cada estado, incluyendo el preset de playground `examples/table-inline-editing.js`.

### Acciones de fila (`actions`)

Es un array de `ButtonConfig`. Cuando se asigna, la tabla agrega automáticamente una columna al final con un dropdown "..." que muestra las acciones. El `onClick` recibe la fila completa.

```vue
<script setup lang="ts">
import AdvancedTable from "@/components/data/AdvancedTable.vue";
import { ref } from "vue";

const actions = ref([
  { label: "Editar",   color: "primary", variant: "ghost", onClick: (row) => editar(row) },
  { label: "Eliminar", color: "danger",  variant: "ghost", onClick: (row) => eliminar(row) },
]);
</script>

<template>
  <AdvancedTable :columns="columns" :data="data" :actions="actions" />
</template>
```

### Campos extendidos (forwarded)

Como `columns` se pasa sin filtrar al `AdvancedTable.vue` interno, podés usar estos campos adicionales. **No están tipados en el `.ce.vue`** pero funcionan porque se reenvían tal cual:

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `width` | `string` | Ancho de la columna (CSS, ej. `"120px"`, `"20%"`) |
| `align` | `"left" \| "center" \| "right"` | Alineación del contenido |
| `sortable` | `boolean \| "string" \| "number" \| "boolean"` | Habilita ordenamiento. Ver [Ordenamiento](#ordenamiento) |

### Uso en Vue

```vue
<script setup lang="ts">
import AdvancedTable from "@/components/data/AdvancedTable.vue";
import { ref } from "vue";

const columns = ref([
  { key: "nombre", label: "Nombre", editable: true },
  { key: "email", label: "Correo", editable: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
  { key: "rol", label: "Rol", badges: (row) => [
    { value: row.rol, color: row.rol === "Admin" ? "danger" : "primary", variant: "soft" }
  ]},
  { key: "acciones", label: "", buttons: (row) => [
    { label: "Editar", color: "primary", variant: "ghost", onClick: (r) => console.log("Editar", r) },
    { label: "Eliminar", color: "danger", variant: "ghost", onClick: (r) => console.log("Eliminar", r) },
  ]},
]);

const data = ref([
  { nombre: "Juan Pérez", email: "juan@ejemplo.com", rol: "Admin" },
  { nombre: "María García", email: "maria@ejemplo.com", rol: "Usuario" },
]);
</script>

<template>
  <AdvancedTable
    :columns="columns"
    :data="data"
    color="primary"
    variant="soft"
    search-enabled
    pagination
    :items-per-page="5"
  />
</template>
```

### Búsqueda

### Comportamiento general

- **Sin `search-fields`:** busca en **todas** las claves del objeto `row`.
- **Con `search-fields`:** busca solo en las columnas indicadas.
- Búsqueda **case-insensitive** y **acento-insensitive** (`"matricula"` encuentra `"Matrícula"`).

### En Vue

```vue
<template>
  <AdvancedTable
    search-enabled
    search-placeholder="Buscar..."
    :search-fields="['nombre', 'email']"
  />
</template>
```

### Búsqueda sobre columnas `select`

Las columnas con `inputType: 'select'` se buscan por la **label** de la opción, no por el `value` guardado:

```vue
<script setup lang="ts">
import AdvancedTable from "@/components/data/AdvancedTable.vue";
import { ref } from "vue";

const columns = ref([
  { key: "nombre", label: "Nombre" },
  {
    key: "tipo",
    label: "Tipo",
    inputType: "select",
    selectOptions: [
      { value: "1", label: "Certificado de notas" },
      { value: "2", label: "Acta de grado" },
    ],
  },
]);
const data = ref([
  { nombre: "Juan", tipo: "1" }, // buscar "notas" lo encuentra
]);
</script>

<template>
  <AdvancedTable :columns="columns" :data="data" search-enabled />
</template>
```

### Filtros por columna

Además del buscador, podés aplicar filtros exactos con la prop `filters`. Se combinan con la búsqueda (AND) y se aplican antes del ordenamiento:

```vue
<script setup lang="ts">
import AdvancedTable from "@/components/data/AdvancedTable.vue";
import { ref } from "vue";

const filters = ref({
  estado: "Activo",                     // match exacto
  tipo: ["1", "3"],                     // match contra cualquier valor del array
  nombre: (val, row) => val.length > 5, // función custom
});
</script>

<template>
  <AdvancedTable :columns="columns" :data="data" :filters="filters" />
</template>
```

```vue
<script setup lang="ts">
import AdvancedTable from "@/components/data/AdvancedTable.vue";
import { ref } from "vue";

const columns = ref([
  { key: "nombre", label: "Nombre" },
  { key: "estado", label: "Estado" },
]);
const data = ref([
  { nombre: "Juan Pérez", estado: "Activo" },
  { nombre: "María García", estado: "Inactivo" },
]);

// Mostrar solo activos
const filters = ref({ estado: "Activo" });
</script>

<template>
  <AdvancedTable :columns="columns" :data="data" :filters="filters" search-enabled pagination />
</template>
```

Pipeline: `data → search → filters → sort → pagination`.

### Ordenamiento

Agregá `sortable` a la definición de la columna. Hacé click en el header para ciclar: `↕` → `▲` (asc) → `▼` (desc) → `↕`.

```vue
<script setup lang="ts">
import AdvancedTable from "@/components/data/AdvancedTable.vue";
import { ref } from "vue";

const columns = ref([
  { key: "nombre", label: "Nombre", sortable: "string" },
  { key: "edad",   label: "Edad",   sortable: "number" },
  { key: "activo", label: "Activo", sortable: "boolean" },
  { key: "ciudad", label: "Ciudad", sortable: true }, // auto-detecta
]);
</script>

<template>
  <AdvancedTable :columns="columns" :data="data" />
</template>
```

| Valor de `sortable` | Comportamiento |
|--------------------|----------------|
| `'string'` | Orden alfabético (`localeCompare`, español) |
| `'number'` | Orden numérico |
| `'boolean'` | `false` primero, `true` después |
| `true` | Auto-detecta según el tipo del primer valor |

> **Nota:** `sortable` es un campo extendido (no está en la interface de `Column` del `.ce.vue`). Funciona porque se reenvía al `AdvancedTable.vue` interno.

### Edición condicional

`editable` también acepta una función que decide según la fila:

```vue
<script setup lang="ts">
import AdvancedTable from "@/components/data/AdvancedTable.vue";
import { ref } from "vue";

const columns = ref([
  {
    key: "nombre",
    label: "Nombre",
    editable: (row) => row.estado === "Activo", // solo editable si está activo
  },
]);
</script>

<template>
  <AdvancedTable :columns="columns" :data="data" />
</template>
```

También acepta `RegExp` para validar al guardar:

```vue
<script setup lang="ts">
import AdvancedTable from "@/components/data/AdvancedTable.vue";
import { ref } from "vue";

const columns = ref([
  {
    key: "email",
    label: "Correo",
    editable: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
]);
</script>

<template>
  <AdvancedTable :columns="columns" :data="data" />
</template>
```

> Con `singleClick: true` la celda entra en modo edición con un solo click (default: doble click).

> 💡 Si la validación falla, el editor se tiñe de rojo y se emite `edit-error`. Ver [Receta 4 — Validar formato con regex](#receta-4--validar-formato-con-regex-precio-con-2-decimales) para el patrón completo (con `inlineEdit` y feedback visible).

### Deshabilitar filas, columnas y celdas

Podés deshabilitar la edición y el estado visual a **tres niveles**, con prioridad **fila > columna > celda**:

| Nivel | Cómo | Alcance |
|---|---|---|
| **Fila** | prop `rowDisabled` (boolean o `(row) => boolean`) | Toda la fila se atenúa, no edita, no emite clicks |
| **Columna** | campo `column.disabled` (boolean o `(row) => boolean`) | Deshabilita la columna completa o solo en ciertas filas |
| **Celda** | campo `column.cellDisabled` (`(row) => boolean`) | Deshabilita una celda puntual (intersección fila × columna) |

Al deshabilitar una celda:
- La celda se **atenúa** y muestra `cursor: not-allowed`.
- No entra en modo edición (ni lápiz ni inline; en inline muestra la vista atenuada).
- Los **botones** de la celda y las **acciones** del dropdown "..." se deshabilitan.
- Los **badges** se siguen viendo (solo atenuados con la fila).

```vue
<script setup lang="ts">
import AdvancedTable from "@/components/data/AdvancedTable.vue";
import { ref } from "vue";

const rowDisabled = (row) => row.bloqueado === true; // fila deshabilitada

const columns = ref([
  { key: "nombre", label: "Nombre", editable: true },
  {
    key: "email",
    label: "Correo",
    editable: true,
    disabled: (row) => row.rol === "invitado", // columna disabled solo para invitados
  },
  {
    key: "activo",
    label: "Activo",
    editable: true,
    inputType: "switch",
    cellDisabled: (row) => row.nombre === "Carol", // celda puntual deshabilitada
  },
]);
</script>

<template>
  <AdvancedTable :columns="columns" :data="data" :row-disabled="rowDisabled" />
</template>
```

> `rowDisabled` como `boolean` deshabilita **todas** las filas; como función, decide por fila.

### Edición con select

`inputType: 'select'` + `selectOptions` para que la celda editable renderice un `<cu-select>`. En modo vista se muestra la **label**, no el `value`.

```vue
<script setup lang="ts">
import AdvancedTable from "@/components/data/AdvancedTable.vue";
import { ref } from "vue";

const columns = ref([
  { key: "nombre", label: "Nombre", editable: true },
  {
    key: "rol",
    label: "Rol",
    editable: true,
    inputType: "select",
    singleClick: true,
    selectOptions: [
      { value: "1", label: "Administrador" },
      { value: "2", label: "Editor" },
      { value: "3", label: "Visor" },
    ],
  },
]);
</script>

<template>
  <AdvancedTable :columns="columns" :data="data" />
</template>
```

`selectOptions` también puede ser una función para opciones dinámicas:

```vue
<script setup lang="ts">
import AdvancedTable from "@/components/data/AdvancedTable.vue";
import { ref } from "vue";

const columns = ref([
  {
    key: "categoria",
    label: "Categoría",
    editable: true,
    inputType: "select",
    selectOptions: (row) =>
      row.rol === "1"
        ? [{ value: "a", label: "Categoría A" }, { value: "b", label: "Categoría B" }]
        : [{ value: "a", label: "Categoría A" }],
  },
]);
</script>

<template>
  <AdvancedTable :columns="columns" :data="data" />
</template>
```

### Edición con fecha

`inputType: 'date'` + `date.*` para que la celda editable renderice un `<cu-date-picker>` como editor. El valor se guarda como **string `"YYYY-MM-DD"`** (en modo vista se muestra con `date.format`, default `dd/MM/yyyy`):

```vue
<script setup lang="ts">
import AdvancedTable from "@/components/data/AdvancedTable.vue";
import { ref } from "vue";

const columns = ref([
  { key: "nombre", label: "Nombre", editable: true },
  {
    key: "fecha",
    label: "Fecha",
    editable: true,
    inputType: "date",
    singleClick: true,
    date: {
      format: "dd/MM/yyyy",        // tokens iguales al <cu-date-picker>
      min: "2026-01-01",           // límite inferior (desde)
      max: "2026-12-31",           // límite superior (hasta)
      yearNavigation: true,        // botones « » de año en el calendario
      disabledWeekdays: "0,6",     // fines de semana deshabilitados
      disabledDates: "2026-08-15", // feriados puntuales
      position: "top", align: "start", // panel arriba
    },
  },
]);
</script>

<template>
  <AdvancedTable :columns="columns" :data="data" />
</template>
```

> El evento `edit-save` entrega el valor como `"YYYY-MM-DD"`. La config `date.*` acepta los mismos valores que las props del `<cu-date-picker>` (string `"0,6"` o array `[0,6]` para `disabledWeekdays`, etc.).

### Posición del panel (calendario arriba, etc.)

La config `date.*` acepta las props de posicionamiento del `<cu-date-picker>`:

| Prop de `date.*` | Valores | Default | Descripción |
|---|---|---|---|

| `position` | `"bottom"` \| `"top"` \| `"left"` \| `"right"` | `"bottom"` | Panel debajo, arriba o a los costados del trigger |
| `align` | `"start"` \| `"center"` \| `"end"` | `"start"` | Alineación horizontal del panel |
| `fixed` | `boolean` | `true` | Panel en `position: fixed` (default `true` en celdas editables para no romper el layout de la tabla) |

```vue
<script setup lang="ts">
import AdvancedTable from "@/components/data/AdvancedTable.vue";
import { ref } from "vue";

const columns = ref([
  // Panel arriba del trigger, alineado a la derecha
  { key: "fecha", label: "Fecha", editable: true, inputType: "date", date: { position: "top", align: "end" } },
]);
</script>

<template>
  <AdvancedTable :columns="columns" :data="data" />
</template>
```

> Con `fixed: false` el panel se posiciona en `absolute` respecto al trigger (puede recortarse si la celda/tabla tiene `overflow`). El default es `true` justamente para evitarlo.

### Edición con switch

`inputType: 'switch'` + `switch.*` para que la celda editable renderice un `<cu-switch>` **directamente, sin lápiz** (el switch siempre está visible, como el estado inline). El valor de la fila es booleano (`true` / `false`).

```vue
<script setup lang="ts">
import AdvancedTable from "@/components/data/AdvancedTable.vue";
import { ref } from "vue";

const columns = ref([
  { key: "nombre", label: "Nombre", editable: true },
  {
    key: "activo",
    label: "Activo",
    editable: true,
    inputType: "switch",
    switch: {
      size: "sm",        // "sm" | "md" (default "md")
      color: "success",  // color semántico del switch (default: el de la tabla)
    },
  },
]);
</script>

<template>
  <AdvancedTable :columns="columns" :data="data" />
</template>
```

| Campo de `switch.*` | Valores | Default | Descripción |
|---|---|---|---|
| `size` | `"sm"` \| `"md"` | `"md"` | Tamaño del switch |
| `color` | color semántico | color de la tabla | Color del switch |

> **Comportamiento:** al alternar el switch se emite `edit-save` inmediatamente con `value` **booleano** (`true` / `false`) y la tabla actualiza `row[key]`. El switch no pasa por modo lápiz ni por validación regex/`validator` (su valor siempre es booleano válido). Para arrancar "encendido", el dato debe venir con `activo: true`.

> **Alineación y ancho:** el switch **no ocupa todo el ancho de la celda** (`width: fit-content`) — queda con su tamaño natural y por defecto **centrado** para que el thumb recorra el recorrido completo sin deformarse. Para moverlo dentro de la celda usá `editorAlign` (campo de columna):

| Campo de columna | Valores | Default | Descripción |
|---|---|---|---|
| `editorAlign` | `"start"` \| `"center"` \| `"end"` | `"center"` para switch (si no hay `align`) | Alineación del editor dentro de la celda. Aplica a cualquier `inputType` cuyo editor no ocupe todo el ancho |

```vue
<script setup lang="ts">
import AdvancedTable from "@/components/data/AdvancedTable.vue";
import { ref } from "vue";

// Switch centrado (default) / a la izquierda / a la derecha
const columns = ref([
  { key: "activo", label: "Activo", editable: true, inputType: "switch" },
  { key: "envio", label: "Envío", editable: true, inputType: "switch", editorAlign: "start", switch: { color: "primary", size: "sm" } },
  { key: "garantia", label: "Garantía", editable: true, inputType: "switch", editorAlign: "end", switch: { color: "warning" } },
]);
</script>

<template>
  <AdvancedTable :columns="columns" :data="data" />
</template>
```

```vue
<script setup lang="ts">
import AdvancedTable from "@/components/data/AdvancedTable.vue";

function onEditSave(e: { index: number; value: boolean }) {
  console.log(`Fila ${e.index}: activo = ${e.value}`); // true / false
}
</script>

<template>
  <AdvancedTable :columns="columns" :data="data" @edit-save="onEditSave" />
</template>
```

### Badges y botones por celda

### Badges dinámicos

```vue
<script setup lang="ts">
import AdvancedTable from "@/components/data/AdvancedTable.vue";
import { ref } from "vue";

const columns = ref([
  {
    key: "estado",
    label: "Estado",
    badges: (row) => [{
      value: row.estado,
      color: row.estado === "Activo" ? "success" : "warning",
      variant: "soft",
    }],
  },
]);
</script>

<template>
  <AdvancedTable :columns="columns" :data="data" />
</template>
```

### Multi-badge con wrap

Si la función `badges` devuelve **varios** badges, el contenedor usa `flex-wrap: wrap`: los badges **saltan de línea entre sí** en lugar de estirarse en una fila larga. Ideal para columnas con etiquetas/tags múltiples (skills, roles, permisos). Limitá el ancho de la columna con `width` para que el wrap se active a partir de ese ancho.

```vue
<script setup lang="ts">
import AdvancedTable from "@/components/data/AdvancedTable.vue";
import { ref } from "vue";

const columns = ref([
  { key: "nombre", label: "Nombre" },
  {
    key: "skills",
    label: "Skills",
    width: "220px", // a partir de este ancho los badges hacen wrap
    badges: (row) => [
      { value: "Vue", color: "primary", variant: "soft" },
      { value: "TypeScript", color: "primary", variant: "soft" },
      { value: "Docker", color: "neutral", variant: "soft" },
      { value: "PostgreSQL", color: "warning", variant: "soft" },
      ...(row.senior ? [{ value: "Arquitectura", color: "secondary", variant: "soft" }] : []),
    ],
  },
]);
</script>

<template>
  <AdvancedTable :columns="columns" :data="data" />
</template>
```

### Botones condicionales

```vue
<script setup lang="ts">
import AdvancedTable from "@/components/data/AdvancedTable.vue";
import { ref } from "vue";

const columns = ref([
  {
    key: "acciones",
    label: "",
    buttons: (row) => {
      const btns = [];
      if (row.editado) {
        btns.push({
          icon: "<svg ...></svg>",
          color: "primary",
          variant: "solid",
          onClick: (r) => guardarCambios(r),
        });
      }
      btns.push({
        icon: row.activo
          ? "<svg ... check ...></svg>"
          : "<svg ... plus ...></svg>",
        color: row.activo ? "success" : "neutral",
        variant: "soft",
        onClick: (r) => toggleActivo(r),
      });
      btns.push({
        icon: "<svg ... trash ...></svg>",
        color: "danger",
        variant: "soft",
        onClick: (r) => eliminar(r),
      });
      return btns;
    },
  },
]);
</script>

<template>
  <AdvancedTable :columns="columns" :data="data" />
</template>
```

> Los iconos SVG deben usar `stroke="currentColor"` para que hereden el color del botón.

### Acciones de fila (botón "..." al final)

Más simple que definir una columna `buttons` para cada fila: pasá un array en `actions` y la tabla agrega automáticamente una columna al final con un dropdown.

```vue
<script setup lang="ts">
import AdvancedTable from "@/components/data/AdvancedTable.vue";
import { ref } from "vue";

const actions = ref([
  {
    label: "Editar",
    color: "primary",
    variant: "ghost",
    onClick: (row) => editar(row),
  },
  {
    label: "Duplicar",
    color: "neutral",
    variant: "ghost",
    onClick: (row) => duplicar(row),
  },
  { divider: true },
  {
    label: "Eliminar",
    color: "danger",
    variant: "ghost",
    onClick: (row) => eliminar(row),
  },
]);
</script>

<template>
  <AdvancedTable :columns="columns" :data="data" :actions="actions" />
</template>
```

> Items con `divider: true` renderizan una línea divisoria. Cada `onClick` recibe la fila completa.

### Estado de carga

Cuando `loading` es `true`, se muestra una barra delgada animada en el tope de la tabla:

```vue
<script setup lang="ts">
import AdvancedTable from "@/components/data/AdvancedTable.vue";
import { ref } from "vue";

const loading = ref(true); // mostrar
// ...fetch...
loading.value = false; // ocultar
</script>

<template>
  <AdvancedTable :loading="loading" />
</template>
```

### Footer (API programática)

Además del slot `footer` (ver [Slots](#slots)), el `<AdvancedTable>` expone una **prop `footer`** que permite definir filas de pie de forma programática — ideal para totales, resúmenes o notas al pie.

```vue
<script setup lang="ts">
import AdvancedTable from "@/components/data/AdvancedTable.vue";
import { computed, ref } from "vue";

const columns = ref([
  { key: "producto", label: "Producto" },
  { key: "precio", label: "Precio", align: "right" },
]);
const data = ref([
  { producto: "Widget A", precio: 250.0 },
  { producto: "Widget B", precio: 175.5 },
  { producto: "Widget C", precio: 320.0 },
]);

const total = computed(() => data.value.reduce((sum, row) => sum + row.precio, 0));

// Definir footer (múltiples filas)
const footer = ref([
  {
    cells: [
      { value: "Total", colspan: 1 },
      { value: `$${total.value.toFixed(2)}`, align: "right" },
    ],
  },
  {
    cells: [
      { value: "* Precios sin IVA", colspan: 2 },
    ],
  },
]);
</script>

<template>
  <AdvancedTable :columns="columns" :data="data" :footer="footer" />
</template>
```

**Interfaz:**

```ts
interface FooterCell {
  value: string;
  colspan?: number;
  align?: "left" | "center" | "right";
}

interface FooterRow {
  cells: FooterCell[];
}
```

> **Prioridad:** si el slot `footer` tiene contenido, tiene prioridad sobre la prop `footer`. Si no usás el slot, el `<tfoot>` se renderiza si `footer.length > 0`.

> **Múltiples filas:** cada elemento del array `footer` es una fila `<tr>` independiente.

### Patrón: edición con marca de "editado"

```vue
<script setup lang="ts">
import AdvancedTable from "@/components/data/AdvancedTable.vue";
import { ref, useTemplateRef } from "vue";

const columns = ref([
  { key: "nombre", label: "Nombre", editable: true, singleClick: true },
  {
    key: "tipo", label: "Tipo", editable: true, inputType: "select", singleClick: true,
    selectOptions: [{ value: "1", label: "Documento" }, { value: "2", label: "Expediente" }],
  },
]);

const data = ref([{ id: 1, nombre: "Acta", tipo: "1", editado: false }]);

const tabla = useTemplateRef("tabla");

function onEditSave(e: { index: number }) {
  // Marcar la fila como editada (aparece el botón guardar)
  tabla.value?.updateRow(e.index, { editado: true });
}
</script>

<template>
  <AdvancedTable ref="tabla" :columns="columns" :data="data" @edit-save="onEditSave" />
</template>
```

`updateRow` hace merge, así que solo actualiza `editado` sin pisar el resto.

### Recetas: estados de las celdas editables

### Receta 1 — Modo edición masiva con toggle (Vue)

Un botón que alterna toda la tabla entre modo lápiz y modo inline (todos los editores visibles). Ideal para "editar en lote".

```vue
<script setup lang="ts">
import { ref } from "vue";
import AdvancedTable from "@/components/data/AdvancedTable.vue";

const inlineEditing = ref(false); // ← estado reactivo
const data = ref([
  { id: 1, nombre: "Juan", email: "juan@x.com", rol: "admin" },
  { id: 2, nombre: "María", email: "maria@x.com", rol: "editor" },
]);

const columns = [
  { key: "nombre", label: "Nombre", editable: true },
  { key: "email", label: "Correo", editable: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
  {
    key: "rol", label: "Rol", editable: true, inputType: "select",
    selectOptions: [
      { value: "admin", label: "Admin" },
      { value: "editor", label: "Editor" },
    ],
  },
];
</script>

<template>
  <button @click="inlineEditing = !inlineEditing">
    {{ inlineEditing ? "Terminar edición" : "Editar en lote" }}
  </button>
  <AdvancedTable :columns="columns" :data="data" :inline-editing="inlineEditing" />
</template>
```

> Al apagar el estado, todas las celdas vuelven al lápiz sin perder los valores ya guardados (cada `edit-save` actualizó `data` en el momento).

### Receta 2 — Columna siempre editable (`inlineEdit`)

El estado inline se activa **por columna**:

```vue
<script setup lang="ts">
import AdvancedTable from "@/components/data/AdvancedTable.vue";
import { ref } from "vue";

const columns = ref([
  { key: "nombre", label: "Nombre", editable: true, inlineEdit: true }, // siempre inline
  { key: "email",  label: "Correo", editable: true },                   // modo lápiz
  {
    key: "rol", label: "Rol", editable: true, inlineEdit: true,
    inputType: "select",
    selectOptions: [
      { value: "admin",  label: "Administrador" },
      { value: "editor", label: "Editor" },
    ],
  },
]);

const data = ref([
  { nombre: "Juan Pérez", email: "juan@ejemplo.com", rol: "admin" },
  { nombre: "María García", email: "maria@ejemplo.com", rol: "editor" },
]);

function onEditSave(e: { column: { key: string }; value: string; index: number }) {
  console.log(`Guardado: ${e.column.key} = "${e.value}" (fila ${e.index})`);
}
</script>

<template>
  <AdvancedTable :columns="columns" :data="data" @edit-save="onEditSave" />
</template>
```

### Receta 3 — Estados mixtos + validación y edición condicional

Combiná lápiz e inline en la misma tabla, con validación por columna y celdas habilitadas según la fila:

```vue
<script setup lang="ts">
import AdvancedTable from "@/components/data/AdvancedTable.vue";
import { ref } from "vue";

const columns = ref([
  {
    key: "nombre", label: "Nombre",
    editable: true, inlineEdit: true,       // siempre inline
    validator: (v) => v.trim().length >= 3, // valida al guardar
  },
  {
    key: "email", label: "Correo",
    editable: (row) => row.activo,          // modo lápiz, solo si la fila está activa
    validator: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
  },
  {
    key: "estado", label: "Estado",
    editable: true,                         // modo lápiz (default)
    inputType: "select",
    selectOptions: [
      { value: "activo", label: "Activo" },
      { value: "inactivo", label: "Inactivo" },
    ],
  },
]);
</script>

<template>
  <AdvancedTable :columns="columns" :data="data" />
</template>
```

> **Nota:** `editable` como función controla el **modo lápiz** (habilita/deshabilita el click y atenúa la celda con `.cu-editable-cell-view--disabled`). En estado inline el editor se renderiza igual aunque la función devuelva `false`; usá `validator` para controlar qué se guarda.

### Receta 4 — Validar formato con regex (precio con 2 decimales)

`editable` acepta un **`RegExp`** como validador (además de `boolean` y función). Es la forma más corta de validar formato al guardar: precios, emails, DNIs, códigos, etc. **Los agentes rara vez lo usan** — acá está el patrón completo.

El regex se evalúa con `.test(value)` al guardar (Enter / blur / elegir opción en select). Si no matchea:

- El valor **no se guarda** (no se emite `edit-save`).
- Se emite [`edit-error`](#eventos) con `{ row, column, value, index }`.
- El editor se tiñe de rojo (prop `color: danger`) — aplica a **todos** los tipos de editor (input, textarea, select, autocomplete, date), no solo al input de texto.

Ejemplo: tabla de productos donde `precio` solo acepta números con **exactamente 2 decimales**:

```vue
<script setup lang="ts">
import AdvancedTable from "@/components/data/AdvancedTable.vue";
import { ref } from "vue";

const priceRegex = /^\d+\.\d{2}$/; // "1200.50" ✓ | "1200.555" ✗ | "1200.5" ✗ | "abc" ✗ | "12,50" ✗

const columns = ref([
  { key: "producto", label: "Producto" },
  { key: "precio", label: "Precio", editable: priceRegex }, // modo lápiz (default)
]);

const columnsInline = ref([
  { key: "producto", label: "Producto" },
  { key: "precio", label: "Precio", editable: priceRegex, inlineEdit: true }, // modo inline
]);
</script>

<template>
  <AdvancedTable :columns="columns" :data="data" />
</template>
```

Con el editor siempre visible (`inlineEdit`):

```vue
<script setup lang="ts">
import AdvancedTable from "@/components/data/AdvancedTable.vue";
import { ref } from "vue";

const columns = ref([
  { key: "producto", label: "Producto" },
  { key: "precio", label: "Precio", editable: /^\d+\.\d{2}$/, inlineEdit: true },
]);
</script>

<template>
  <AdvancedTable :columns="columns" :data="data" />
</template>
```

**Comportamiento al validar:**

| Acción | Resultado |
|--------|-----------|
| Escribís `1200.555` (más de 2 decimales) | No se guarda, el input se tiñe de rojo, emite `edit-error` |
| Escribís `25.99` (válido) | Se guarda (emite `edit-save`), el rojo desaparece |
| `Escape` | Cancela y limpia el estado de error |

> El tintado rojo no es un CSS aparte: es la misma prop `color="danger"` que recibe el editor cuando la validación falla. Si querés mostrar tu propio mensaje, escuchá `edit-error` (en Vue: `@edit-error`).

### Sticky header

El header es `position: sticky`. Sigue el scroll del contenedor de scroll más cercano:

- **Scroll de página:** si la tabla está en una página que scrollea (y ningún ancestro intermedio tiene `overflow` que cree un scroll container propio), el header se pega al tope de la página.
- **Scroll interno:** con `max-height` en la tabla, el header se pega al tope del área de scroll de la tabla.

En variantes transparentes (`outlined`, `ghost`) se aplica `backdrop-filter: blur(8px)` al header para mantener la legibilidad al scrollear contenido por debajo.

```vue
<template>
  <AdvancedTable
    search-enabled
    search-placeholder="Buscar..."
    style="width: 100%;"
  />
</template>
```

## Props

| Atributo | Tipo | Default | Descripción |
|------|------|------|------|
| `theme` | `string` | `""` | Tema: `light`, `dark`, `sigacadv2` (hereda de `<html data-theme>` si se omite) |
| `columns` | `Column[]` | `[]` | Definición de columnas (ver [Interfaz de columna](#interfaz-de-columna)). Se asigna como propiedad JS |
| `data` | `Record<string, any>[]` | `[]` | Filas de la tabla. Se asigna como propiedad JS |
| `empty` | `string` | `""` | Texto a mostrar cuando no hay datos. Si se omite, usa `"No hay datos que mostrar"` |
| `pagination` | `boolean` | `false` | Habilita paginación interna |
| `itemsPerPage` | `number` | `10` | Tamaño de página (atributo HTML: `items-per-page`) |
| `showPageSize` | `boolean` | `false` | Muestra selector de items por página (atributo HTML: `show-page-size`) |
| `pageSizeOptions` | `number[]` | `[5, 10, 20, 50]` | Opciones del selector (atributo HTML: `page-size-options`). Se asigna como propiedad JS |
| `color` | `string` | `"neutral"` | Color semántico: `primary`, `neutral`, `success`, `warning`, `danger` |
| `variant` | `string` | `"soft"` | `solid`, `outlined`, `soft`, `ghost`, `subtle` |
| `searchEnabled` | `boolean` | `false` | Habilita barra de búsqueda (atributo HTML: `search-enabled`) |
| `searchPlaceholder` | `string` | `"Buscar..."` | Placeholder del input de búsqueda (atributo HTML: `search-placeholder`) |
| `searchFields` | `string[]` | `[]` | Columnas donde buscar (atributo HTML: `search-fields`). Vacío = todas |
| `searchValue` | `string` | `""` | Valor controlado del buscador (atributo HTML: `search-value`) |
| `filters` | `Record<string, any>` | `{}` | Filtros por columna. Se asigna como propiedad JS |
| `loading` | `boolean` | `false` | Muestra una barra de carga animada en el tope |
| `actions` | `unknown[]` | `[]` | Acciones de fila (botón "..." al final de cada fila). Se asigna como propiedad JS |
| `rowDisabled` | `boolean \| ((row: Record<string, any>) => boolean)` | `false` | Deshabilita filas (ver [Deshabilitar filas, columnas y celdas](#deshabilitar-filas-columnas-y-celdas)). Se asigna como propiedad JS |
| `footer` | `FooterRow[]` | `[]` | Filas de footer (ver [Footer (API programática)](#footer-api-programática)). Se asigna como propiedad JS |

> **Pipeline interno:** `data → search → filters → sort → pagination`. El ordenamiento y la paginación operan sobre los datos ya filtrados.

> **`search-fields` como atributo HTML:** Es el único caso donde podés pasar un array como atributo. Usá JSON válido:
> ```html
> <cu-table search-fields='["nombre","tipo"]'></cu-table>
> ```
> Equivalente por JS: `tabla.searchFields = ["nombre", "tipo"]`.

## Eventos

| Evento | Payload (`e.detail`) | Descripción |
|------|------|------|
| `update:currentPage` | `number` | Cambio de página (tras búsqueda, filtro, sort o click) |
| `update:itemsPerPage` | `number` | Cambio del tamaño de página |
| `update:search` | `string` | Cambio en la query de búsqueda |
| `edit-start` | `{ row, column, index }` | Inicia edición de celda |
| `edit-save` | `{ row, column, value, index }` | Celda editada y guardada. La tabla ya actualizó `row[key]` antes de emitir |
| `edit-cancel` | `{ row, column, index }` | Edición cancelada |
| `edit-error` | `{ row, column, value, index }` | Validación falló (regex o `validator`): el valor **no** se guarda y el editor se tiñe de rojo (`color: danger`) |

> El Custom Element **no re-emite** los eventos `row-click`, `row-dblclick` ni `cell-click` (existen internamente pero no atraviesan el wrapper). Si necesitás reaccionar a clicks en filas, agregá un `ButtonConfig` o `BadgeConfig` a la columna correspondiente.

## Slots

| Slot | Descripción |
|------|------|
| `header` | Personaliza el header completo (todas las columnas) |
| `empty` | Contenido cuando no hay datos (override del texto `empty`) |

> **Importante:** Los slots `cell-{key}`, `search` y `footer` que aparecen en algunos ejemplos **no están expuestos** por el `<cu-table>` (el `.ce.vue` no los reenvía). Solo `header`, `header-{key}` y `empty`. Para footer en HTML plano, usá la [API programática](#footer-api-programática) (prop `footer` vía JS).

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

## Métodos expuestos

| Método | Descripción |
|------|------|
| `.updateRow(rowIndex: number, newData: Record<string, any>)` | Actualiza una fila por índice. Hace **merge** del objeto, no reemplazo total |
| `.getData()` | Devuelve copia de todos los datos |
| `.getRow(rowIndex: number)` | Devuelve copia de una fila |
| `.removeRow(rowIndex: number)` | Elimina una fila por índice |
| `.addRow(newRow: Record<string, any>)` | Agrega una fila al final |
| `.pushData(newData: Record<string, any>[])` | Agrega múltiples filas al final |

## Interfaces

### `BadgeConfig`

```ts
interface BadgeConfig {
  value: string;
  color?: string;
  variant?: string;
}
```

### `ButtonConfig`

```ts
interface ButtonConfig {
  label?: string;
  icon?: string | Component;
  onClick?: (row: Record<string, any>) => void;
  to?: string;
  target?: string;
  color?: string;
  variant?: string;
  disabled?: boolean;
}
```

### `FooterCell`

```ts
interface FooterCell {
  value: string;
  colspan?: number;
  align?: "left" | "center" | "right";
}
```

### `FooterRow`

```ts
interface FooterRow {
  cells: FooterCell[];
}
```

### `Column`

```ts
interface Column {
  key: string;
  label?: string;
  cell?: (row: Record<string, any>) => string | string[];
  editable?: boolean | RegExp | ((row: Record<string, any>) => boolean);
  inputType?: "input" | "textarea" | "select" | "autocomplete" | "date" | "switch";
  selectOptions?: { value: string; label: string }[] | ((row: Record<string, any>) => { value: string; label: string }[]);
  validator?: (value: string, row: Record<string, any>) => boolean;
  singleClick?: boolean;
  editorAlign?: "start" | "center" | "end"; // Alineación del editor en la celda (para celdas que no ocupan todo el ancho, ej. switch)
  switch?: {
    size?: "sm" | "md";
    color?: string;
  };
  badges?: (row: Record<string, any>) => BadgeConfig[];
  buttons?: (row: Record<string, any>) => ButtonConfig[];
  disabled?: boolean | ((row: Record<string, any>) => boolean); // Columna deshabilitada (opcional por fila)
  cellDisabled?: (row: Record<string, any>) => boolean; // Celda deshabilitada (intersección fila × columna)
}
```
