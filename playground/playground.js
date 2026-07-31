// ══════════════════════════════════════════════
// BASE FILE — no modificar
// ══════════════════════════════════════════════
const btnTheme = document.getElementById('btnTheme');

// --- Theme ---
let dark = false;

function setTheme(isDark) {
  dark = isDark;
  if (isDark) {
    document.body.classList.add('dark');
    document.documentElement.setAttribute('data-theme', 'dark');
  } else {
    document.body.classList.remove('dark');
    document.documentElement.setAttribute('data-theme', 'light');
  }
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
