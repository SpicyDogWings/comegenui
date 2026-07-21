// ✅ EDITABLE — FileInput examples

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

// --- Test .set() en cu-file-input ---
(async function testSetMethod() {
  await customElements.whenDefined('cu-file-input');
  logEvent('cu-file-input definido');

  const firstInput = document.querySelector('cu-file-input');
  if (firstInput) {
    // Check what methods are available
    const methods = [];
    for (const key of ['get', 'set', 'reset', 'focus', 'trigger']) {
      if (typeof firstInput[key] === 'function') methods.push(key);
      else methods.push(`${key}(${typeof firstInput[key]})`);
    }
    logEvent('Métodos: ' + methods.join(', '));

    // Try .set()
    try {
      const testFile = new File(['test'], 'test.txt', { type: 'text/plain' });
      firstInput.set(testFile);
      logEvent('.set() OK — archivo: ' + firstInput.get()?.name);
    } catch (e) {
      logEvent('.set() ERROR: ' + e.message);
    }

    // Try .modelValue
    try {
      const testFile2 = new File(['test2'], 'test2.txt', { type: 'text/plain' });
      firstInput.modelValue = testFile2;
      setTimeout(() => {
        logEvent('.modelValue seteado, get(): ' + firstInput.get()?.name);
      }, 100);
    } catch (e) {
      logEvent('.modelValue ERROR: ' + e.message);
    }
  } else {
    logEvent('No se encontró cu-file-input');
  }
})();
