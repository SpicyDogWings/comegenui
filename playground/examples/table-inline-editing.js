// example-table-inline-editing.js — ✅ EDITABLE, borrá y poné tu ejemplo
// Receta: estados de las celdas editables del <cu-table>
//
//  - Modo lápiz (default): la celda muestra el valor con ✏️; click (o doble
//    click) para editar. Enter/blur guarda, Escape cancela → vuelve al lápiz.
//  - Estado inline (inlineEdit: true en la columna): el editor (input/select/
//    textarea) se renderiza SIEMPRE visible, sin lápiz. Enter guarda y el
//    editor permanece; Escape cancela y el editor permanece.
//
//  En el <cu-table> (Custom Element) el estado inline se activa POR COLUMNA.
//  La prop global `inlineEditing` solo existe en el componente Vue
//  AdvancedTable, no en el CE. Ver docs/skills/use-comegen/componentes/cu-table.md.
//
//  Uso: <cu-table id="tabla-estados"></cu-table> (ver index.html del playground)

const tabla = document.getElementById('tabla-estados');

const roles = [
  { value: 'admin', label: 'Administrador' },
  { value: 'editor', label: 'Editor' },
  { value: 'visor', label: 'Visor' },
];

tabla.columns = [
  {
    key: 'nombre',
    label: 'Nombre',
    editable: true,
    inlineEdit: true, // ← estado inline: input siempre visible
    validator: (val) => val.trim().length >= 3,
  },
  {
    key: 'email',
    label: 'Correo',
    editable: true, // ← modo lápiz: click para editar
    validator: (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
  },
  {
    key: 'rol',
    label: 'Rol',
    editable: true,
    inlineEdit: true, // ← estado inline con select
    inputType: 'select',
    select: {
      options: roles,
      placement: 'bottom-end',
    },
  },
  {
    key: 'estado',
    label: 'Estado',
    editable: true, // ← modo lápiz con single click
    singleClick: true,
    inputType: 'select',
    select: {
      options: [
        { value: 'Activo', label: 'Activo' },
        { value: 'Inactivo', label: 'Inactivo' },
      ],
    },
  },
];

tabla.data = [
  { nombre: 'Juan Pérez', email: 'juan@ejemplo.com', rol: 'admin', estado: 'Activo' },
  { nombre: 'María García', email: 'maria@ejemplo.com', rol: 'editor', estado: 'Activo' },
  { nombre: 'Carlos López', email: 'carlos@ejemplo.com', rol: 'visor', estado: 'Inactivo' },
];

// Eventos de los estados: cada acción de edición llega acá
tabla.addEventListener('edit-start', (e) => {
  logEvent(`edit-start: ${e.detail.column.key} (fila ${e.detail.index})`);
});

tabla.addEventListener('edit-save', (e) => {
  logEvent(`edit-save: ${e.detail.column.key} = "${e.detail.value}" (fila ${e.detail.index})`);
});

tabla.addEventListener('edit-cancel', (e) => {
  logEvent(`edit-cancel: ${e.detail.column.key} (fila ${e.detail.index})`);
});
