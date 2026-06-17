// example.js — ✅ EDITABLE, experimentá acá

// ── Select custom ──

const sel = document.getElementById('miSelect');

sel.options = [
  { value: '1', label: 'Administrador' },
  { value: '2', label: 'Editor de contenido' },
  { value: '3', label: 'Visor de reportes' },
  { value: '4', label: 'Invitado externo' },
  { value: '5', label: 'Supervisor' },
  { value: '6', label: 'Analista de datos' },
  { value: '7', label: 'Gestor de usuarios' },
];

sel.addEventListener('select', (e) => {
  logEvent(`Seleccionado: ${e.detail.label} (${e.detail.value})`);
});
