---
name: comegen-ui
description: Guía de uso de los componentes de ComegenUI 2.0 como Web Components (Custom Elements) consumibles desde HTML plano con UMD
disable-model-invocation: false
---

# ComegenUI — Web Components

Librería de componentes UI como Custom Elements nativos, construidos con Vue 3 pero **utilizables en HTML plano, vanilla JS, o cualquier framework** (React, Angular, Svelte, etc.).

Cada componente se distribuye como un archivo **UMD** independiente que se auto-registra como Custom Element al cargarse. No necesitas Vue ni ninguna dependencia.

> **Importante:** Toda la documentación asume consumo vía UMD (HTML plano + `<script>`). Las props se pasan como atributos HTML o propiedades DOM, los eventos con `addEventListener`, y los arrays/objetos se asignan por JS. No se documentan detalles internos de Vue.

---

## Índice

- [Instalación](#instalación)
- [Sistema de Temas](#sistema-de-temas)
- [Sistema de Color y Variantes](#sistema-de-color-y-variantes)
- [Notas Técnicas](#notas-técnicas)
- [Componentes](componentes/)

---

## Instalación

### En HTML plano (recomendado)

Carga solo los componentes que necesites desde la carpeta `dist/`:

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Mi App con ComegenUI</title>
</head>
<body>
  <cu-button color="primary" variant="solid">Guardar</cu-button>
  <cu-alert color="success" title="Listo">Operación exitosa</cu-alert>

  <script src="dist/CuButton.umd.js"></script>
  <script src="dist/CuAlert.umd.js"></script>
</body>
</html>
```

Cada `<script>` registra automáticamente su Custom Element. Los componentes están listos para usarse inmediatamente después de cargar el script.

### Archivos disponibles

| Archivo (en `dist/`) | Tag | Componente |
|----------------------|-----|------------|
| `CuButton.umd.js` | `<cu-button>` | Botón |
| `CuAlert.umd.js` | `<cu-alert>` | Alerta |
| `CuBadge.umd.js` | `<cu-badge>` | Badge |
| `CuInput.umd.js` | `<cu-input>` | Input de texto |
| `CuCheckbox.umd.js` | `<cu-checkbox>` | Checkbox |
| `CuTextarea.umd.js` | `<cu-textarea>` | Textarea |
| `CuSelect.umd.js` | `<cu-select>` | Selector |
| `CuSwitch.umd.js` | `<cu-switch>` | Switch/Toggle |
| `CuLabel.umd.js` | `<cu-label>` | Label |
| `CuModal.umd.js` | `<cu-modal>` | Modal |
| `CuPagination.umd.js` | `<cu-pagination>` | Paginación |
| `CuTable.umd.js` | `<cu-table>` | Tabla avanzada |
| `CuDropdownMenu.umd.js` | `<cu-dropdown-menu>` | Menú desplegable |
| `CuDropdown.umd.js` | `<cu-dropdown>` | Dropdown (obsoleto) |

### Esperar a que los Custom Elements estén listos

Para interactuar con un componente desde JS justo después de cargar la página:

```html
<script>
  customElements.whenDefined('cu-modal').then(() => {
    document.getElementById('miModal').open();
  });

  // O con async/await
  async function init() {
    await customElements.whenDefined('cu-table');
    const tabla = document.getElementById('miTabla');
    tabla.columns = [...];
    tabla.data = [...];
  }
  document.addEventListener('DOMContentLoaded', init);
</script>
```

### En proyectos con bundler (npm)

```bash
pnpm add comegenui
```

Luego importas los componentes que necesites:

```js
import 'comegenui/dist/CuButton.umd.js';
import 'comegenui/dist/CuAlert.umd.js';
```

---

## Sistema de Temas

Tres temas integrados: `light` (default), `dark`, `sigacadv2`.

### Tema global (recomendado)

```html
<html data-theme="dark">
  <!-- Todos los componentes usan el tema oscuro -->
  <cu-button color="primary">Guardar</cu-button>
</html>
```

### Tema por componente

```html
<cu-button color="primary" theme="sigacadv2">Guardar</cu-button>
```

Si se especifica `theme`, tiene prioridad sobre `data-theme`. Si se omite, hereda del `<html>`.

### Colores de cada tema

| Color | `light` | `dark` | `sigacadv2` |
|-------|---------|--------|-------------|
| `primary` | `#1774A4` | `#38bdf8` | `#0037FF` |
| `neutral` | `#2c2c2c` | `#e5e5e5` | `#1a1a1a` |
| `success` | `#22c55e` | `#4ade80` | `#28a745` |
| `warning` | `#f59e0b` | `#fbbf24` | `#ffc107` |
| `danger` | `#ef4444` | `#f87171` | `#dc3545` |

---

## Sistema de Color y Variantes

Cada componente que usa color acepta dos props clave:

| Prop | Valores | Default | Descripción |
|------|---------|---------|-------------|
| `color` | `primary`, `neutral`, `success`, `warning`, `danger` | Componente | Color semántico |
| `variant` | Varía por componente | Varía | Estilo visual |

### Variantes disponibles por componente

| Variante | Button | Alert | Badge | Input | Checkbox | Textarea | Pagination | Table | DropdownMenu |
|----------|--------|-------|-------|-------|----------|----------|------------|-------|----------|
| `solid` | ✓ | ✓ | ✓ | — | — | — | — | ✓ | ✓ |
| `outlined` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| `soft` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| `ghost` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| `subtle` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| `link` | ✓ | — | — | — | — | — | — | ✓ | — |
| `none` | — | — | — | ✓ | ✓ | ✓ | — | — | — |

---

## Notas Técnicas

### Eventos en Custom Elements

Los eventos emitidos por los componentes se reciben con `addEventListener`. El payload está en `event.detail`:

```js
element.addEventListener('edit-save', (e) => {
  console.log(e.detail); // { row, column, value, index }
});
```

### Atributos booleanos

En HTML plano, los booleanos se usan sin valor o con el nombre del atributo:

```html
<cu-button disabled>Deshabilitado</cu-button>
<cu-alert close>Con botón de cerrar</cu-alert>
<cu-table pagination search-enabled>...</cu-table>
```

### Atributos numéricos

```html
<cu-pagination current-page="1" total-pages="10" items-per-page="5"></cu-pagination>
```

### Arrays y objetos (props complejas)

Arrays y objetos se asignan vía JavaScript como propiedades DOM, no como atributos HTML:

```html
<cu-select id="miSelect"></cu-select>
<cu-table id="miTabla"></cu-table>

<script>
  const select = document.getElementById('miSelect');
  select.options = [
    { value: 'op1', label: 'Opción 1' },
    { value: 'op2', label: 'Opción 2' },
  ];

  const tabla = document.getElementById('miTabla');
  tabla.columns = [
    { key: 'nombre', label: 'Nombre' },
    { key: 'edad', label: 'Edad' },
  ];
  tabla.data = [
    { nombre: 'Juan', edad: 30 },
    { nombre: 'María', edad: 25 },
  ];
</script>
```

### Tamaños de los bundles

Cada archivo UMD incluye el runtime de Vue 3 (no externalizado):

| Componente | Tamaño | Gzip |
|------------|--------|------|
| CuButton | ~184 kB | ~45 kB |
| CuAlert | ~195 kB | ~47 kB |
| CuBadge | ~182 kB | ~45 kB |
| CuInput | ~190 kB | ~47 kB |
| CuCheckbox | ~186 kB | ~46 kB |
| CuTextarea | ~185 kB | ~45 kB |
| CuSelect | ~188 kB | ~46 kB |
| CuSwitch | ~186 kB | ~45 kB |
| CuLabel | ~167 kB | ~40 kB |
| CuModal | ~204 kB | ~50 kB |
| CuPagination | ~197 kB | ~48 kB |
| CuTable | ~256 kB | ~57 kB |
| CuDropdownMenu | ~204 kB | ~49 kB |

### Compatibilidad

- Funcionan en todos los navegadores modernos (Chrome, Firefox, Safari, Edge).
- Requieren soporte de Custom Elements v1 y Shadow DOM.
- No requieren polyfills para navegadores actuales.
- Funcionan en cualquier framework (React, Angular, Svelte, Vue, etc.) o sin framework.

---

## Componentes

- [\<cu-button\>](componentes/cu-button.md) — Botón
- [\<cu-alert\>](componentes/cu-alert.md) — Alerta
- [\<cu-badge\>](componentes/cu-badge.md) — Badge
- [\<cu-input\>](componentes/cu-input.md) — Input de texto
- [\<cu-checkbox\>](componentes/cu-checkbox.md) — Checkbox
- [\<cu-textarea\>](componentes/cu-textarea.md) — Textarea
- [\<cu-select\>](componentes/cu-select.md) — Selector
- [\<cu-switch\>](componentes/cu-switch.md) — Switch/Toggle
- [\<cu-label\>](componentes/cu-label.md) — Label
- [\<cu-modal\>](componentes/cu-modal.md) — Modal
- [\<cu-pagination\>](componentes/cu-pagination.md) — Paginación
- [\<cu-table\>](componentes/cu-table.md) — Tabla avanzada
- [\<cu-dropdown-menu\>](componentes/cu-dropdown-menu.md) — Menú desplegable con items
