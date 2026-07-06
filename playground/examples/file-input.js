// ✅ EDITABLE — FileInput examples

const fi = document.getElementById('fiBasic');
fi.addEventListener('file-change', (e) => {
  const files = e.detail;
  if (files) {
    const f = Array.isArray(files) ? files : [files];
    logEvent(`Archivos seleccionados: ${f.map(x => x.name).join(', ')}`);
  } else {
    logEvent('Selección limpiada');
  }
});

const fiMultiple = document.getElementById('fiMultiple');
fiMultiple.addEventListener('file-change', (e) => {
  const files = e.detail;
  if (files && Array.isArray(files)) {
    logEvent(`Múltiples (${files.length}): ${files.map(x => x.name).join(', ')}`);
  }
});

const fiDisabled = document.getElementById('fiDisabled');

const fiSoft = document.getElementById('fiSoft');
fiSoft.addEventListener('file-change', (e) => {
  const files = e.detail;
  if (files) {
    const f = Array.isArray(files) ? files : [files];
    logEvent(`Soft success: ${f.map(x => x.name).join(', ')}`);
  }
});

const fiMaxSize = document.getElementById('fiMaxSize');
fiMaxSize.addEventListener('file-change', (e) => {
  const files = e.detail;
  if (files) {
    const f = Array.isArray(files) ? files : [files];
    logEvent(`Ghost danger (max 1MB): ${f.map(x => `${x.name} (${(x.size / 1024).toFixed(1)}KB)`).join(', ')}`);
  }
});
