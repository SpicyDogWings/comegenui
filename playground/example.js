// example.js — ✅ EDITABLE, experimentá acá

// ── Autocomplete ──
const ac = document.getElementById('miAc');

ac.items = [
  { label: 'Administrador' },
  { label: 'Editor de contenido' },
  { label: 'Visor de reportes' },
  { label: 'Invitado externo' },
  { label: 'Supervisor' },
  { label: 'Analista de datos' },
  { label: 'Gestor de usuarios' },
];

ac.addEventListener('select', (e) => {
  logEvent(`Seleccionado: ${e.detail.label} (${e.detail.value || e.detail.label})`);
});

ac.addEventListener('blur', () => {
  logEvent('Blur (perdió foco)');
});

// También podés setear valores:
// ac.set('Editor');
// console.log('Valor actual:', ac.get());
