# Textarea — `<cu-textarea>` / `<Textarea>`

Área de texto multilínea con color, variante, `rows` y resize opcional. Para una sola línea usá
`<cu-input>`.

## Receta

- Valor **string**: el control lo sincroniza al tipear; usá `model-value`/`v-model` sólo para
  controlarlo.
- Atributos: `rows` (default `3`), `placeholder`, `disabled`, `read-only` (HTML `readonly`),
  `no-resize`.
- Estilo: `color` (default `neutral`) y `variant` (default `soft`).
- Programático: `get()` / `set(v)` / `reset()` / `focus()`.
- Eventos: `update:modelValue` para el valor; `input` / `change` / `focus` / `blur` son nativos y
  burbujean desde el shadow DOM.

```html
<cu-textarea rows="<n>" placeholder="<texto>" color="<color>" variant="<variant>"></cu-textarea>
```

```vue
<Textarea v-model="<ref>" :rows="<n>" placeholder="<texto>" color="<color>" variant="<variant>" />
```

Los valores de `color` / `variant` están en «Atributos» / «Props», abajo.

## Límites

- No tiene auto-resize ni contador de caracteres.
- `start-value` no tiene efecto: `reset()` limpia a `""` (para restaurar un valor, usá `set()`).
- No hay eventos custom `input` / `change`: los nativos burbujean (sin `e.detail`).
- `variant` es de formulario: no admite `solid`, `link` ni `none`.
- No tiene slots.
- `set()` acepta `string | number` y siempre guarda un string.
- No expone una propiedad `value` reactiva: se lee con `get()`.

## API del custom element

### Atributos

<!-- @api:atributos -->
| Atributo | Tipo | Default | Descripción |
| ------ | ------ | ------ | ------ |
| `color` | `"primary" \| "secondary" \| "neutral" \| "success" \| "warning" \| "danger"` | `"neutral"` | Color semántico: `primary`, `neutral`, `success`, `warning`, `danger` |
| `variant` | `"outlined" \| "soft" \| "ghost" \| "subtle"` | `"soft"` | `outlined`, `soft`, `ghost`, `subtle` |
| `disabled` | `boolean` | `false` | Estado deshabilitado |
| `read-only` | `boolean` | `false` | Solo lectura (en HTML: `read-only`) |
| `model-value` | `string` | `""` | Valor actual del textarea. El CE sincroniza su estado; asigná `modelValue` sólo si querés controlarlo |
| `rows` | `number` | `3` | Cantidad de filas visibles |
| `no-resize` | `boolean` | `false` | Desactiva el redimensionado manual (atributo HTML: `no-resize`) |
| `placeholder` | `string` | `—` | Placeholder del textarea |
| `start-value` | `string` | `—` | Valor inicial usado por `.reset()` |
<!-- /@api:atributos -->

### Eventos

<!-- @api:eventos -->
| Evento | Payload (`e.detail`) | Descripción |
| ------ | ------ | ------ |
| `update:modelValue` | `string` | — |
<!-- /@api:eventos -->

### Slots

<!-- @api:slots -->
Ninguno.
<!-- /@api:slots -->

### Métodos expuestos

<!-- @api:metodos -->
| Método | Descripción |
| ------ | ------ |
| `get` | Devuelve el valor actual del textarea. |
| `set` | Setea el valor (acepta `string \| number`). |
| `reset` | Limpia el campo. |
| `focus` | Enfoca el textarea. |
<!-- /@api:metodos -->

## API del componente Vue

### Props

<!-- @api:props -->
| Prop | Tipo | Default | Descripción |
| ------ | ------ | ------ | ------ |
| `color` | `"primary" \| "secondary" \| "neutral" \| "success" \| "warning" \| "danger"` | `"neutral"` | — |
| `variant` | `"outlined" \| "soft" \| "ghost" \| "subtle"` | `"soft"` | — |
| `disabled` | `boolean` | `false` | — |
| `readOnly` | `boolean` | `false` | — |
| `rows` | `number` | `3` | — |
| `noResize` | `boolean` | `false` | — |
| `placeholder` | `string` | `—` | — |
| `startValue` | `string` | `—` | — |
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
| `get` | Devuelve el valor actual del textarea. |
| `set` | Setea el valor del textarea. |
| `reset` | Limpia el textarea. |
| `focus` | Enfoca el textarea. |
<!-- /@api:expose -->
