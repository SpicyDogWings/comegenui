# Button — `<cu-button>` / `<Button>`

Botón con color, variante, tamaño, link y estados. Si definís `to`, se renderiza como un
`<a>` (con un `<button>` adentro) en vez de un `<button>` suelto.

## Receta

- Contenido por el **slot default**: texto, `<svg>` inline, o los dos.
- Navegar: `to="/ruta"` (+ `target="_blank"` si es externo). Acción: `@click`.
- Acción asincrónica: `loading` (spinner + deshabilitado).
- Dentro de un `<form>`: `type="submit"` (el default, `button`, no envía).

```html
<cu-button color="<color>" variant="<variant>" size="<size>" loading><label></cu-button>
```

```vue
<Button color="<color>" variant="<variant>" :loading="<bool>" @click="<handler>"><label></Button>
```

Los valores de `color` / `variant` / `size` están en «Atributos» / «Props», abajo.

## Límites

- No expone métodos: usá la API del DOM (`.focus()`, `.click()`).
- No acepta `theme`: el tema se define en `<html data-theme="…">` (`theming.md`).
- `variant="link"` fuerza `padding: 0` y **`size` no lo cambia**.
- No hay evento custom `click`: el que burbujea es el nativo (sin `e.detail`; `e.target` es el interno).
- No hay prop ni slot `icon`: el icono es marcado del slot default (`<svg>` con `stroke="currentColor"`).
- `disabled` y `loading` deshabilitan igual; `loading` además cambia el contenido por el spinner.
- `target` sólo tiene efecto si hay `to`.

## API del custom element

### Atributos

<!-- @api:atributos -->
| Atributo | Tipo | Default | Descripción |
| ------ | ------ | ------ | ------ |
| `type` | `"reset" \| "button" \| "submit"` | `'button'` | Tipo del `<button>`: `button`, `submit`, `reset` |
| `color` | `"primary" \| "secondary" \| "neutral" \| "success" \| "warning" \| "danger"` | `"neutral"` | Color semántico: `primary`, `secondary`, `neutral`, `success`, `warning`, `danger` |
| `variant` | `"solid" \| "outlined" \| "soft" \| "ghost" \| "subtle" \| "link" \| "none"` | `"ghost"` | `solid`, `outlined`, `soft`, `ghost`, `subtle`, `link`, `none` |
| `loading` | `boolean` | `false` | Antepone un spinner al contenido. Deshabilita el botón mientras está activo |
| `size` | `"sm" \| "md" \| "lg"` | `'md'` | Tamaño: `sm`, `md`, `lg` |
| `disabled` | `boolean` | `false` | Estado deshabilitado |
| `target` | `"_self" \| "_blank" \| "_parent" \| "_top"` | `"_self"` | Target del link cuando `to` está definido: `_self`, `_blank`, `_parent`, `_top` |
| `to` | `string` | `—` | Si se especifica, el botón se renderiza como `<a>` |
<!-- /@api:atributos -->

### Eventos

<!-- @api:eventos -->
| Evento | Payload (`e.detail`) | Descripción |
| ------ | ------ | ------ |
| `loading-change` | `boolean` | Se dispara cuando cambia `loading`, con el estado nuevo. |
<!-- /@api:eventos -->

Los nativos (`click`, `focus`, `blur`, `mouseenter`…) burbujean al host sin hacer nada.

### Slots

<!-- @api:slots -->
| Slot | Descripción |
| ------ | ------ |
| `default` | — |
<!-- /@api:slots -->

### Métodos expuestos

<!-- @api:metodos -->
No expone métodos.
<!-- /@api:metodos -->

## API del componente Vue

### Props

<!-- @api:props -->
| Prop | Tipo | Default | Descripción |
| ------ | ------ | ------ | ------ |
| `type` | `"reset" \| "button" \| "submit"` | `'button'` | Tipo del `<button>`: `button`, `submit`, `reset` |
| `color` | `"primary" \| "secondary" \| "neutral" \| "success" \| "warning" \| "danger"` | `"neutral"` | Color semántico: `primary`, `secondary`, `neutral`, `success`, `warning`, `danger` |
| `variant` | `"solid" \| "outlined" \| "soft" \| "ghost" \| "subtle" \| "link" \| "none"` | `"ghost"` | `solid`, `outlined`, `soft`, `ghost`, `subtle`, `link`, `none` |
| `loading` | `boolean` | `false` | Antepone un spinner al contenido. Deshabilita el botón mientras está activo |
| `size` | `"sm" \| "md" \| "lg"` | `'md'` | Tamaño: `sm`, `md`, `lg` |
| `disabled` | `boolean` | `false` | Estado deshabilitado |
| `target` | `"_self" \| "_blank" \| "_parent" \| "_top"` | `"_self"` | Target del link cuando `to` está definido: `_self`, `_blank`, `_parent`, `_top` |
| `to` | `string` | `—` | Si se especifica, el botón se renderiza como `<a>` |
<!-- /@api:props -->

### Emits

<!-- @api:emits -->
| Evento | Payload | Descripción |
| ------ | ------ | ------ |
| `loading-change` | `boolean` | Se dispara cuando cambia `loading`, con el estado nuevo. |
<!-- /@api:emits -->

### Slots

<!-- @api:slots-vue -->
| Slot | Descripción |
| ------ | ------ |
| `default` | — |
<!-- /@api:slots-vue -->

### Expose

<!-- @api:expose -->
No expone métodos.
<!-- /@api:expose -->
