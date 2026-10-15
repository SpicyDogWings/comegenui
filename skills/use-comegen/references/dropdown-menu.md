# DropdownMenu — `<cu-dropdown-menu>` / `<DropdownMenu>`

Menú desplegable con items declarativos (`items`) o contenido libre (slot default), y trigger
reemplazable (slot `toggle`). Para una paleta de comandos usá `cu-command-palette`.

## Receta

- Forma rápida: `items` con `label`, `icon` (SVG string), `color`, `variant`, `disabled`, `divider`, `href`, `target`, `onClick`.
- En el CE `items` va como **propiedad JS** (`dd.items = [...]`), nunca por atributo.
- Si hay items, el slot default se ignora; si no hay, el panel muestra el slot.
- Trigger propio: slot `toggle` (en el CE, HTML `slot="toggle"`); `label` se ignora si hay slot.
- Posicionamiento: `position` + `align` + `offset` (`fixed` para `position: fixed`); `text-align` alinea el texto del toggle.
- Programático: `open()`, `close()`, `toggle()`, `isOpen()`; eventos `open`/`close`.

```html
<cu-dropdown-menu id="<id>" label="<label>" color="<color>" variant="<variant>" position="<position>" align="<align>" offset="<number>"></cu-dropdown-menu>
```

```vue
<DropdownMenu label="<label>" color="<color>" variant="<variant>" :items="<items>" align="<align>" @open="<handler>" />
```

Los valores de `color` / `variant` / `position` / `align` / `text-align` están en «Atributos» / «Props», abajo.

## Límites

- `items` va por propiedad JS: contiene funciones `onClick` y no se puede serializar.
- Items y slot default son excluyentes: con items, el slot se ignora.
- El CE restringe `position` a `bottom`/`top` (el Vue también acepta `left`/`right`).
- `label` se ignora si hay slot `toggle`.
- No hay submenús anidados ni agrupado con títulos.
- El item `href` se renderiza como link (`to` del `Button` → `<a>`); no hace navegación de router por sí solo.
- No hay navegación con teclado (↑/↓/Enter) ni índice activo: es un menú de click.
- En el CE el slot `toggle` es light DOM y se detecta por `slot="toggle"`; un slot vacío no pisa el botón por defecto.
- No acepta `theme`.

## API del custom element

### Atributos

<!-- @api:atributos -->
| Atributo | Tipo | Default | Descripción |
| ------ | ------ | ------ | ------ |
| `color` | `"primary" \| "secondary" \| "neutral" \| "success" \| "warning" \| "danger"` | `"neutral"` | Color semántico del toggle: `primary`, `neutral`, `success`, `warning`, `danger` |
| `variant` | `"solid" \| "outlined" \| "soft" \| "ghost" \| "subtle" \| "link" \| "none"` | `"ghost"` | Variante del toggle: `solid`, `outlined`, `soft`, `ghost`, `subtle`, `link`, `none` |
| `disabled` | `boolean` | `false` | Deshabilita el toggle |
| `position` | `"bottom" \| "top"` | `"bottom"` | Posición preferida del panel: `bottom`, `top` |
| `align` | `"center" \| "start" \| "end"` | `"start"` | Alineación del panel: `start`, `center`, `end` |
| `fixed` | `boolean` | `false` | Si es `true`, el panel usa `position: fixed` en vez de absoluto |
| `items` | `unknown[]` | `[]` | Lista de items (ver abajo). Se asigna como propiedad JS, no como atributo HTML |
| `label` | `string` | `""` | Texto del toggle (se ignora si se provee slot `toggle`) |
| `offset` | `number` | `4` | Separación en píxeles entre el toggle y el panel |
| `text-align` | `"center" \| "left" \| "right"` | `"left"` | Alineación del texto del toggle: `left`, `center`, `right` |
<!-- /@api:atributos -->

### Eventos

<!-- @api:eventos -->
| Evento | Payload (`e.detail`) | Descripción |
| ------ | ------ | ------ |
| `open` | — | Abre el menú. |
| `close` | — | Cierra el menú. |
<!-- /@api:eventos -->

### Slots

<!-- @api:slots -->
| Slot | Descripción |
| ------ | ------ |
| `toggle` | — |
| `default` | — |
<!-- /@api:slots -->

### Métodos expuestos

<!-- @api:metodos -->
| Método | Descripción |
| ------ | ------ |
| `open` | Abre el menú. |
| `close` | Cierra el menú. |
| `toggle` | Alterna la visibilidad del menú. |
| `isOpen` | Devuelve true si el menú está abierto. |
<!-- /@api:metodos -->

## API del componente Vue

### Props

<!-- @api:props -->
| Prop | Tipo | Default | Descripción |
| ------ | ------ | ------ | ------ |
| `color` | `"primary" \| "secondary" \| "neutral" \| "success" \| "warning" \| "danger"` | `"neutral"` | — |
| `variant` | `"solid" \| "outlined" \| "soft" \| "ghost" \| "subtle" \| "link" \| "none"` | `"ghost"` | — |
| `disabled` | `boolean` | `false` | — |
| `position` | `"left" \| "right" \| "bottom" \| "top"` | `"bottom"` | — |
| `align` | `"center" \| "start" \| "end"` | `"start"` | — |
| `fixed` | `boolean` | `false` | — |
| `items` | `DropdownItem[]` | `[]` | — |
| `label` | `string` | `""` | — |
| `offset` | `number` | `4` | — |
| `textAlign` | `"center" \| "left" \| "right"` | `"left"` | — |
<!-- /@api:props -->

### Emits

<!-- @api:emits -->
| Evento | Payload | Descripción |
| ------ | ------ | ------ |
| `close` | — | Cierra el menú. |
| `open` | — | Abre el menú. |
<!-- /@api:emits -->

### Slots

<!-- @api:slots-vue -->
| Slot | Descripción |
| ------ | ------ |
| `toggle` | — |
| `default` | — |
<!-- /@api:slots-vue -->

### Expose

<!-- @api:expose -->
| Método | Descripción |
| ------ | ------ |
| `open` | Abre el menú. |
| `close` | Cierra el menú. |
| `toggle` | Alterna la visibilidad del menú. |
| `isOpen` | Devuelve true si el menú está abierto. |
<!-- /@api:expose -->
