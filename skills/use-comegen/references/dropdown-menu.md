# DropdownMenu — `<cu-dropdown-menu>` / `<DropdownMenu>`

Menú desplegable con items declarativos (label, ícono, color, divisor, link). El toggle se puede
reemplazar con un slot y el panel se puede llenar con `items` o con contenido libre.

## Cuándo usarlo

Para acciones contextuales colgadas de un botón. Si el panel es contenido rico (no una lista de
acciones), seguí usándolo con el slot por defecto. Para una paleta de comandos, usá
`cu-command-palette`.

## Receta

1. La forma rápida es `items` (array): `label`, `icon` (SVG string), `onClick`, `color`,
   `variant`, `disabled`, `divider`, `href`, `target`.
2. En HTML plano `items` va como **propiedad JS** (`dd.items = [...]`), nunca por atributo.
3. Si hay items, el slot por defecto se ignora; si no hay, el panel muestra el slot.
4. Para cambiar el trigger usá el slot `toggle` (en el CE, HTML `slot="toggle"`); `label` se
   ignora si hay slot.
5. Posicionamiento: `position` + `align` + `offset` (`fixed` para `position: fixed`);
   `text-align` alinea el texto del toggle.
6. Programático: `open()`, `close()`, `toggle()`, `isOpen()`; eventos `open`/`close`.

```html
<!-- HTML plano (UMD) -->
<script src="dist/CuDropdownMenu.core.umd.js"></script>

<cu-dropdown-menu id="dd" label="Acciones" color="primary" variant="soft" align="end" offset="8"></cu-dropdown-menu>

<script>
  const dd = document.getElementById('dd');
  dd.items = [
    { label: 'Editar', onClick: () => console.log('edit') },
    { label: 'Duplicar', onClick: () => console.log('dup') },
    { divider: true },
    { label: 'Eliminar', color: 'danger', onClick: () => console.log('del') },
  ];
  dd.addEventListener('open', () => console.log('abierto'));
</script>
```

```vue
<!-- Vue -->
<script setup lang="ts">
import DropdownMenu from "@/components/controls/DropdownMenu.vue";
import { ref } from "vue";

const items = ref([
  { label: "Editar", onClick: () => console.log("edit") },
  { divider: true },
  { label: "Eliminar", color: "danger", onClick: () => console.log("del") },
]);
</script>

<template>
  <DropdownMenu label="Acciones" color="primary" variant="soft" :items="items" />
</template>
```

## Qué puede y qué no puede

**Puede:** items con label/ícono/color/variante/`disabled`/divisor/link (`href` + `target`),
callbacks `onClick`, panel con contenido libre (slot default), trigger custom (slot `toggle`),
color/variante del toggle, `position`/`align`/`offset`/`fixed`/`text-align`, eventos
`open`/`close` y los métodos `open`/`close`/`toggle`/`isOpen`.

**No puede:**

- **`items` va por propiedad JS:** contiene funciones `onClick`, no se puede serializar.
- **Items y slot default son excluyentes:** si `items` tiene elementos, el slot se ignora.
- **El CE restringe `position` a `bottom`/`top`** (el Vue también acepta `left`/`right`).
- **`label` se ignora si hay slot `toggle`.**
- **No hay submenús anidados** ni agrupado con títulos.
- **El item `href` se renderiza como link** (`to` del `Button` → `<a>`); no hace navegación de
  router por sí solo.
- **No hay navegación con teclado** (↑/↓/Enter) ni índice activo: es un menú de click.
- **En el CE el slot `toggle` es light DOM** y se detecta por `slot="toggle"`; un slot vacío no
  pisa el botón por defecto.
- **No acepta `theme`.**

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
| `open` | — | — |
| `close` | — | — |
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
| `close` | — | — |
| `open` | — | — |
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
