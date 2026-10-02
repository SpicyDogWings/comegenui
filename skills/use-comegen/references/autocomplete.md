# Autocomplete — `<cu-autocomplete>` / `<Autocomplete>`

Campo de texto que filtra `items` en vivo y muestra un dropdown de sugerencias.

## Cuándo usarlo

Cuando el usuario elige de una lista conocida pero conviene tipear para acotar (roles, usuarios,
ciudades). Para listas cortas y cerradas, `cu-select`; para texto libre sin sugerencias, `cu-input`.

## Receta

1. Cargá `items` **como propiedad JS**: `[{ label, value?, icon?, disabled? }]`. `label` es lo que se
   ve y sobre lo que se busca.
2. El menú se abre al recibir foco; `min-chars="2"` lo abre recién a partir de 2 caracteres
   tipeados, o al enfocar el campo si el texto ya tiene esos 2+ caracteres. Para abrirlo por código
   sin importar `min-chars`, usá `open()`.
3. El texto lo maneja el propio campo al tipear; enlazá `model-value` (CE) o `v-model` (Vue)
   sólo si querés controlarlo y escuchá `update:modelValue`.
   `select` recibe el item completo elegido.
4. Posicionamiento: `position` (`bottom`, `top`, `left`, `right`), `align` (`start`, `center`, `end`)
   y `fixed` para paneles dentro de contenedores con `overflow`.
5. Por código: `get()`, `set(v)`, `reset()`, `focus()`, `open()`, `close()`, `toggle()`, `isOpen()`,
   `selectedItem()`.

```html
<!-- HTML plano (UMD) -->
<script src="dist/CuAutocomplete.umd.js"></script>

<cu-autocomplete id="ac" placeholder="Buscá un rol..." color="primary" min-chars="2"></cu-autocomplete>

<script>
  const ac = document.getElementById('ac');
  ac.items = [
    { label: 'Administrador' },
    { label: 'Editor de contenido' },
    { label: 'Invitado externo', disabled: true },
  ];

  ac.addEventListener('select', (e) => console.log('seleccionado', e.detail.label));
  ac.addEventListener('update:modelValue', (e) => console.log('texto', e.detail));

  ac.set('Admin');
  console.log(ac.get(), ac.selectedItem());

  ac.open(); // abre el panel sin importar min-chars
  ac.close();
  ac.toggle();
</script>
```

```vue
<!-- Vue -->
<script setup lang="ts">
import Autocomplete from "@/components/form/Autocomplete.vue";
import { ref } from "vue";

const value = ref("");
const items = ref([
  { label: "Administrador" },
  { label: "Editor de contenido" },
  { label: "Invitado externo", disabled: true },
]);
</script>

<template>
  <Autocomplete
    v-model="value"
    :items="items"
    placeholder="Buscá un rol..."
    color="primary"
    :min-chars="2"
    @select="(item) => console.log(item.label)"
  />
</template>
```

## Qué puede y qué no puede

**Puede:** 6 colores (`primary`, `secondary`, `neutral`, `success`, `warning`, `danger`), 4 variantes
de campo (`outlined`, `soft`, `ghost`, `subtle`), tipos HTML5 (`text`, `password`, `email`, `number`,
`tel`, `url`, `search`), `disabled`, `readOnly`, `placeholder`, `minChars`, `position`, `align`,
`fixed` e `items` con `label`/`value`/`icon` (SVG inline)/`disabled`. Emite `update:modelValue`,
`select` y `blur`, y expone `get`, `set`, `reset`, `focus`, `open`, `close`, `toggle`, `isOpen` y
`selectedItem`.

**No puede:**

- **`items` va sólo por JS** (es un array): `ac.items = [...]`, nunca como atributo.
- **No existe la prop `label`.** Aunque las fichas viejas la mencionan, el SFC no la declara. Para
  poner un rótulo, combiná con `cu-label`.
- **`open()` ignora `min-chars`** (es la salida programática; `disabled` sí la bloquea). `onFocus`,
  en cambio, sólo abre si el texto actual ya cumple `min-chars` y hay items que matcheen.
- **Al seleccionar, el input se completa con el `label` del item** (y sólo si no hay `label`, con su
  `value`).
- **`reset()` sí existe** (deja el texto en `""`), contra lo que decía la ficha y el checklist.
- **No tiene slots.**
- **Los eventos nativos no son custom:** `input`, `change` y `focus` burbujean desde el shadow DOM;
  `blur` además se re-emite como `CustomEvent`.
- **`disabled` de un item no está tipado** en la interface `AutocompleteItem`, pero el render lo
  respeta (no clickeable, atenuado).
- **`fixed` no hace nada fuera de un contenedor con `overflow`**; si el panel queda pegado al borde,
  probá `position`/`align`.
- **La búsqueda es accent-insensitive sobre `label` y `value`**, no sobre otros campos del item.

## API del custom element

### Atributos

<!-- @api:atributos -->
| Atributo | Tipo | Default | Descripción |
| ------ | ------ | ------ | ------ |
| `type` | `string` | `"text"` | `text`, `password`, `email`, `number`, `tel`, `url`, `search` |
| `color` | `"primary" \| "secondary" \| "neutral" \| "success" \| "warning" \| "danger"` | `"neutral"` | Color semántico: `primary`, `neutral`, `success`, `warning`, `danger` |
| `variant` | `"outlined" \| "soft" \| "ghost" \| "subtle"` | `"soft"` | `outlined`, `soft`, `ghost`, `subtle` |
| `disabled` | `boolean` | `false` | Estado deshabilitado |
| `read-only` | `boolean` | `false` | Solo lectura (en HTML se usa como `readonly`) |
| `placeholder` | `string` | `""` | Placeholder del input |
| `min-chars` | `number` | `0` | Caracteres mínimos para que el menú se abra al tipear o al enfocar (atributo HTML: `min-chars`) |
| `position` | `"left" \| "right" \| "bottom" \| "top"` | `"bottom"` | Posición del dropdown: `bottom`, `top` |
| `align` | `"center" \| "start" \| "end"` | `"start"` | Alineación: `start`, `center`, `end` |
| `fixed` | `boolean` | `false` | Panel en `position: fixed` (útil en contenedores con overflow) |
| `items` | `unknown[]` | `[]` | Opciones del menú (ver abajo). Se asigna como propiedad JS |
| `model-value` | `string` | `""` | Valor actual del texto. El CE sincroniza su estado; asigná `modelValue` sólo si querés controlarlo |
<!-- /@api:atributos -->

### Eventos

<!-- @api:eventos -->
| Evento | Payload (`e.detail`) | Descripción |
| ------ | ------ | ------ |
| `update:modelValue` | `string` | — |
| `select` | — | — |
| `blur` | — | — |
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
| `set` | — |
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
| `type` | `string` | `"text"` | — |
| `color` | `"primary" \| "secondary" \| "neutral" \| "success" \| "warning" \| "danger"` | `"neutral"` | — |
| `variant` | `"outlined" \| "soft" \| "ghost" \| "subtle"` | `"soft"` | — |
| `disabled` | `boolean` | `false` | — |
| `readOnly` | `boolean` | `false` | — |
| `placeholder` | `string` | `""` | — |
| `minChars` | `number` | `0` | — |
| `position` | `"left" \| "right" \| "bottom" \| "top"` | `"bottom"` | — |
| `align` | `"center" \| "start" \| "end"` | `"start"` | — |
| `fixed` | `boolean` | `false` | — |
| `items` | `AutocompleteItem[]` | `[]` | — |
<!-- /@api:props -->

### Emits

<!-- @api:emits -->
| Evento | Payload | Descripción |
| ------ | ------ | ------ |
| `update:modelValue` | `string` | — |
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
| `set` | Setea el texto actual en el input. |
| `reset` | Limpia el texto de búsqueda. |
| `focus` | Enfoca el input. |
| `open` | Abre el panel de sugerencias (ignora `minChars`). |
| `close` | Cierra el panel de sugerencias. |
| `toggle` | Alterna la visibilidad del panel de sugerencias. |
| `isOpen` | Indica si el panel está abierto. |
| `selectedItem` | Devuelve el item seleccionado o null. |
<!-- /@api:expose -->
