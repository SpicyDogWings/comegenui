// example.js — Edita este archivo para tus experimentos
// `dd` ya está declarado en playground.js, úsalo directamente

const pencil = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.168 16.931a.5.5 0 0 0-.131.237l-.8 2.685a.5.5 0 0 0 .61.61l2.685-.8a.5.5 0 0 0 .237-.13z"/><path d="M17.25 3.75 20.25 6.75"/></svg>';
const copy = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>';
const download = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>';
const trash = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>';

dd.items = [
  { label: 'Editar', icon: pencil, onClick: () => logEvent('✏️ Editar') },
  { label: 'Duplicar', icon: copy, onClick: () => logEvent('📋 Duplicar') },
  { label: 'Exportar', icon: download, onClick: () => logEvent('📤 Exportar') },
  { divider: true },
  { label: 'Eliminar', icon: trash, color: 'danger', onClick: () => logEvent('🗑️ Eliminar') },
];
