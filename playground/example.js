// example.js — ✅ EDITABLE, experimentá acá

// ── Tabla con edición inline + Select custom ──
const tabla = document.getElementById('tabla');

const roles = [
  { value: 'admin', label: 'Administrador' },
  { value: 'editor', label: 'Editor' },
  { value: 'visor', label: 'Visor' },
  { value: 'invitado', label: 'Invitado' },
];

tabla.columns = [
  { key: 'nombre', label: 'Nombre', editable: true, singleClick: true },
  { key: 'email', label: 'Correo', editable: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, singleClick: true },
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
  { nombre: 'Juan Pérez', email: 'juan@empresa.com', rol: 'admin', estado: 'Activo' },
  { nombre: 'María García', email: 'maria@empresa.com', rol: 'editor', estado: 'Activo' },
  { nombre: 'Carlos López', email: 'carlos@empresa.com', rol: 'visor', estado: 'Inactivo' },
  { nombre: 'Ana Martínez', email: 'ana@empresa.com', rol: 'admin', estado: 'Activo' },
  { nombre: 'Pedro Sánchez', email: 'pedro@empresa.com', rol: 'invitado', estado: 'Activo' },
  { nombre: 'Laura Díaz', email: 'laura@empresa.com', rol: 'editor', estado: 'Inactivo' },
  { nombre: 'Diego Torres', email: 'diego@empresa.com', rol: 'visor', estado: 'Activo' },
  { nombre: 'Sofía Ruiz', email: 'sofia@empresa.com', rol: 'invitado', estado: 'Activo' },
  { nombre: 'Miguel Ángel', email: 'miguel@empresa.com', rol: 'admin', estado: 'Inactivo' },
  { nombre: 'Valentina Ortiz', email: 'valentina@empresa.com', rol: 'editor', estado: 'Activo' },
];

tabla.addEventListener('edit-save', (e) => {
  logEvent(`Editado: ${e.detail.column.key} = "${e.detail.value}" (fila ${e.detail.index})`);
});
