// ✅ EDITABLE — FileInput examples

const fi = document.getElementById('fiCompact');
fi.addEventListener('file-change', (e) => {
  const file = e.detail;
  logEvent(file ? `Archivo: ${file.name} (${(file.size / 1024).toFixed(1)}KB)` : 'Selección limpiada');
});

const fiDir = document.getElementById('fiDir');
fiDir.addEventListener('file-change', (e) => {
  const files = e.detail;
  if (files) {
    const f = Array.isArray(files) ? files : [files];
    logEvent(`${f.length} archivo(s): ${f.map(x => x.name).join(', ')}`);
  } else {
    logEvent('Selección limpiada');
  }
});
