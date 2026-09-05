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

## Guía rápida

Ejemplos de los componentes más usados. Para todos los ejemplos (25 componentes) ver [`ejemplos.md`](ejemplos.md).

### Button + Alert

```html
<cu-button color="primary" variant="solid">Guardar</cu-button>
<cu-alert color="success" title="Listo">Operación exitosa</cu-alert>
<script src="dist/CuButton.umd.js"></script>
<script src="dist/CuAlert.umd.js"></script>
```

### Table (con datos)

```html
<cu-table id="tabla"></cu-table>
<script src="dist/CuTable.umd.js"></script>
<script>
  const t = document.getElementById('tabla');
  await customElements.whenDefined('cu-table');
  t.columns = [{ key: 'nombre', label: 'Nombre' }];
  t.data = [{ nombre: 'Ana' }];
</script>
```

### Modal

```html
<cu-modal id="modal" title="Confirmar"><p>¿Estás seguro?</p></cu-modal>
<cu-button onclick="document.getElementById('modal').open()">Abrir</cu-button>
<script src="dist/CuModal.umd.js"></script>
```

### Select

```html
<cu-select id="select"></cu-select>
<script src="dist/CuSelect.umd.js"></script>
<script>
  const s = document.getElementById('select');
  await customElements.whenDefined('cu-select');
  s.options = [{ value: 'a', label: 'Opción A' }];
</script>
```

---

## Actualización

El zip incluye scripts para actualizar la lib en el proyecto huésped:

**Linux / macOS / Git Bash:**
```bash
./update.sh          # último build de main
./update.sh v3.0.0   # build de un tag/release
```

**Windows (PowerShell):**
```powershell
.\update.ps1            # último build de main
.\update.ps1 v3.0.0    # build de un tag/release
```

**Qué hace:**
1. Descarga el artifact de GitLab (según tag o main)
2. Reemplaza la carpeta de forma atómico (si falla, lo anterior queda intacto)
3. Instala la skill de uso en `.agents/skills/use-comegen/` del proyecto huésped

**Variables opcionales:**
- Linux: `CG_URL`, `CG_PROJECT_ROOT`
- Windows: `$env:CG_URL`, `$env:CG_PROJECT_ROOT`

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
- [\<cu-pagination\>](componentes/cu-pagination.md) — Paginación
- [\<cu-select\>](componentes/cu-select.md) — Selector
- [\<cu-switch\>](componentes/cu-switch.md) — Switch/Toggle
- [\<cu-tabs\>](componentes/cu-tabs.md) — Pestañas
- [\<cu-table\>](componentes/cu-table.md) — Tabla avanzada
- [\<cu-textarea\>](componentes/cu-textarea.md) — Textarea
