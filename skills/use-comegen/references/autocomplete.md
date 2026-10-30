# Autocomplete — `<cu-autocomplete>` / `<Autocomplete>`

Campo de texto que filtra `items` en vivo y muestra un dropdown de sugerencias. Para listas
cortas y cerradas usá `<cu-select>`; para texto libre sin sugerencias, `<cu-input>`.

## Receta

- `items` = `[{ label, value?, icon?, disabled? }]`, **propiedad JS**; se busca sobre `label`
  (accent-insensitive).
- El menú se abre al recibir foco; `min-chars` (default `0`) exige esa cantidad de caracteres
  tipeados. `open()` lo abre sin importar `min-chars`.
- Texto: `model-value`/`v-model` sólo para controlarlo; `update:modelValue` trae el texto y
  `select` el item completo.
- Seleccionar **no cierra** el panel: resetea el filtrado, muestra todos los items y marca el
  elegido con un check; al escribir, filtra de nuevo.
- Posición: `position` / `align` / `fixed`.
- Alineación del texto: `text-align` (`left` default | `center` | `right`) alinea **el texto del
  input** (valor y placeholder) **y los items del panel**.
- Programático: `get()` / `set(v)` / `reset()` / `focus()` / `open()` / `close()` / `toggle()` /
  `isOpen()` / `selectedItem()`.

```html
<cu-autocomplete placeholder="<texto>" color="<color>" variant="<variant>" min-chars="<n>"></cu-autocomplete>
```

```vue
<Autocomplete v-model="<ref>" :items="<items>" placeholder="<texto>" :min-chars="<n>" @select="<handler>" />
```

Los valores de `type` / `color` / `variant` / `position` / `align` están en «Atributos» / «Props», abajo.

## Límites

- `items` va sólo por propiedad JS: nunca como atributo.
- No existe la prop `label`: para un rótulo, combiná con `<cu-label>`.
- `open()` ignora `min-chars` (pero `disabled` la bloquea); el foco sólo abre si el texto ya cumple `min-chars` y hay items que matcheen.
- Al seleccionar, el input se completa con el `label` del item (y sólo si no hay `label`, con su `value`).
- El check del item elegido se deriva de la última selección: `set(v)` la conserva sólo si `v` coincide con el texto del item, `reset()` la limpia.
- `set()` es silencioso: no abre el panel; para ver sugerencias después, llamá `open()`.
- No tiene slots.
- `input`, `change` y `focus` son nativos y burbujean; `blur` además se re-emite como `CustomEvent`.
- `fixed` no hace nada fuera de un contenedor con `overflow`.
- La búsqueda es accent-insensitive sobre `label` y `value`, no sobre otros campos del item.

## API del custom element

### Atributos

<!-- @api:atributos -->
| Atributo | Tipo | Default | Descripción |
| ------ | ------ | ------ | ------ |
| `type` | `string` | `"text"` | `text`, `password`, `email`, `number`, `tel`, `url`, `search` |
| `color` | `"primary" \| "secondary" \| "neutral" \| "success" \| "warning" \| "danger"` | `"neutral"` | Color semántico: `primary`, `neutral`, `success`, `warning`, `danger` |
| `variant` | `"outlined" \| "soft" \| "ghost" \| "subtle"` | `"soft"` | `outlined`, `soft`, `ghost`, `subtle` |
| `loading` | `boolean` | `false` | Muestra el spinner de carga en el panel de sugerencias |
| `disabled` | `boolean` | `false` | Estado deshabilitado |
| `read-only` | `boolean` | `false` | Solo lectura (en HTML se usa como `readonly`) |
| `placeholder` | `string` | `""` | Placeholder del input |
| `min-chars` | `number` | `0` | Caracteres mínimos para que el menú se abra al tipear o al enfocar (atributo HTML: `min-chars`) |
| `position` | `"left" \| "right" \| "bottom" \| "top"` | `"bottom"` | Posición del dropdown: `bottom`, `top` |
| `align` | `"center" \| "start" \| "end"` | `"start"` | Alineación: `start`, `center`, `end` |
| `fixed` | `boolean` | `false` | Panel en `position: fixed` (útil en contenedores con overflow) |
| `text-align` | `"center" \| "left" \| "right"` | `"left"` | Alineación del texto: el input (texto y placeholder) y los items del panel. `left` (default), `center`, `right`. |
| `items` | `unknown[]` | `[]` | Opciones del menú (ver abajo). Se asigna como propiedad JS |
| `model-value` | `string` | `""` | Valor actual del texto. El CE sincroniza su estado; asigná `modelValue` sólo si querés controlarlo |
<!-- /@api:atributos -->

### Eventos

<!-- @api:eventos -->
| Evento | Payload (`e.detail`) | Descripción |
| ------ | ------ | ------ |
| `update:modelValue` | `string` | — |
| `select` | — | — |
<!-- /@api:eventos -->

### Slots

<!-- @api:slots -->
Ninguno.
<!-- /@api:slots -->

### Métodos expuestos

<!-- @api:metodos -->
| Método | Descripción |
| ------ | ------ |
| `get` | — |
| `set` | Setea el texto actual sin abrir el panel (para ver sugerencias usá `open()`). |
| `focus` | — |
| `reset` | — |
| `open` | Abre el panel de sugerencias (ignora `min-chars`). |
| `close` | Cierra el panel de sugerencias. |
| `toggle` | Alterna la visibilidad del panel de sugerencias. |
| `isOpen` | Indica si el panel está abierto. |
| `selectedItem` | Devuelve el item seleccionado o null. |
<!-- /@api:metodos -->

## API del componente Vue

### Props

<!-- @api:props -->
| Prop | Tipo | Default | Descripción |
| ------ | ------ | ------ | ------ |
| `modelValue` | `string` | `""` | — |
| `type` | `string` | `"text"` | — |
| `color` | `"primary" \| "secondary" \| "neutral" \| "success" \| "warning" \| "danger"` | `"neutral"` | — |
| `variant` | `"outlined" \| "soft" \| "ghost" \| "subtle"` | `"soft"` | — |
| `loading` | `boolean` | `false` | Muestra el spinner de carga en el panel de sugerencias. |
| `disabled` | `boolean` | `false` | — |
| `readOnly` | `boolean` | `false` | — |
| `placeholder` | `string` | `""` | — |
| `minChars` | `number` | `0` | — |
| `position` | `"left" \| "right" \| "bottom" \| "top"` | `"bottom"` | — |
| `align` | `"center" \| "start" \| "end"` | `"start"` | — |
| `fixed` | `boolean` | `false` | — |
| `textAlign` | `"center" \| "left" \| "right"` | `"left"` | Alineación del texto: el input (texto y placeholder) y los items del panel. `left` (default), `center`, `right`. |
| `items` | `AutocompleteItem[]` | `[]` | — |
<!-- /@api:props -->

### Emits

<!-- @api:emits -->
| Evento | Payload | Descripción |
| ------ | ------ | ------ |
| `update:modelValue` | `string` | — |
| `select` | — | — |
| `blur` | — | — |
<!-- /@api:emits -->

### Slots

<!-- @api:slots-vue -->
Ninguno.
<!-- /@api:slots-vue -->

### Expose

<!-- @api:expose -->
| Método | Descripción |
| ------ | ------ |
| `get` | Devuelve el texto actual. |
| `set` | Setea el texto actual en el input sin abrir el panel (para ver sugerencias usá `open()`). |
| `reset` | Limpia el texto de búsqueda y la selección. |
| `focus` | Enfoca el input. |
| `open` | Abre el panel de sugerencias (ignora `minChars`). |
| `close` | Cierra el panel de sugerencias. |
| `toggle` | Alterna la visibilidad del panel de sugerencias. |
| `isOpen` | Indica si el panel está abierto. |
| `selectedItem` | Devuelve el item seleccionado o null. |
<!-- /@api:expose -->
