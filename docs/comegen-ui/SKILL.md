---
name: comegen-ui
description: Guía de uso de los componentes de ComegenUI 2.0 como Web Components (Custom Elements) consumibles desde HTML plano con UMD
---

# ComegenUI — Web Components

Librería de componentes UI como Custom Elements nativos, construidos con Vue 3 pero **utilizables en HTML plano, vanilla JS, o cualquier framework** (React, Angular, Svelte, etc.).

Cada componente se distribuye como un archivo **UMD** independiente que se auto-registra como Custom Element al cargarse. No necesitas Vue ni ninguna dependencia.

> **Importante:** Toda la documentación describe la API expuesta por cada `.ce.vue` (la que se compila a UMD). Las props se pasan como atributos HTML o propiedades DOM, los eventos custom con `addEventListener`, y los arrays/objetos se asignan por JS. No se documentan detalles internos de Vue.

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
| `CuAlert.umd.js` | `<cu-alert>` | Alerta |
| `CuAutocomplete.umd.js` | `<cu-autocomplete>` | Autocompletado con búsqueda |
| `CuBadge.umd.js` | `<cu-badge>` | Badge |
| `CuButton.umd.js` | `<cu-button>` | Botón |
| `CuCalendar.umd.js` | `<cu-calendar>` | Calendario de mes (7 columnas) |
| `CuCard.umd.js` | `<cu-card>` | Tarjeta de información |
| `CuCheckbox.umd.js` | `<cu-checkbox>` | Checkbox |
| `CuCollapse.umd.js` | `<cu-collapse>` | Colapsable |
| `CuColor-picker.umd.js` | `<cu-color-picker>` | Selector de color |
| `CuDate-picker.umd.js` | `<cu-date-picker>` | Selector de fecha (dropdown + calendario) |
| `CuDropdown-menu.umd.js` | `<cu-dropdown-menu>` | Menú desplegable |
| `CuFile-input.umd.js` | `<cu-file-input>` | Input de archivo compacto |
| `CuFile-input-zone.umd.js` | `<cu-file-input-zone>` | Zona de drag & drop para archivos |
| `CuFloating-button.umd.js` | `<cu-floating-button>` | Botón flotante (FAB) |
| `CuInput.umd.js` | `<cu-input>` | Input de texto |
| `CuLabel.umd.js` | `<cu-label>` | Label |
| `CuModal.umd.js` | `<cu-modal>` | Modal |
| `CuMonth-slider.umd.js` | `<cu-month-slider>` | Slider de meses con arrastre |
| `CuYear-slider.umd.js` | `<cu-year-slider>` | Slider de años (1 en 1) |
| `CuPagination.umd.js` | `<cu-pagination>` | Paginación |
| `CuSelect.umd.js` | `<cu-select>` | Selector |
| `CuSwitch.umd.js` | `<cu-switch>` | Switch/Toggle |
| `CuTable.umd.js` | `<cu-table>` | Tabla avanzada |
| `CuTabs.umd.js` | `<cu-tabs>` | Pestañas |
| `CuTextarea.umd.js` | `<cu-textarea>` | Textarea |

> Los nombres de archivo se generan desde el entry point (`src/lib/{categoria}/{componente}.ts`), por eso los de varias palabras llevan guion: `CuDropdown-menu`, `CuFile-input-zone`, `CuColor-picker`, `CuFloating-button`.

> **Nota sobre el código fuente:** Los `.ce.vue` viven en `src/components/customElements/{category}/`, los `.vue` en `src/components/{category}/`, y los entry points en `src/lib/{category}/`. Ejemplo: `<cu-select>` → `src/lib/form/select.ts` → `src/components/customElements/form/Select.ce.vue` → `src/components/form/Select.vue`.

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

### Auto-detección

Si no hay `data-theme` en el documento ni `theme` en el componente, se detecta automáticamente `prefers-color-scheme` del OS. Prioridad completa:

```
theme prop (componente) → data-theme (<html>) → prefers-color-scheme (OS)
```

### Colores de cada tema

| Color | `light` | `dark` | `sigacadv2` |
|-------|---------|--------|-------------|
| `primary` | `#1774A4` | `#38bdf8` | `#0037FF` |
| `neutral` | `#2c2c2c` | `#e5e5e5` | `#1a1a1a` |
| `success` | `#22c55e` | `#4ade80` | `#28a745` |
| `warning` | `#f59e0b` | `#fbbf24` | `#ffc107` |
| `danger` | `#ef4444` | `#f87171` | `#dc3545` |
| `surface` | `#ffffff` | `#1a1a1a` | `#f5f5f5` |

> `surface` es el color de fondo de paneles emergentes (dropdowns, popups de autocomplete, etc.).

### Temas custom

Para agregar un tema nuevo:

1. Editar `src/config/theme.ts` — agregar entrada en el objeto `themes` con los 6 colores (`primary`, `neutral`, `success`, `warning`, `danger`, `surface`).
2. Rebuild: `npx vite build --config build-lib.ts`.
3. Usar: `<html data-theme="mi-tema">` o `<cu-button theme="mi-tema">`.

El nuevo tema se auto-registra. No requiere configuración adicional.

---

## Sistema de Color y Variantes

Cada componente que usa color acepta dos props clave:

| Prop | Valores | Default | Descripción |
|------|---------|---------|-------------|
| `color` | `primary`, `neutral`, `success`, `warning`, `danger` | Varía | Color semántico (se traduce a hex según el tema activo) |
| `variant` | Varía por componente | Varía | Estilo visual |

> **Hex literal como `color`:** Si pasás un hex (`#1774A4`), se respeta tal cual. Sirve para casos donde querés ignorar el sistema de temas en un componente puntual.

### Variantes disponibles por componente

Refleja los validadores reales de cada `.ce.vue`. `—` significa que la variante no es aceptada por ese componente.

| Variante | Button | Alert | Badge | Input | FileInput | FileInputZone | Checkbox | Textarea | Pagination | Table | DropdownMenu | Autocomplete | Select | Modal | ColorPicker | Collapse | FloatingButton | Label | Switch | MonthSlider | YearSlider |
|----------|--------|-------|-------|-------|-----------|---------------|----------|----------|------------|-------|--------------|--------------|--------|-------|-------------|----------|----------------|-------|--------|----------|----------|
| `solid` | ✓ | ✓ | ✓ | — | — | — | — | — | — | ✓ | ✓ | — | — | — | — | — | — | — | — | ✓ | ✓ |
| `outlined` | ✓ | ✓ | ✓ | ✓ | ✓ | — | — | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | — | — | — | — | — | — | ✓ | ✓ |
| `soft` | ✓ | ✓ | ✓ | ✓ | ✓ | — | — | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | — | — | — | — | — | — | ✓ | ✓ |
| `ghost` | ✓ | ✓ | ✓ | ✓ | ✓ | — | — | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | — | — | — | — | — | — | ✓ | ✓ |
| `subtle` | ✓ | ✓ | ✓ | ✓ | ✓ | — | — | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | — | — | — | — | — | — | ✓ | ✓ |
| `link` | ✓ | — | — | — | — | — | — | — | — | — | ✓ | — | — | — | — | — | — | — | — | — | — |
| `none` | ✓ | — | — | — | — | — | — | — | ✓ | — | ✓ | — | — | — | — | — | — | — | — | — | — |

> Checkbox, FileInputZone, Modal, ColorPicker, Collapse, FloatingButton, Label y Switch **no tienen prop `variant`**. Badge acepta `ghost`; Alert acepta `ghost` pero no `none`. Input, Textarea, Autocomplete, Select y FileInput aceptan solo `outlined`/`soft`/`ghost`/`subtle`. Table, MonthSlider y YearSlider aceptan `solid`/`outlined`/`soft`/`ghost`/`subtle`. Pagination acepta además `none`. `<cu-tabs>` usa su propio set de variantes: `tabs`, `pills`, `boxed`, `soft`.

> **Calendar / DatePicker:** aceptan `solid`/`outlined`/`soft`/`ghost`/`subtle`. En `<cu-calendar>` la variante aplica al **día seleccionado**; en `<cu-date-picker>` aplica al trigger (el calendario interno hereda el mismo color).

**Default de `variant` por componente:**

| Componente | Default |
|------------|---------|
| `<cu-alert>` | `soft` |
| `<cu-autocomplete>` | `soft` |
| `<cu-badge>` | `soft` |
| `<cu-button>` | `ghost` |
| `<cu-calendar>` | `soft` (variante del día seleccionado) |
| `<cu-card>` | `ghost` |
| `<cu-checkbox>` | — (sin variant) |
| `<cu-collapse>` | — (sin variant) |
| `<cu-color-picker>` | — (sin variant) |
| `<cu-date-picker>` | `soft` |
| `<cu-dropdown-menu>` | `ghost` |
| `<cu-file-input>` | `outlined` |
| `<cu-file-input-zone>` | — (sin variant) |
| `<cu-floating-button>` | — (sin variant) |
| `<cu-input>` | `soft` |
| `<cu-label>` | — (sin variant) |
| `<cu-modal>` | — (sin variant) |
| `<cu-month-slider>` | `soft` |
| `<cu-year-slider>` | `soft` |
| `<cu-pagination>` | `soft` |
| `<cu-select>` | `soft` |
| `<cu-switch>` | — (sin variant) |
| `<cu-tabs>` | `tabs` |
| `<cu-table>` | `soft` |
| `<cu-textarea>` | `soft` |

---

## Notas Técnicas

### Eventos en Custom Elements

Los eventos custom emitidos por los componentes se reciben con `addEventListener`. El payload está en `event.detail`:

```js
element.addEventListener('edit-save', (e) => {
  console.log(e.detail); // { row, column, value, index }
});
```

Los eventos nativos del DOM (`click`, `input`, `change`, `focus`, `blur`) **burbujean automáticamente** desde el Shadow DOM al elemento host, por lo que se pueden escuchar con `addEventListener` sobre el host sin configuración adicional. Los Custom Elements **no re-emiten** `input`/`change` salvo que la doc del componente lo indique explícitamente.

### Atributos booleanos

En HTML plano, los booleanos se usan sin valor o con el nombre del atributo:

```html
<cu-button disabled>Deshabilitado</cu-button>
<cu-alert close>Con botón de cerrar</cu-alert>
<cu-table pagination search-enabled>...</cu-table>
```

En JavaScript se asignan como boolean:

```js
boton.disabled = true;
tabla.searchEnabled = true;
```

### Atributos numéricos

```html
<cu-pagination current-page="1" total-pages="10" items-per-page="5"></cu-pagination>
```

### Arrays y objetos (props complejas)

Arrays y objetos **se asignan vía JavaScript como propiedades DOM**, no como atributos HTML. Los atributos se reciben como `string` y los validadores/parsers internos los pueden rechazar.

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

> **Excepción — `search-fields` en `<cu-table>`:** Es el único caso donde podés pasar un array como atributo HTML, en formato JSON. Ver [`cu-table.md`](componentes/cu-table.md) para los detalles.

### camelCase vs kebab-case en HTML

Las props de Vue se declaran en `camelCase` (`hightContrast`, `readOnly`, `itemsPerPage`, `modelValue`). En HTML se convierten a `kebab-case` con guion medio. En JavaScript podés usar cualquiera de las dos formas sobre la propiedad DOM, pero `camelCase` es la forma canónica.

```html
<cu-input read-only placeholder="..."></cu-input>
<cu-pagination items-per-page="20"></cu-pagination>
<cu-table search-enabled search-placeholder="Buscar..."></cu-table>
```

### Tamaño de los bundles

Cada archivo UMD incluye el runtime de Vue 3 (no externalizado):

| Componente | Tamaño | Gzip |
|------------|--------|------|
| CuButton | ~187 kB | ~45 kB |
| CuCalendar | ~206 kB | ~49 kB |
| CuAlert | ~193 kB | ~47 kB |
| CuBadge | ~183 kB | ~45 kB |
| CuInput | ~195 kB | ~48 kB |
| CuCheckbox | ~191 kB | ~47 kB |
| CuTextarea | ~190 kB | ~46 kB |
| CuSelect | ~209 kB | ~50 kB |
| CuSwitch | ~194 kB | ~48 kB |
| CuLabel | ~189 kB | ~46 kB |
| CuModal | ~210 kB | ~51 kB |
| CuCollapse | ~217 kB | ~52 kB |
| CuMonth-slider | ~208 kB | ~49 kB |
| CuYear-slider | ~208 kB | ~49 kB |
| CuPagination | ~215 kB | ~51 kB |
| CuTable | ~293 kB | ~65 kB |
| CuAutocomplete | ~219 kB | ~52 kB |
| CuDropdownMenu | ~208 kB | ~50 kB |
| CuFileInput | ~215 kB | ~52 kB |
| CuFileInputZone | ~220 kB | ~53 kB |
| CuColorPicker | ~178 kB | ~42 kB |
| CuDatePicker | ~225 kB | ~53 kB |
| CuFloatingButton | ~167 kB | ~40 kB |
| CuTabs | ~200 kB | ~49 kB |

### Compatibilidad

- Funcionan en todos los navegadores modernos (Chrome, Firefox, Safari, Edge).
- Requieren soporte de Custom Elements v1 y Shadow DOM.
- No requieren polyfills para navegadores actuales.
- Funcionan en cualquier framework (React, Angular, Svelte, Vue, etc.) o sin framework.

---

## Componentes

- [\<cu-alert\>](componentes/cu-alert.md) — Alerta
- [\<cu-autocomplete\>](componentes/cu-autocomplete.md) — Autocompletado con búsqueda
- [\<cu-badge\>](componentes/cu-badge.md) — Badge
- [\<cu-button\>](componentes/cu-button.md) — Botón
- [\<cu-calendar\>](componentes/cu-calendar.md) — Calendario de mes (7 columnas)
- [\<cu-card\>](componentes/cu-card.md) — Tarjeta de información
- [\<cu-checkbox\>](componentes/cu-checkbox.md) — Checkbox
- [\<cu-color-picker\>](componentes/cu-color-picker.md) — Selector de color
- [\<cu-collapse\>](componentes/cu-collapse.md) — Colapsable
- [\<cu-date-picker\>](componentes/cu-date-picker.md) — Selector de fecha (dropdown + calendario)
- [\<cu-dropdown-menu\>](componentes/cu-dropdown-menu.md) — Menú desplegable con items
- [\<cu-file-input\>](componentes/cu-file-input.md) — Input de archivo compacto
- [\<cu-file-input-zone\>](componentes/cu-file-input-zone.md) — Zona de drag & drop para archivos
- [\<cu-floating-button\>](componentes/cu-floating-button.md) — Botón flotante (FAB)
- [\<cu-input\>](componentes/cu-input.md) — Input de texto
- [\<cu-label\>](componentes/cu-label.md) — Label
- [\<cu-modal\>](componentes/cu-modal.md) — Modal
- [\<cu-month-slider\>](componentes/cu-month-slider.md) — Slider de meses con arrastre
- [\<cu-year-slider\>](componentes/cu-year-slider.md) — Slider de años
- [\<cu-pagination\>](componentes/cu-pagination.md) — Paginación
- [\<cu-select\>](componentes/cu-select.md) — Selector
- [\<cu-switch\>](componentes/cu-switch.md) — Switch/Toggle
- [\<cu-tabs\>](componentes/cu-tabs.md) — Pestañas
- [\<cu-table\>](componentes/cu-table.md) — Tabla avanzada
- [\<cu-textarea\>](componentes/cu-textarea.md) — Textarea
