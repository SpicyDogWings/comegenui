// example.js — ✅ EDITABLE, experimentá acá
// `logEvent` y `log` están declarados en playground.js

// ── Autocomplete: escribe 3+ caracteres para abrir el menú ──

const input = document.getElementById('searchInput');
const ddSuggest = document.getElementById('ddSuggest');

const icon = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>';

const allItems = [
  { label: 'Administrador', icon },
  { label: 'Editor de contenido', icon },
  { label: 'Visor de reportes', icon },
  { label: 'Invitado externo', icon },
  { label: 'Supervisor', icon },
  { label: 'Analista de datos', icon },
  { label: 'Gestor de usuarios', icon },
];

input.addEventListener('input', () => {
  const val = input.get().trim();

  if (val.length < 3) {
    ddSuggest.close();
    return;
  }

  const filtered = allItems.filter(item =>
    item.label.toLowerCase().includes(val.toLowerCase()),
  );

  ddSuggest.items = filtered.map(item => ({
    ...item,
    onClick: () => {
      input.set(item.label);
      ddSuggest.close();
      logEvent(`Seleccionado: ${item.label}`);
    },
  }));

  ddSuggest.open();
});
