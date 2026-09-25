# ComegenUI — Referencia

Tablas de referencia completas. Para la guía de uso ver [`SKILL.md`](SKILL.md).

---

## Archivos disponibles

| Archivo (en `dist/`) | Tag | Componente |
|----------------------|-----|------------|
| `CuAlert.umd.js` | `<cu-alert>` | Alerta |
| `CuAutocomplete.umd.js` | `<cu-autocomplete>` | Autocompletado con búsqueda |
| `CuAuthorCard.umd.js` | `<cu-author-card>` | Tarjeta de autor |
| `CuAvatar.umd.js` | `<cu-avatar>` | Avatar circular |
| `CuBadge.umd.js` | `<cu-badge>` | Badge |
| `CuButton.umd.js` | `<cu-button>` | Botón |
| `CuCalendar.umd.js` | `<cu-calendar>` | Calendario de mes (7 columnas) |
| `CuCard.umd.js` | `<cu-card>` | Tarjeta de información |
| `CuCellsImporter.umd.js` | `<cu-cells-importer>` | Importador xlsx/csv con validación |
| `CuCheckbox.umd.js` | `<cu-checkbox>` | Checkbox |
| `CuCollapse.umd.js` | `<cu-collapse>` | Colapsable |
| `CuColorPicker.umd.js` | `<cu-color-picker>` | Selector de color |
| `CuCommandPalette.umd.js` | `<cu-command-palette>` | Paleta de comandos |
| `CuDatePicker.umd.js` | `<cu-date-picker>` | Selector de fecha o rango (`mode="range"`) |
| `CuDatePickerRange.umd.js` | `<cu-date-picker-range>` | Deprecado: alias de `<cu-date-picker mode="range">` |
| `CuDropdownMenu.umd.js` | `<cu-dropdown-menu>` | Menú desplegable |
| `CuFileInput.umd.js` | `<cu-file-input>` | Input de archivo compacto |
| `CuFileInputZone.umd.js` | `<cu-file-input-zone>` | Zona de drag & drop para archivos |
| `CuFloatingButton.umd.js` | `<cu-floating-button>` | Botón flotante (FAB) |
| `CuInput.umd.js` | `<cu-input>` | Input de texto |
| `CuLabel.umd.js` | `<cu-label>` | Label |
| `CuMarkdown.umd.js` | `<cu-markdown>` | Renderizador de Markdown |
| `CuModal.umd.js` | `<cu-modal>` | Modal |
| `CuNavbar.umd.js` | `<cu-navbar>` | Barra de navegación |
| `CuNavbarHorizontal.umd.js` | `<cu-navbar-horizontal>` | Barra de navegación horizontal |
| `CuPagination.umd.js` | `<cu-pagination>` | Paginación |
| `CuSelect.umd.js` | `<cu-select>` | Selector |
| `CuSideOver.umd.js` | `<cu-side-over>` | Panel lateral |
| `CuSwitch.umd.js` | `<cu-switch>` | Switch/Toggle |
| `CuTable.umd.js` | `<cu-table>` | Tabla avanzada |
| `CuTabs.umd.js` | `<cu-tabs>` | Pestañas |
| `CuTextarea.umd.js` | `<cu-textarea>` | Textarea |
| `CuTooltip.umd.js` | `<cu-tooltip>` | Tooltip |

> Los nombres de archivo se generan desde el entry point (`src/lib/{categoria}/{componente}.ts`), por eso las de varias palabras llevan guion: `CuDropdown-menu`, `CuFile-input-zone`, `CuColor-picker`, `CuFloating-button`.

---

## Colores por tema

| Color | `light` | `dark` | `sigacadv2` |
|-------|---------|--------|-------------|
| `primary` | `#1774A4` | `#38bdf8` | `#0037FF` |
| `neutral` | `#2c2c2c` | `#e5e5e5` | `#1a1a1a` |
| `success` | `#22c55e` | `#4ade80` | `#28a745` |
| `warning` | `#f59e0b` | `#fbbf24` | `#ffc107` |
| `danger` | `#ef4444` | `#f87171` | `#dc3545` |
| `surface` | `#ffffff` | `#1a1a1a` | `#f5f5f5` |

> `surface` es el color de fondo de paneles emergentes (dropdowns, popups de autocomplete, etc.).

---

## Variantes disponibles por componente

Refleja los validadores reales de cada componente (su `.ce.vue` o, si no tiene wrapper, el `.vue`). `—` significa que la variante no es aceptada.

| Variante | Button | Alert | Badge | Input | FileInput | FileInputZone | CellsImporter | Checkbox | Textarea | Pagination | Table | DropdownMenu | Autocomplete | Select | Modal | ColorPicker | Collapse | FloatingButton | Label | Switch
|----------|--------|-------|-------|-------|-----------|---------------|---------------|----------|----------|------------|-------|--------------|--------------|--------|-------|-------------|----------|----------------|-------|--------|----------|----------|
| `solid` | ✓ | ✓ | ✓ | — | — | — | — | — | — | — | ✓ | ✓ | — | — | — | — | — | ✓ | — | ✓ | ✓ |
| `outlined` | ✓ | ✓ | ✓ | ✓ | ✓ | — | ✓ | — | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | — | — | — | ✓ | — | ✓ | ✓ |
| `soft` | ✓ | ✓ | ✓ | ✓ | ✓ | — | ✓ | — | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | — | — | — | ✓ | — | ✓ | ✓ |
| `ghost` | ✓ | ✓ | ✓ | ✓ | ✓ | — | ✓ | — | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | — | — | — | ✓ | — | ✓ | ✓ |
| `subtle` | ✓ | ✓ | ✓ | ✓ | ✓ | — | ✓ | — | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | — | — | — | ✓ | — | ✓ | ✓ |
| `link` | ✓ | — | — | — | — | — | — | — | — | — | ✓ | — | — | — | — | — | — | ✓ | — | — | — |
| `none` | ✓ | — | — | — | — | — | — | — | — | ✓ | — | ✓ | — | — | — | — | — | ✓ | — | — | — |

> Checkbox, FileInputZone, Modal, ColorPicker, Collapse, Label, Switch, AuthorCard, Avatar, CommandPalette, Navbar, NavbarHorizontal, SideOver y Tooltip **no tienen prop `variant`**. Badge acepta `ghost`; Alert acepta `ghost` pero no `none`. Input, Textarea, Autocomplete, Select y FileInput aceptan solo `outlined`/`soft`/`ghost`/`subtle`. Table acepta `solid`/`outlined`/`soft`/`ghost`/`subtle`. Pagination acepta además `none`. `<cu-tabs>` usa su propio set: `tabs`, `pills`, `boxed`, `soft`.

> **Calendar / DatePicker:** `<cu-calendar>` acepta `solid`/`outlined`/`soft`/`subtle` (aplica al **día seleccionado**; `ghost` se eliminó porque se confundía con el día de hoy). `<cu-date-picker>` acepta `outlined`/`soft`/`ghost`/`subtle` en el **trigger**.

---

## Default de `variant` por componente

| Componente | Default |
|------------|---------|
| `<cu-alert>` | `soft` |
| `<cu-autocomplete>` | `soft` |
| `<cu-author-card>` | — (sin variant) |
| `<cu-avatar>` | — (sin variant) |
| `<cu-badge>` | `soft` |
| `<cu-button>` | `ghost` |
| `<cu-calendar>` | `soft` (variante del día seleccionado) |
| `<cu-card>` | `ghost` |
| `<cu-cells-importer>` | `outlined` |
| `<cu-checkbox>` | — (sin variant) |
| `<cu-collapse>` | — (sin variant) |
| `<cu-color-picker>` | — (sin variant) |
| `<cu-command-palette>` | — (sin variant) |
| `<cu-date-picker>` | `soft` |
| `<cu-dropdown-menu>` | `ghost` |
| `<cu-file-input>` | `outlined` |
| `<cu-file-input-zone>` | — (sin variant) |
| `<cu-floating-button>` | `solid` |
| `<cu-input>` | `soft` |
| `<cu-label>` | — (sin variant) |
| `<cu-modal>` | — (sin variant) |
| `<cu-navbar>` | — (sin variant) |
| `<cu-navbar-horizontal>` | — (sin variant) |
| `<cu-pagination>` | `soft` |
| `<cu-select>` | `soft` |
| `<cu-side-over>` | — (sin variant) |
| `<cu-switch>` | — (sin variant) |
| `<cu-tabs>` | `tabs` |
| `<cu-table>` | `soft` |
| `<cu-textarea>` | `soft` |
| `<cu-tooltip>` | — (sin variant) |

---

## Tamaño de los bundles

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
| CuCellsImporter | ~960 kB | ~236 kB |
| CuColorPicker | ~178 kB | ~42 kB |
| CuDatePicker | ~225 kB | ~53 kB |
| CuFloatingButton | ~167 kB | ~40 kB |
| CuTabs | ~200 kB | ~49 kB |
| CuAuthorCard | ~197 kB | ~48 kB |
| CuAvatar | ~194 kB | ~48 kB |
| CuCommandPalette | ~240 kB | ~57 kB |
| CuNavbar | ~307 kB | ~70 kB |
| CuNavbarHorizontal | ~244 kB | ~57 kB |
| CuSideOver | ~228 kB | ~55 kB |
| CuTooltip | ~204 kB | ~50 kB |

> `CuCellsImporter` incluye el parser de `.xlsx` (SheetJS), por eso pesa ~4× más que el resto. Solo ese archivo se ve afectado; los demás bundles no cambian.
