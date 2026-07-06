// ✅ EDITABLE — FileInput example

const fi = document.getElementById('fiDir');
fi.addEventListener('file-change', (e) => {
  const files = e.detail;
  if (files) {
    const f = Array.isArray(files) ? files : [files];
    logEvent(`${f.length} archivo(s): ${f.map(x => x.name).join(', ')}`);
  } else {
    logEvent('Selección limpiada');
  }
});
