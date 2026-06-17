// example.js — ✅ EDITABLE, experimentá acá

// ── Alert ──
const al = document.getElementById('miAlert');
al.addEventListener('close', () => {
  logEvent('Alert cerrado');
});

al.addEventListener('update:show', (e) => {
  logEvent(`Alert show: ${e.detail}`);
});
