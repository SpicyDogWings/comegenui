// example.js — ✅ EDITABLE, experimentá acá
// `logEvent` y `log` están declarados en playground.js

// ── Autocomplete ──

const ac = document.getElementById('ac');

const icon = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>';

ac.items = [
  { label: 'Administrador', icon },
  { label: 'Editor de contenido', icon },
  { label: 'Visor de reportes', icon },
  { label: 'Invitado externo', icon },
  { label: 'Supervisor', icon },
  { label: 'Analista de datos', icon },
  { label: 'Gestor de usuarios', icon },
];

ac.addEventListener('select', (e) => {
  logEvent(`Seleccionado: ${e.detail.label}`);
});
