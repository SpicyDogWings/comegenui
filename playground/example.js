// example.js — ✅ EDITABLE, experimentá acá

// ── Input ──
const inp = document.getElementById('miInput');
inp.addEventListener('update:modelValue', (e) => {
  logEvent(`Input 1: "${e.detail}"`);
});
