# ComegenUI — Ejemplos de uso

Ejemplos copy-pasteables de todos los componentes en HTML plano. Para la guía de instalación y patrones ver [`SKILL.md`](SKILL.md). Para detalles de API ver [`componentes/`](componentes/).

---

## Formularios

### Input

```html
<cu-input id="input" placeholder="Nombre" color="primary" variant="outlined"></cu-input>
<script src="dist/CuInput.umd.js"></script>
<script>
  const input = document.getElementById('input');
  await customElements.whenDefined('cu-input');
  input.set('valor');
  console.log(input.get());
  input.addEventListener('update:modelValue', (e) => console.log(e.detail));
</script>
```

### Textarea

```html
<cu-textarea id="ta" placeholder="Descripción" rows="4"></cu-textarea>
<script src="dist/CuTextarea.umd.js"></script>
<script>
  const ta = document.getElementById('ta');
  await customElements.whenDefined('cu-textarea');
  ta.set('texto largo...');
  ta.reset();
</script>
```

### Checkbox

```html
<cu-checkbox id="chk" label="Acepto los términos" color="primary"></cu-checkbox>
<script src="dist/CuCheckbox.umd.js"></script>
<script>
  const chk = document.getElementById('chk');
  await customElements.whenDefined('cu-checkbox');
  chk.set(true);
  console.log(chk.get());
  chk.addEventListener('change', (e) => console.log(e.detail));
</script>
```

### Switch

```html
<cu-switch id="sw" color="primary"></cu-switch>
<script src="dist/CuSwitch.umd.js"></script>
<script>
  const sw = document.getElementById('sw');
  await customElements.whenDefined('cu-switch');
  sw.set(true);
  sw.addEventListener('change', (e) => console.log(e.detail));
</script>
```

### Select

```html
<cu-select id="select"></cu-select>
<script src="dist/CuSelect.umd.js"></script>
<script>
  const s = document.getElementById('select');
  await customElements.whenDefined('cu-select');
  s.options = [{ value: 'a', label: 'Opción A' }, { value: 'b', label: 'Opción B' }];
  s.addEventListener('change', (e) => console.log('Elegido:', e.detail));
</script>
```

### Autocomplete

```html
<cu-autocomplete id="ac" placeholder="Buscar..." color="primary"></cu-autocomplete>
<script src="dist/CuAutocomplete.umd.js"></script>
<script>
  const ac = document.getElementById('ac');
  await customElements.whenDefined('cu-autocomplete');
  ac.items = [{ label: 'Opción 1' }, { label: 'Opción 2' }];
  ac.addEventListener('select', (e) => console.log('Seleccionado:', e.detail.label));
</script>
```

### File Input

```html
<cu-file-input id="file" accept="image/*" placeholder="Seleccionar archivo"></cu-file-input>
<script src="dist/CuFileInput.umd.js"></script>
<script>
  const file = document.getElementById('file');
  await customElements.whenDefined('cu-file-input');
  file.addEventListener('update:modelValue', (e) => console.log('Archivo:', e.detail));
</script>
```

### File Input Zone (drag & drop)

```html
<cu-file-input-zone id="zone" multiple accept="image/*"></cu-file-input-zone>
<script src="dist/CuFileInputZone.umd.js"></script>
<script>
  const zone = document.getElementById('zone');
  await customElements.whenDefined('cu-file-input-zone');
  zone.addEventListener('update:modelValue', (e) => console.log('Archivos:', e.detail));
</script>
```

---

## Botones

### Button

```html
<cu-button color="primary" variant="solid">Guardar</cu-button>
<cu-button variant="ghost" color="danger">Eliminar</cu-button>
<script src="dist/CuButton.umd.js"></script>
```

### Floating Button (FAB)

```html
<cu-floating-button id="fab" color="primary">
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
</cu-floating-button>
<script src="dist/CuFloatingButton.umd.js"></script>
<script>
  document.getElementById('fab').addEventListener('click', () => console.log('FAB'));
</script>
```

---

## Información

### Alert

```html
<cu-alert color="success" title="Listo">Operación exitosa</cu-alert>
<cu-alert color="warning" title="Atención" close></cu-alert>
<script src="dist/CuAlert.umd.js"></script>
```

### Badge

```html
<cu-badge color="primary" variant="solid">Nuevo</cu-badge>
<cu-badge color="success" variant="soft">Activo</cu-badge>
<script src="dist/CuBadge.umd.js"></script>
```

### Card

```html
<cu-card title="Título" subtitle="Subtítulo" color="primary">
  Contenido de la tarjeta.
  <div slot="footer">
    <cu-button color="primary" variant="soft">Acción</cu-button>
  </div>
</cu-card>
<script src="dist/CuCard.umd.js"></script>
```

### Label

```html
<cu-label label="Email" color="primary">
  <cu-input type="email" placeholder="correo@ejemplo.com"></cu-input>
</cu-label>
<script src="dist/CuLabel.umd.js"></script>
<script src="dist/CuInput.umd.js"></script>
```

---

## Data

### Table (con datos y footer)

```html
<cu-table id="tabla"></cu-table>
<script src="dist/CuTable.umd.js"></script>
<script>
  const t = document.getElementById('tabla');
  await customElements.whenDefined('cu-table');
  t.columns = [{ key: 'nombre', label: 'Nombre' }, { key: 'email', label: 'Email' }];
  t.data = [{ nombre: 'Ana', email: 'ana@test.com' }];
  t.footer = [{ cells: [{ value: 'Total', colspan: 1 }, { value: '1 usuario', align: 'right' }] }];
</script>
```

### Pagination

```html
<cu-pagination id="pag" current-page="1" total-pages="10" items-per-page="10"></cu-pagination>
<script src="dist/CuPagination.umd.js"></script>
<script>
  const pag = document.getElementById('pag');
  await customElements.whenDefined('cu-pagination');
  pag.addEventListener('update:currentPage', (e) => console.log('Página:', e.detail));
</script>
```

---

## Overlay

### Modal

```html
<cu-modal id="modal" title="Confirmar">
  <p>¿Estás seguro?</p>
</cu-modal>
<cu-button onclick="document.getElementById('modal').open()">Abrir</cu-button>
<script src="dist/CuModal.umd.js"></script>
<script>
  const modal = document.getElementById('modal');
  await customElements.whenDefined('cu-modal');
  modal.addEventListener('closed', (e) => {
    if (e.detail?.action === 'confirm') confirmar();
  });
</script>
```

### Dropdown Menu

```html
<cu-dropdown-menu id="menu" label="Opciones" color="primary">
  <span>Contenido del panel</span>
</cu-dropdown-menu>
<script src="dist/CuDropdownMenu.umd.js"></script>
<script>
  const menu = document.getElementById('menu');
  await customElements.whenDefined('cu-dropdown-menu');
  menu.items = [
    { label: 'Editar', onClick: () => console.log('editar') },
    { label: 'Eliminar', onClick: () => console.log('eliminar') },
  ];
</script>
```

---

## Navegación

### Tabs

```html
<cu-tabs id="tabs" variant="pills">
  <div slot="general">Contenido General</div>
  <div slot="advanced">Contenido Advanced</div>
</cu-tabs>
<script src="dist/CuTabs.umd.js"></script>
<script>
  const tabs = document.getElementById('tabs');
  await customElements.whenDefined('cu-tabs');
  tabs.tabs = [{ key: 'general', label: 'General' }, { key: 'advanced', label: 'Advanced' }];
  tabs.addEventListener('change', (e) => console.log('Activo:', e.detail));
</script>
```

### Collapse

```html
<cu-collapse label="Más información" color="primary">
  <p>Contenido colapsable.</p>
</cu-collapse>
<script src="dist/CuCollapse.umd.js"></script>
```

---

## Fechas

### Calendar

```html
<cu-calendar id="cal" color="primary"></cu-calendar>
<script src="dist/CuCalendar.umd.js"></script>
<script>
  const cal = document.getElementById('cal');
  await customElements.whenDefined('cu-calendar');
  cal.addEventListener('change', (e) => console.log('Fecha:', e.detail));
</script>
```

### Date Picker

```html
<cu-date-picker id="fecha"></cu-date-picker>
<script src="dist/CuDatePicker.umd.js"></script>
<script>
  const fecha = document.getElementById('fecha');
  await customElements.whenDefined('cu-date-picker');
  fecha.addEventListener('change', (e) => console.log(e.detail));
</script>
```

### Date Picker Range

```html
<cu-date-picker-range id="rango"></cu-date-picker-range>
<script src="dist/CuDatePickerRange.umd.js"></script>
<script>
  const rango = document.getElementById('rango');
  await customElements.whenDefined('cu-date-picker-range');
  rango.addEventListener('change', (e) => console.log(e.detail)); // { start, end }
</script>
```

---

## Otros

### Color Picker

```html
<cu-color-picker id="color" color="primary"></cu-color-picker>
<script src="dist/CuColorPicker.umd.js"></script>
<script>
  const cp = document.getElementById('color');
  await customElements.whenDefined('cu-color-picker');
  cp.set('#ff5733');
  cp.addEventListener('change', (e) => console.log('Color:', e.detail));
</script>
```

### Markdown

```html
<cu-markdown>
# Título

Texto con **negrita** y *cursiva*.

| Col A | Col B |
|-------|-------|
| a     | b     |
</cu-markdown>
<script src="dist/CuMarkdown.umd.js"></script>
```
