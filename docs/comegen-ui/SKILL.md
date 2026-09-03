---
name: comegen-ui
description: Guía de uso de los componentes de ComegenUI 2.0 como Web Components (Custom Elements) consumibles desde HTML plano con UMD
---

# ComegenUI — Web Components

Componentes UI como Custom Elements nativos, construidos con Vue 3 pero **utilizables en HTML plano, vanilla JS, o cualquier framework**.

Cada componente se distribuye como archivo **UMD** independiente que se auto-registra como Custom Element al cargarse. Sin Vue, sin dependencias.

> **Regla de oro:** Pasás arrays/objetos por JS (no por atributo HTML), escuchás eventos por `addEventListener`, y usás `customElements.whenDefined` antes de tocar la API del componente.

---

## Instalación

```html
<!DOCTYPE html>
<html lang="es" data-theme="light">
<head>
  <meta charset="UTF-8" />
  <link rel="stylesheet" href="dist/css/themes.css" />
</head>
<body>
  <cu-button color="primary" variant="solid">Guardar</cu-button>

  <script src="dist/CuButton.umd.js"></script>
</body>
</html>
```

- Cargá solo los `.umd.js` que necesités desde `dist/`
- Incluí `dist/css/themes.css` para los tokens de color
- Cada `<script>` registra su Custom Element automáticamente

---

## Guía rápida de uso

Ejemplos copy-pasteables. Para detalles completos ver [`componentes/`](componentes/).

### Botón

```html
<cu-button color="primary" variant="solid">Guardar</cu-button>
<cu-button variant="ghost" color="danger">Eliminar</cu-button>
<script src="dist/CuButton.umd.js"></script>
```

### Alerta

```html
<cu-alert color="success" title="Listo">Operación exitosa</cu-alert>
<cu-alert color="warning" title="Atención" close></cu-alert>
<script src="dist/CuAlert.umd.js"></script>
```

### Tabla (con datos y footer)

```html
<cu-table id="tabla"></cu-table>
<script src="dist/CuTable.umd.js"></script>
<script>
  const t = document.getElementById('tabla');
  await customElements.whenDefined('cu-table');
  t.columns = [
    { key: 'nombre', label: 'Nombre' },
    { key: 'email', label: 'Email' },
  ];
  t.data = [
    { nombre: 'Ana', email: 'ana@test.com' },
  ];
  // Footer programático
  t.footer = [{ cells: [{ value: 'Total', colspan: 1 }, { value: '1 usuario', align: 'right' }] }];
</script>
```

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

### Date Picker

```html
<cu-date-picker id="fecha"></cu-date-picker>
<cu-date-picker-range id="rango"></cu-date-picker-range>
<script src="dist/CuDate-picker.umd.js"></script>
<script src="dist/CuDate-picker-range.umd.js"></script>
<script>
  const rango = document.getElementById('rango');
  await customElements.whenDefined('cu-date-picker-range');
  rango.addEventListener('change', (e) => console.log(e.detail)); // { start, end }
</script>
```

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
  tabs.tabs = [
    { key: 'general', label: 'General' },
    { key: 'advanced', label: 'Advanced' },
  ];
  tabs.addEventListener('change', (e) => console.log('Activo:', e.detail));
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

---

## Temas

Tres temas: `light` (default), `dark`, `sigacadv2`.

```html
<html data-theme="dark">           <!-- Global -->
<cu-button theme="sigacadv2">      <!-- Por componente -->
```

Prioridad: `theme` prop → `data-theme` en `<html>` → `prefers-color-scheme` del OS.

---

## Patrones de uso

### Esperar al componente listo

```js
await customElements.whenDefined('cu-table');
tabla.columns = [...];
```

### Props complejas (arrays/objetos) — SIEMPRE por JS

```js
select.options = [{ value: 'a', label: 'A' }];
tabla.columns = [{ key: 'nombre', label: 'Nombre' }];
```

> No como atributo HTML: `select-options="..."` no funciona (se recibe como string).

### Booleanos en HTML

```html
<cu-button disabled>...</cu-button>
<cu-alert close>...</cu-alert>
<cu-table pagination search-enabled>...</cu-table>
```

### camelCase → kebab-case en HTML

```html
<cu-input read-only placeholder="..."></cu-input>
<cu-pagination items-per-page="20"></cu-pagination>
```

### Eventos custom

```js
element.addEventListener('edit-save', (e) => {
  console.log(e.detail); // payload
});
```

> Eventos nativos (`click`, `change`, `focus`) burbujean automáticamente desde el Shadow DOM.

---

## Referencia

Para tablas completas de archivos, colores por tema, variantes por componente, defaults y tamaños de bundle → [`referencia.md`](referencia.md).

---

## Documentación por componente

- [\<cu-alert\>](componentes/cu-alert.md) — Alerta
- [\<cu-autocomplete\>](componentes/cu-autocomplete.md) — Autocompletado
- [\<cu-badge\>](componentes/cu-badge.md) — Badge
- [\<cu-button\>](componentes/cu-button.md) — Botón
- [\<cu-calendar\>](componentes/cu-calendar.md) — Calendario de mes
- [\<cu-card\>](componentes/cu-card.md) — Tarjeta
- [\<cu-checkbox\>](componentes/cu-checkbox.md) — Checkbox
- [\<cu-collapse\>](componentes/cu-collapse.md) — Colapsable
- [\<cu-color-picker\>](componentes/cu-color-picker.md) — Selector de color
- [\<cu-date-picker\>](componentes/cu-date-picker.md) — Selector de fecha
- [\<cu-date-picker-range\>](componentes/cu-date-picker-range.md) — Rango de fechas
- [\<cu-dropdown-menu\>](componentes/cu-dropdown-menu.md) — Menú desplegable
- [\<cu-file-input\>](componentes/cu-file-input.md) — Input de archivo
- [\<cu-file-input-zone\>](componentes/cu-file-input-zone.md) — Zona drag & drop
- [\<cu-floating-button\>](componentes/cu-floating-button.md) — Botón flotante
- [\<cu-input\>](componentes/cu-input.md) — Input de texto
- [\<cu-label\>](componentes/cu-label.md) — Label
- [\<cu-markdown\>](componentes/cu-markdown.md) — Renderizador Markdown
- [\<cu-modal\>](componentes/cu-modal.md) — Modal
- [\<cu-month-slider\>](componentes/cu-month-slider.md) — Slider de meses
- [\<cu-year-slider\>](componentes/cu-year-slider.md) — Slider de años
- [\<cu-pagination\>](componentes/cu-pagination.md) — Paginación
- [\<cu-select\>](componentes/cu-select.md) — Selector
- [\<cu-switch\>](componentes/cu-switch.md) — Switch/Toggle
- [\<cu-tabs\>](componentes/cu-tabs.md) — Pestañas
- [\<cu-table\>](componentes/cu-table.md) — Tabla avanzada
- [\<cu-textarea\>](componentes/cu-textarea.md) — Textarea
