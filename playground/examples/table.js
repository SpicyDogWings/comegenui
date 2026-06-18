// example-table.js — ✅ EDITABLE, borrá y poné tu ejemplo
// Tabla con edición inline + Select + Autocomplete

const tabla = document.getElementById('tabla');

const roles = [
  { value: 'admin', label: 'Administrador' },
  { value: 'editor', label: 'Editor' },
  { value: 'visor', label: 'Visor' },
  { value: 'invitado', label: 'Invitado' },
  { value: 'supervisor', label: 'Supervisor', disabled: true },
];

const departamentos = [
  { label: 'Sistemas' },
  { label: 'Recursos Humanos' },
  { label: 'Contabilidad' },
  { label: 'Ventas' },
  { label: 'Marketing' },
  { label: 'Legal' },
  { label: 'Operaciones' },
  { label: 'Dirección', disabled: true },
];

tabla.columns = [
  { key: 'nombre', label: 'Nombre', editable: true, singleClick: true, validator: (val) => val.length >= 3 },
  {
    key: 'depto',
    label: 'Departamento',
    editable: true,
    singleClick: true,
    inputType: 'autocomplete',
    autocomplete: {
      items: departamentos,
      color: (row) => row.depto === 'Sistemas' ? '#1774A4' : '#2c2c2c',
    },
  },
  {
    key: 'rol',
    label: 'Rol',
    editable: true,
    singleClick: true,
    inputType: 'select',
    select: {
      options: roles,
      color: (row) => row.estado === 'Activo' ? '#22c55e' : '#f59e0b',
      placement: 'bottom-end',
    },
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

tabla.data = [
  { nombre: 'Juan Pérez', depto: 'Sistemas', rol: 'admin', estado: 'Activo' },
  { nombre: 'María García', depto: 'RRHH', rol: 'editor', estado: 'Activo' },
  { nombre: 'Carlos López', depto: 'Contabilidad', rol: 'visor', estado: 'Inactivo' },
  { nombre: 'Ana Martínez', depto: 'Sistemas', rol: 'admin', estado: 'Activo' },
  { nombre: 'Pedro Sánchez', depto: 'Ventas', rol: 'invitado', estado: 'Activo' },
  { nombre: 'Laura Díaz', depto: 'Marketing', rol: 'editor', estado: 'Inactivo' },
  { nombre: 'Diego Torres', depto: 'Operaciones', rol: 'visor', estado: 'Activo' },
  { nombre: 'Sofía Ruiz', depto: 'Legal', rol: 'invitado', estado: 'Activo' },
  { nombre: 'Miguel Ángel', depto: 'Dirección', rol: 'admin', estado: 'Inactivo' },
  { nombre: 'Valentina Ortiz', depto: 'Marketing', rol: 'editor', estado: 'Activo' },
];

tabla.addEventListener('edit-save', (e) => {
  logEvent(`Editado: ${e.detail.column.key} = "${e.detail.value}" (fila ${e.detail.index})`);
});

// ── Actions (menú ⋮ al final de cada fila) ──
const editIcon = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>';
const trashIcon = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>';

tabla.actions = [
  {
    label: 'Editar',
    icon: editIcon,
    color: 'primary',
    onClick: (row) => logEvent(`Editar: ${row.nombre}`),
  },
  {
    label: 'Eliminar',
    icon: trashIcon,
    color: 'danger',
    onClick: (row) => logEvent(`Eliminar: ${row.nombre}`),
  },
];
