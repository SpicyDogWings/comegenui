// ══════════════════════════════════════════════
// BASE FILE — no modificar
// Usá example.js para tus experimentos
// ══════════════════════════════════════════════
// Playground — lógica del playground (theme toggle, log, init)
const log = document.getElementById('log');
const btnTheme = document.getElementById('btnTheme');

function logEvent(msg) {
  const ts = new Date().toLocaleTimeString();
  log.textContent += `\n[${ts}] ${msg}`;
  log.scrollTop = log.scrollHeight;
}

// --- Theme ---
let dark = false;

function setTheme(isDark) {
  dark = isDark;
  if (isDark) document.body.classList.add('dark');
  else document.body.classList.remove('dark');
  btnTheme.textContent = isDark ? '☀️' : '🌙';
}

btnTheme.addEventListener('click', () => {
  setTheme(!dark);
  localStorage.setItem('theme', dark ? 'dark' : 'light');
});

const stored = localStorage.getItem('theme');
if (stored) {
  setTheme(stored === 'dark');
} else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
  setTheme(true);
}

// --- Dropdown events ---
const dd = document.getElementById('ddMain');
dd.addEventListener('open', () => logEvent('Dropdown abierto'));
dd.addEventListener('close', () => logEvent('Dropdown cerrado'));

logEvent('Playground listo');
