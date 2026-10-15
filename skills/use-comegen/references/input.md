# Input — `<cu-input>` / `<Input>`

Input de texto de una línea con color, variante, tipos HTML5 y `get`/`set`/`reset`. Para
multilínea usá `<cu-textarea>`; para elegir entre opciones, `<cu-select>`.

## Receta

- Valor **string** (también con `type="number"`): el campo lo sincroniza al tipear; usá
  `model-value`/`v-model` sólo para controlarlo.
- Tipos: `text` (default), `password`, `email`, `number`, `tel`, `url`, `search`.
- Estilo: `color` (default `neutral`), `variant` (default `soft`), `size` (default `md`).
- Lectura/escritura: `get()` / `set()` / `reset()` / `focus()`.
- Eventos: `update:modelValue` para el valor; `input` / `change` / `focus` / `blur` son nativos y
  burbujean desde el shadow DOM.
- `disabled` y `read-only` bloquean la edición.

```html
<cu-input type="<type>" placeholder="<texto>" color="<color>" variant="<variant>" size="<size>"></cu-input>
```

```vue
<Input v-model="<ref>" type="<type>" placeholder="<texto>" color="<color>" variant="<variant>" />
```

Los valores de `type` / `color` / `variant` / `size` están en «Atributos» / «Props», abajo.

## Límites

- No hay evento custom `input` ni `change`: son nativos y burbujean; el custom de valor es `update:modelValue`.
- `start-value` no tiene efecto: `reset()` deja el campo **vacío** (no vuelve al valor inicial).
- El atributo es `model-value`, no `value`: un `value="…"` suelto no se refleja.
- No tiene slots (no se puede inyectar ícono ni sufijo).
- No acepta `theme`: el tema se define en `<html data-theme="…">` (`theming.md`).
- El valor siempre es string: con `type="number"`, `get()` devuelve string.
- No hay variante `none`: el default es `soft`.
- `readOnly` en HTML se escribe `readonly`.

## API del custom element

### Atributos

<!-- @api:atributos -->
| Atributo | Tipo | Default | Descripción |
| ------ | ------ | ------ | ------ |
| `type` | `"number" \| "text" \| "password" \| "email" \| "tel" \| "url" \| "search"` | `"text"` | `text`, `password`, `email`, `number`, `tel`, `url`, `search` |
| `color` | `"primary" \| "secondary" \| "neutral" \| "success" \| "warning" \| "danger"` | `"neutral"` | Color semántico: `primary`, `neutral`, `success`, `warning`, `danger` |
| `variant` | `"outlined" \| "soft" \| "ghost" \| "subtle"` | `"soft"` | `outlined`, `soft`, `ghost`, `subtle` |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | Tamaño: `sm`, `md`, `lg` |
| `disabled` | `boolean` | `false` | Estado deshabilitado |
| `read-only` | `boolean` | `false` | Solo lectura (en HTML: `read-only`) |
| `model-value` | `string` | `""` | Valor actual del input. El CE sincroniza su estado; asigná `modelValue` sólo si querés controlarlo |
| `placeholder` | `string` | `—` | Placeholder del input |
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
| `get` | Devuelve el valor actual del input. |
| `set` | Setea el valor del input (acepta `string \| number`). |
| `reset` | Limpia el campo. |
| `focus` | Enfoca el input. |
<!-- /@api:metodos -->

## API del componente Vue

### Props

<!-- @api:props -->
| Prop | Tipo | Default | Descripción |
| ------ | ------ | ------ | ------ |
| `type` | `"number" \| "text" \| "password" \| "email" \| "tel" \| "url" \| "search"` | `"text"` | — |
| `color` | `"primary" \| "secondary" \| "neutral" \| "success" \| "warning" \| "danger"` | `"neutral"` | — |
| `variant` | `"outlined" \| "soft" \| "ghost" \| "subtle"` | `"soft"` | — |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | Tamaño del input (sm \| md \| lg). |
| `disabled` | `boolean` | `false` | — |
| `readOnly` | `boolean` | `false` | — |
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
| `get` | Devuelve el valor actual del input. |
| `set` | Setea el valor del input. |
| `reset` | Limpia el input. |
| `focus` | Enfoca el input. |
<!-- /@api:expose -->
