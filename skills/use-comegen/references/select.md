# Select — `<cu-select>` / `<Select>`

Selector de una opción de lista cerrada, con color/variante (también por opción), búsqueda por
teclado y estado de carga. Si el usuario filtra escribiendo sobre un input visible, usá
`<cu-autocomplete>`.

## Receta

- `options` = `[{ value, label, disabled?, color?, variant? }]`, **propiedad JS**.
- Valor: `update:modelValue` (valor), `select` (opción completa) o `change` (valor nuevo);
  `v-model`/`model-value` sólo para controlarlo.
- `placeholder` se muestra sin selección; `placeholder-wrap` decide truncar con `…` o wrappear.
- Búsqueda estilo `<select>` nativo: `search-enabled` + `search-mode` (`startsWith` default |
  `includes`) + `search-reset-delay` (default `1000` ms).
- `loading` muestra una barra animada y anula la de cooldown.
- `read-only` bloquea abrir el dropdown y cambiar la selección, pero el control sigue enfocable;
  `set()` / `reset()` programáticos siguen funcionando.
- Posición: `position` / `align` / `fixed`.
- Alineación del texto: `text-align` (`left` default | `center` | `right`) alinea **el label del
  trigger** (placeholder o selección) **y las opciones del panel**.
- Programático: `get()` / `set(v)` / `reset()` / `focus()` / `isOpen()` / `selectedItem()`.

```html
<cu-select placeholder="<texto>" color="<color>" variant="<variant>" loading></cu-select>
```

```vue
<Select v-model="<ref>" :options="<options>" placeholder="<texto>" color="<color>" variant="<variant>" />
```

Los valores de `color` / `variant` / `position` / `align` están en «Atributos» / «Props», abajo.

## Límites

- No tiene slots: las opciones son datos y el `label` se renderiza como texto.
- No hay una caja de búsqueda visible: `search-enabled` es type-ahead sobre un input oculto (sólo hace scroll al primer match).
- `options` va por propiedad JS, nunca como atributo.
- La opción seleccionada se resalta y lleva un check de lucide al final; se deriva de `value === model-value` (no se marca en `options`).
- `variant` es de formulario: no admite `solid`, `link` ni `none`.
- No expone `open()`/`close()`: sólo `isOpen()` para consultar.
- `read-only` no es un `<select readonly>` nativo: no abre el panel; usá `disabled` si además
  querés bloquear el foco y atenuar.
- `reset()` limpia a `""`, no vuelve a un valor inicial.
- No es un `<select>`/`<input>` nativo con `name`: no participa del submit de un `<form>`.
- `cooldown-variant` acepta `ghost-hover` (default) o `solid`, y no tiene validador.

## API del custom element

### Atributos

<!-- @api:atributos -->
| Atributo | Tipo | Default | Descripción |
| ------ | ------ | ------ | ------ |
| `color` | `"primary" \| "secondary" \| "neutral" \| "success" \| "warning" \| "danger"` | `"neutral"` | Color semántico: `primary`, `neutral`, `success`, `warning`, `danger` |
| `variant` | `"outlined" \| "soft" \| "ghost" \| "subtle"` | `"soft"` | `outlined`, `soft`, `ghost`, `subtle` |
| `search-enabled` | `boolean` | `false` | Activa búsqueda por teclado (estilo select nativo: escribir hace scroll al match) |
| `loading` | `boolean` | `false` | Muestra una barra de progreso animada en el dropdown |
| `disabled` | `boolean` | `false` | Estado deshabilitado |
| `read-only` | `boolean` | `false` | Modo solo lectura: no abre el dropdown ni cambia la selección; el control sigue enfocable |
| `position` | `string` | `"bottom"` | Posición del dropdown: `bottom`, `top` |
| `align` | `string` | `"start"` | Alineación: `start`, `center`, `end` |
| `fixed` | `boolean` | `false` | Si es `true`, el dropdown usa `position: fixed` en vez de absoluto |
| `text-align` | `"center" \| "left" \| "right"` | `"left"` | Alineación del texto: el label del trigger (placeholder o selección) y las opciones del panel. `left` (default), `center`, `right`. |
| `model-value` | `string` | `""` | Valor seleccionado. El CE sincroniza su estado; asigná `modelValue` sólo si querés controlarlo |
| `search-mode` | `"includes" \| "startsWith"` | `"startsWith"` | Modo de coincidencia: `startsWith` (solo al inicio del label) o `includes` (en cualquier parte) |
| `options` | `SelectOption[]` | `[]` | Opciones del select (ver abajo). Se asigna como propiedad JS |
| `placeholder-wrap` | `boolean` | `false` | Si `true`, el texto wrappea; si `false`, se trunca con `...` (atributo HTML: `placeholder-wrap`) |
| `search-reset-delay` | `number` | `1000` | Tiempo (ms) antes de resetear el texto de búsqueda. Se reinicia con cada tecla |
| `cooldown-variant` | `string` | `"ghost-hover"` | Estilo de la barra de cooldown: `ghost-hover` (default) o el `variant` que quieras, p. ej. `solid` (color lleno). No se muestra si `loading` está activo |
| `placeholder` | `string` | `—` | Texto mostrado cuando no hay selección |
<!-- /@api:atributos -->

### Eventos

<!-- @api:eventos -->
| Evento | Payload (`e.detail`) | Descripción |
| ------ | ------ | ------ |
| `update:modelValue` | — | — |
| `select` | — | — |
| `change` | — | — |
| `close` | — | — |
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
| `reset` | — |
| `focus` | — |
| `isOpen` | Indica si el panel está abierto. |
| `selectedItem` | Devuelve la opción seleccionada o null. |
<!-- /@api:metodos -->

## API del componente Vue

### Props

<!-- @api:props -->
| Prop | Tipo | Default | Descripción |
| ------ | ------ | ------ | ------ |
| `color` | `"primary" \| "secondary" \| "neutral" \| "success" \| "warning" \| "danger"` | `"neutral"` | — |
| `variant` | `"outlined" \| "soft" \| "ghost" \| "subtle"` | `"soft"` | — |
| `searchEnabled` | `boolean` | `false` | — |
| `loading` | `boolean` | `false` | — |
| `disabled` | `boolean` | `false` | — |
| `readOnly` | `boolean` | `false` | No abre el dropdown ni cambia la selección; el control sigue enfocable. |
| `placeholder` | `string` | `""` | — |
| `position` | `string` | `"bottom"` | — |
| `align` | `string` | `"start"` | — |
| `fixed` | `boolean` | `false` | — |
| `textAlign` | `"center" \| "left" \| "right"` | `"left"` | Alineación del texto: el label del trigger (placeholder o selección) y las opciones del panel. `left` (default), `center`, `right`. |
| `modelValue` | `string` | `""` | — |
| `searchMode` | `"includes" \| "startsWith"` | `"startsWith"` | — |
| `options` | `SelectOption[]` | `[]` | — |
| `placeholderWrap` | `boolean` | `false` | — |
| `searchResetDelay` | `number` | `1000` | — |
| `cooldownVariant` | `string` | `"ghost-hover"` | — |
<!-- /@api:props -->

### Emits

<!-- @api:emits -->
| Evento | Payload | Descripción |
| ------ | ------ | ------ |
| `select` | — | — |
| `close` | — | — |
| `update:modelValue` | — | — |
| `change` | — | — |
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
| `get` | Devuelve el valor seleccionado. |
| `set` | Setea el valor seleccionado y emite `change`. |
| `reset` | Limpia la selección y emite `change`. |
| `focus` | Enfoca el trigger del select. |
| `isOpen` | Indica si el panel está abierto. |
| `selectedItem` | Devuelve la opción seleccionada o null. |
<!-- /@api:expose -->
