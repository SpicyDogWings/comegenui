# Componentes: qué hace cada uno y qué no puede hacer

Catálogo completo. Para cada componente: qué es, cómo se alimenta, qué emite y —lo que
más se consulta— **qué no se puede esperar de él**.

- **Tag** = el custom element (`<cu-x>`); **sólo Vue** = no tiene UMD, se usa el `.vue`.
- **Props sólo por JS** = arrays/objetos/funciones: `el.items = [...]`, nunca por atributo.
- La API completa (tipos, defaults, todos los slots) está en la ficha de cada componente
  (`docs/componentes/<tag>.md` y `docs/componentes/vue/<kebab>.md`).

## Buttons

| Componente | Tag | Qué hace | Props por JS |
|---|---|---|---|
| Button | `cu-button` | Botón con `color`/`variant`/`size`, modo link (`to`) y estados `disabled`/`loading` | — |
| FloatingButton | `cu-floating-button` | Botón flotante fijo abajo a la derecha | — |
| CopyButton | sólo Vue | Copia `text` al portapapeles y confirma | — |
| ToggleColorSheme | sólo Vue | Alterna el esquema de color (claro/oscuro) | — |

**Límites**

- `cu-button`: con `variant="link"` el padding queda fijo en `0` (el `size` no lo pisa). No expone métodos.
- `cu-floating-button`: no acepta `theme` ni `hightContrast`; no fija tamaño ni forma (crece con el contenido); no emite eventos propios (sólo el `click` nativo); sin métodos.
- `CopyButton` / `ToggleColorSheme`: sin emits, slots ni métodos.

## Controles

| Componente | Tag | Qué hace | Props por JS |
|---|---|---|---|
| Calendar | `cu-calendar` | Calendario de un mes, modo `single` o `range`, min/max, días deshabilitados, puntos de eventos | `events` |
| DropdownMenu | `cu-dropdown-menu` | Menú desplegable con `items` declarativos o slot libre | `items` |
| Pagination | `cu-pagination` | Paginación numérica con selector de tamaño y primera/última | `pageSizeOptions` |
| Dropdown | sólo Vue | Motor genérico de panel (toggle + panel + posicionamiento): lo usan Select, Autocomplete, DatePicker, Tooltip | — |
| DualCalendar | sólo Vue | Dos meses en un solo rango | — |
| MonthSlider / MonthSliderLabel / YearSlider | sólo Vue | Navegador de mes/año con drag | — |

**Límites**

- `cu-calendar`: `rangeStart`/`rangeEnd` se **ignoran** en `mode="single"`; los días deshabilitados no se pueden seleccionar ni con `setValue`; no tiene slots; un número en `modelValue` es un **timestamp**, no un año.
- `cu-dropdown-menu`: `items` sólo por JS; si hay slot default, `items` se ignora; si hay slot `toggle`, `label` se ignora; la selección va por el callback `onClick` del item (no hay evento `select`).
- `cu-pagination`: sin métodos; `pageSizeOptions` no se puede pasar como atributo.
- `Dropdown`, `DualCalendar`, `MonthSlider*`, `YearSlider`: internos, sin CE — no los uses como API pública (los componen DatePicker/Calendar).

## Datos

| Componente | Tag | Qué hace | Props por JS |
|---|---|---|---|
| AdvancedTable | `cu-table` | Tabla con búsqueda, filtros, sort, paginación, edición inline y badges/botones por celda | `columns`, `data`, `actions`, `filters`, `pageSizeOptions`, `rowDisabled`, `footer` |
| Table | sólo Vue | Render base de la tabla (la usa AdvancedTable) | — |
| EditableTableCell | sólo Vue | Celda editable (interna) | — |

**Límites**

- `cu-table`: `columns`/`data`/`actions`/`filters`/`pageSizeOptions`/`rowDisabled`/`footer` sólo por JS; **única excepción**: `search-fields` acepta un JSON string como atributo. `width`/`align`/`sortable` de la columna no están tipados en el wrapper pero funcionan (passthrough). `inputType: 'switch'` no pasa por el lápiz ni por validación (`regex`/`validator`). El slot `footer` tiene prioridad sobre la prop `footer`. Con `rowDisabled`, la fila no emite clicks.
- `Table` / `EditableTableCell`: internos; no los uses directo.

## Formularios

| Componente | Tag | Qué hace | Props por JS |
|---|---|---|---|
| Autocomplete | `cu-autocomplete` | Input con sugerencias filtradas en vivo | `items` |
| CellsImporter | `cu-cells-importer` | Importa `.xlsx/.xls/.csv` validando contra un esquema de columnas | `columns`, `formats`, `template` (+ `sheet`) |
| Checkbox | `cu-checkbox` | Checkbox con label | — |
| ColorPicker | `cu-color-picker` | Swatch nativo + campo hex | — |
| DatePicker | `cu-date-picker` | Trigger + dropdown con calendario: `single` o `range` | `events` |
| FileInput | `cu-file-input` | Un archivo, compacto, con drag&drop | — |
| FileInputZone | `cu-file-input-zone` | Zona drag&drop múltiple, con carpetas recursivas | — |
| Input | `cu-input` | Input de texto con tipos HTML5 | — |
| Label | `cu-label` | Label que enfoca el control hijo (o el `for`) | — |
| Select | `cu-select` | Selector de opciones con búsqueda y loading | `options` |
| Switch | `cu-switch` | Toggle con dos tamaños | — |
| Textarea | `cu-textarea` | Área multilínea con `rows` y `no-resize` | — |

**Límites**

- `cu-autocomplete`: no expone `.reset()` (limpiá con `.set('')`); `items` por JS; sin slots; los eventos nativos no se re-emiten como custom.
- `cu-cells-importer`: `columns` es **obligatorio**; `columns`/`formats`/`template`/`sheet` por JS; sin slots; el botón de plantilla sólo aparece con `enabled: true` y `columns.length > 0`; con `inputType="zone"` la prop `variant` no aplica.
- `cu-checkbox`: no tiene `checked` (se usa `modelValue`) ni `variant`; sin slots (el texto va por `label`).
- `cu-color-picker`: no acepta `theme`, `variant` ni `hightContrast`; el campo de texto sólo acepta un hex válido `#RRGGBB`; sin slots.
- `cu-date-picker`: en `mode="single"` se ignoran `startDate`/`endDate`; `dual` fuerza `range` aunque `mode="single"` (y entonces `mode` y `dual` no van juntos); `events` por JS; sin slots. El calendario interno sólo se monta con el panel abierto: cambiá `events` antes de abrir, o `close()`+`open()` para forzar re-render.
- `cu-file-input`: **un solo archivo** — no soporta `multiple`, `directory` ni `directory-deep` (para eso, FileInputZone); `modelValue` por JS; sin slots.
- `cu-file-input-zone`: no acepta `variant`; `directory` activa `multiple` solo; sin slots.
- `cu-input`: no hay eventos custom `input`/`change` (sólo `update:modelValue`; los nativos burbujean); sin slots.
- `cu-label`: sin eventos, sin métodos; sólo slot default. Es el único que hoy expone `hightContrast`.
- `cu-select`: `options` por JS; `.set(val)` exige que el valor exista en `options`; sin slots; la barra de cooldown no se muestra si `loading` está activo.
- `cu-switch`: no tiene `checked` ni `variant`/`theme`/`hightContrast`; no trae label propio (combiná con `cu-label`); sin slots.
- `cu-textarea`: los eventos nativos no se re-emiten como custom; sin slots.

## Información

| Componente | Tag | Qué hace | Props por JS |
|---|---|---|---|
| Alert | `cu-alert` | Alerta con color, título, cierre y control por `show` | — |
| AuthorCard | `cu-author-card` | Tarjeta de autor (avatar + nombre + rol) | — |
| Avatar | `cu-avatar` | Avatar circular: imagen (`src`) o iniciales, con color por hash si no se pasa `color` | — |
| Badge | `cu-badge` | Etiqueta pequeña de estado/categoría | — |
| Card | `cu-card` | Tarjeta con media/header/cuerpo/footer | — |
| FileList | sólo Vue | Lista de archivos (icono, nombre, tamaño, quitar) | — |
| Loader | sólo Vue | Indicador de carga animado | — |

**Límites**

- `cu-alert`: los booleanos van sin valor en HTML (`<cu-alert close show>`).
- `AuthorCard`: presentación pura: sin eventos, slots ni métodos.
- `cu-avatar`: si no pasás `src` ni `initials`, queda vacío; el color por hash se calcula de las iniciales.
- `cu-badge`: sin eventos ni métodos; sólo slot default.
- `cu-card`: emite `click`; sin métodos.
- `FileList`: emite `select` y `remove`; sin métodos.
- `Loader`: sin emits/slots/métodos; sólo `color`, `animation`, `delay`.

## Markdown

| Componente | Tag | Qué hace | Props por JS |
|---|---|---|---|
| Markdown | `cu-markdown` | Convierte markdown en HTML con los componentes internos (tablas, code blocks, blockquotes) | — |
| Blockquote / CodeBlock / InlineRenderer | sólo Vue | Piezas del renderer | — |

**Límites**

- `cu-markdown`: el contenido se pasa como **texto dentro del tag** (no como prop) y se parsea **una sola vez al montar** — para actualizarlo hay que re-montar. Sanitiza con DOMPurify. Emite `parsed` (ids de headings) y expone `headingIds()`.
- `Blockquote` / `CodeBlock` / `InlineRenderer`: internos.

## Navegación

| Componente | Tag | Qué hace | Props por JS |
|---|---|---|---|
| Navbar | `cu-navbar` | Sidebar vertical con submenús, búsqueda, modo compacto y responsive | `items`, `searchFields` |
| NavbarHorizontal | `cu-navbar-horizontal` | Barra horizontal con submenús dropdown y activo por ruta | `items` |
| Tabs | `cu-tabs` | Pestañas con variantes e iconos; los paneles van por slots | `tabs` |
| NavbarList / NavbarMenu | sólo Vue | Piezas internas del Navbar | — |

**Límites**

- `cu-navbar`: `items`/`searchFields` por JS; sin slots ni métodos; sin `activePath` marca como activo lo que diga la ruta (sólo si hay router).
- `cu-navbar-horizontal`: `items` por JS; sin eventos, slots ni métodos.
- `cu-tabs`: `tabs` por JS — en HTML plano esperá `customElements.whenDefined('cu-tabs')`; paneles e iconos por slots con el nombre de la key.
- `NavbarList` / `NavbarMenu`: internos.

## Overlay

| Componente | Tag | Qué hace | Props por JS |
|---|---|---|---|
| Collapse | `cu-collapse` | Sección colapsable con trigger y transición de altura | — |
| CommandPalette | `cu-command-palette` | Paleta de comandos en modal, agrupada y navegable por teclado | `commands` |
| Modal | `cu-modal` | Modal con backdrop, sizes/height y slot footer | — |
| SideOver | `cu-side-over` | Panel que desliza desde un borde, con scrim y fullscreen | — |
| Tooltip | `cu-tooltip` | Tooltip en hover con posición/align/offset/delay | — |
| Popover | sólo Vue | Panel emergente genérico (click/hover) | — |

**Límites**

- `cu-collapse`: no acepta `variant` ni `theme` (el trigger siempre es `ghost`; el color se controla con `color`).
- `cu-command-palette`: `commands` es **obligatoria** y va por JS — sin ella la paleta abre vacía. Expone `open`/`close`/`run`/`getCommands`/`isOpen`.
- `cu-modal`: no acepta `variant` ni `theme`; con `persistent` no se emiten `close`/`closed`/`cancel` por click en el backdrop ni por `Escape` (sólo llamando a `.close()`).
- `cu-side-over`: `open` colisiona con el atributo HTML nativo — desde HTML se controla como `<cu-side-over open>`, el estado se maneja por método; ignora `size` cuando `fullscreen`; con `persistent` no cierra por backdrop, `Escape` ni botón.
- `cu-tooltip`: sin eventos propios (los nativos burbujean); el contenido va por `content` o por el texto del slot default.
- `Popover`: expone `open`/`close`/`toggle`/`isOpen`; emite `open`/`close`.

## Theme

| Componente | Tag | Qué hace | Props por JS |
|---|---|---|---|
| ThemeDropdown | sólo Vue | Selector de tema | — |
| ThemeManagerModal | sólo Vue | Editar/importar/exportar un tema (CSS) | — |

**Límites**

- `ThemeDropdown`: sin props propios.
- `ThemeManagerModal`: expone sólo `open`/`close`; emite `reset`, `update:themeName`, `import`, `export`, `copy-css`, `download-css`.

## Formas de datos (lo que ninguna tabla de props te dice)

Sin esto no podés llenar una tabla, un select ni un date-picker: son arrays de objetos con
una forma concreta, y si la forma está mal **no hay error** — simplemente no pasa nada.

```js
// cu-table · columns[]
{ key: 'email', label: 'Email',
  editable: /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/,  // RegExp: habilita la edición de la celda Y valida
  // editable: true + validator(value, row) => boolean  → misma cosa, con tu función
  // editable: (row) => row.activo                      → habilita por fila
  inputType: 'text' | 'select' | 'textarea' | 'autocomplete' | 'date' | 'switch',
  selectOptions: [{ value, label }],          // con inputType: 'select'
  inlineEdit: true,                           // esta columna siempre editable (sin click)
  singleClick: false,                         // editar con doble click
  badges: (row) => [{ value, color, variant }],   // badge por celda
  buttons: (row) => [{ label, onClick }],         // botones por celda
}
// cu-table · actions[]  (la librería agrega sola la columna __actions__)
[{ label: 'Eliminar', color: 'danger', onClick: (row) => {} }]
// cu-table · footer[]  → [{ cells: [{ value, colspan?, align? }] }]

// cu-select · options[]        // cu-autocomplete · items[]
[{ value: 'alpha', label: 'Alfa' }]

// cu-date-picker / cu-calendar · events[]
[{ date: '2026-09-08', color: 'primary' }]   // date: string ISO, Date o timestamp
```

Para el resto de las props complejas (`tabs`, `searchFields`, `filters`…), mirá su ficha.

### `cu-table`: los atributos que hay que poner sí o sí

Casi todas las props de la tabla van por JS, pero **la paginación y la búsqueda se
habilitan por atributo** y por defecto están apagadas (sin `pagination` se ven todas las
filas, sin `search-enabled` no hay buscador):

```html
<cu-table pagination search-enabled show-page-size items-per-page="10"
          search-placeholder="Buscar…" color="primary" variant="soft"
          table-max-height="40rem" inline-editing compact></cu-table>
```

### Dos correcciones a lo que suele decirse por ahí

- **No hay lápiz.** La celda editable se abre con **click** sobre la celda (`singleClick: false`
  la pasa a doble click). Si buscás un ícono de lápiz, no existe: la edición "inline" sólo
  hace que el editor esté siempre visible.
- **`row-click` / `row-dblclick` / `cell-click` están declarados pero no se emiten** (nadie los
  dispara). Para un click de fila usá el `click` nativo + `e.composedPath()`, o `buttons`/`badges`.

## Patrones transversales

1. **Arrays/objetos/funciones → propiedad JS**, nunca atributo; asignalos después de que el
   UMD esté cargado (en HTML plano, dentro de `customElements.whenDefined(tag)`).
   Afecta a: `items`, `options`, `columns`, `data`, `tabs`, `events`, `filters`, `actions`,
   `pageSizeOptions`, `rowDisabled`, `footer`, `commands`, `template`, `formats`, `sheet`,
   `searchFields`. **Única excepción**: `search-fields` de `<cu-table>` acepta JSON.
2. **Atributos en kebab-case; booleanos sin valor**: `readOnly`→`readonly`,
   `itemsPerPage`→`items-per-page`, `<cu-collapse default-open>`. Cuidado con los nombres que
   chocan con atributos nativos (`open`, `readonly`).
3. **Eventos custom**: `addEventListener` (CE) o `@evento` (Vue); el payload está en `e.detail`.
   Los nombres con `:` (`update:modelValue`) se escuchan igual.
4. **Eventos nativos** (`click`, `input`, `change`, `focus`, `blur`): atraviesan el shadow DOM
   solos. Los CE **no** los re-emiten como eventos custom con esos nombres.
5. **Tema**: por `<html data-theme="...">` (todos) o por la prop `theme` donde exista
   (Button, Input, Select, Modal no lo exponen: ver los límites de cada uno).
6. **Métodos**: en CE sobre el host (`el.open()`, `el.set(v)`), en Vue por template ref
   (`ref.value?.open()`). No todos exponen: Button, Badge, AuthorCard, Navbar y Pagination no.
7. **Mismo componente, dos entornos**: el CE vive en **shadow DOM** (estilos y tokens
   aislados; contenido por `slot="nombre"` nativo); el `.vue` **no** (los estilos del sitio
   aplican; slots con `<template #nombre>`). Un CE reenvía a un `.vue` interno, así que
   puede haber diferencias puntuales — si la ficha y el código no coinciden, gana el código.
