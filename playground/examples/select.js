// examples/select.js — Select playground

const roles = [
  { value: 'admin', label: 'Administrador' },
  { value: 'editor', label: 'Editor' },
  { value: 'visor', label: 'Visor' },
  { value: 'invitado', label: 'Invitado' },
  { value: 'supervisor', label: 'Supervisor', disabled: true },
];

['selLight', 'selDark', 'selSIGACAD'].forEach((id) => {
  const sel = document.getElementById(id);
  if (sel) sel.options = roles;
});

document.querySelectorAll('cu-select').forEach((sel) => {
  sel.addEventListener('change', (e) => {
    const theme = sel.closest('[data-theme]')?.getAttribute('data-theme') || 'global';
    logEvent(`[${theme}] change → ${e.detail?.value || sel.value}`);
  });
});
