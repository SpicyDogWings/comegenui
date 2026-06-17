// example-table.js — ✅ EDITABLE, borrá y poné tu ejemplo
// Tabla con edición inline + Select + Autocomplete

const tabla = document.getElementById('tabla');

const roles = [
  { value: 'admin', label: 'Administrador' },
  { value: 'editor', label: 'Editor' },
  { value: 'visor', label: 'Visor' },
  { value: 'invitado', label: 'Invitado' },
];

const departamentos = [
  { label: 'Sistemas' },
  { label: 'Recursos Humanos' },
  { label: 'Contabilidad' },
  { label: 'Ventas' },
  { label: 'Marketing' },
  { label: 'Legal' },
  { label: 'Operaciones' },
  { label: 'Dirección' },
];

tabla.columns = [
  { key: 'nombre', label: 'Nombre', editable: true, singleClick: true },
  {
    key: 'depto',
    label: 'Departamento',
    editable: true,
    singleClick: true,
    inputType: 'autocomplete',
    autocompleteItems: departamentos,
  },
  {
    key: 'rol',
    label: 'Rol',
    editable: true,
    singleClick: true,
    inputType: 'select',
    selectOptions: roles,
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
