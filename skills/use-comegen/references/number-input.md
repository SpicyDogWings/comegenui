# NumberInput — `<cu-number-input>` / `<NumberInput>`

Input numérico con botones − / +, paso configurable y límites `min`/`max`. Para texto libre usá
`<cu-input>`; para elegir entre opciones, `<cu-select>`.

## Receta

- Valor **`number | null`**: `null` es el campo vacío (nunca `""`); usá `model-value`/`v-model` sólo
  para controlarlo.
- `update:modelValue` avisa en cada cambio; `change` llega con el **valor final** sólo al confirmar
  (Enter o blur), al usar los botones y con `set()`/`reset()` — tipear no lo dispara.
- Botones − / + y flechas `↑`/`↓` aplican el **paso activo**: `step` (default `1`) o el que elija el
  select de paso (`show-step-select`, con las opciones de `steps`, default `[1, 5, 10]`).
- `min`/`max` son inclusive y clampean en todos los caminos: al tipear (muestra el límite, no lo
  tipeado), al `set()` y al incrementar/decrementar.
- Estilo: `color` (default `neutral`), `variant` (default `soft`), `size` (default `md`);
  `show-controls` (default `true`), `disabled` y `read-only`.
- Programático: `get()` / `set(v)` / `reset()` / `focus()` / `increment()` / `decrement()`.

```html
<cu-number-input placeholder="<texto>" min="<min>" max="<max>" step="<step>" show-step-select></cu-number-input>
```

```vue
<NumberInput v-model="<ref>" placeholder="<texto>" :min="<min>" :max="<max>" :step="<step>" show-step-select />
```

```js
campo.steps = [<paso>, <paso>, <paso>]; // array → propiedad JS
```

Los valores de `color` / `variant` / `size` están en «Atributos» / «Props», abajo.

## Límites

- `steps` es un array: **propiedad JS** (`el.steps = [...]`), nunca atributo.
- `change` no se dispara al tipear (sólo `update:modelValue`) ni se repite si no hubo edición desde
  la última confirmación.
- `reset()` vacía (`null`), no vuelve a un valor inicial; `set(null)` también vacía.
- Con el campo vacío los botones parten de `min` (o de `0` si no hay `min`): `+` da `min + step` y
  `−` da `min`.
- En el límite el botón correspondiente se deshabilita y no emite; `increment()`/`decrement()` ahí
  tampoco cambian el valor.
- Cambiar el paso no cambia el valor, y no hay getter del paso activo (sólo se ve en el select).
- El select de paso es el `Select` de la librería, no un `<select>` nativo: comparte `color`,
  `variant` y estados, y sus opciones son `step` primero + `steps` sin repetidos (ignora los no
  positivos).
- `disabled` y `read-only` apagan el input, los botones y el select; en HTML se escribe `read-only`.
- No tiene slots; no acepta `theme` (va por `data-theme`); sin `name`, no participa de un `<form>`.
- `variant` es de formulario: no admite `solid`, `link` ni `none`.
- Los eventos nativos (`input`, `focus`, `blur`, `keydown`) burbujean; el `change` nativo se detiene
  para no pisar el `change` del componente, que es el que lleva el valor en `e.detail`.
- Con decimales, el resultado se redondea al decimal más fino de los operandos.

## API del custom element

### Atributos

<!-- @api:atributos -->
| Atributo | Tipo | Default | Descripción |
| ------ | ------ | ------ | ------ |
| `color` | `"primary" \| "secondary" \| "neutral" \| "success" \| "warning" \| "danger"` | `"neutral"` | Color semántico: `primary`, `neutral`, `success`, `warning`, `danger` |
| `variant` | `"outlined" \| "soft" \| "ghost" \| "subtle"` | `"soft"` | `outlined`, `soft`, `ghost`, `subtle` |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | Tamaño del campo y de los botones: `sm`, `md`, `lg` |
| `disabled` | `boolean` | `false` | Estado deshabilitado: apaga el campo, los botones y el select de paso |
| `read-only` | `boolean` | `false` | Solo lectura (en HTML: `read-only`) |
| `model-value` | `number` | `null` | Valor actual (`null` = campo vacío). El CE sincroniza su estado; asigná `modelValue` sólo si querés controlarlo |
| `steps` | `number[]` | `[1, 5, 10]` | Pasos ofrecidos por el select (se asigna como propiedad JS; `step` siempre está incluido) |
| `step` | `number` | `1` | Incremento por defecto de los botones y las flechas |
| `show-controls` | `boolean` | `true` | Muestra los botones − / + a los costados del campo |
| `show-step-select` | `boolean` | `false` | Muestra el select de paso (atributo HTML: `show-step-select`) |
| `placeholder` | `string` | `—` | Placeholder del campo |
| `min` | `number` | `—` | Valor mínimo permitido (inclusive); por debajo se clampea |
| `max` | `number` | `—` | Valor máximo permitido (inclusive); por encima se clampea |
<!-- /@api:atributos -->

### Eventos

<!-- @api:eventos -->
| Evento | Payload (`e.detail`) | Descripción |
| ------ | ------ | ------ |
| `update:modelValue` | `number \| null` | — |
| `change` | `number \| null` | Se dispara al confirmar el valor (Enter, blur, botones o `set()`/`reset()`), con el valor final. |
| `increment` | `number` | Incrementa el valor con el paso activo, respetando `max`. |
| `decrement` | `number` | Decrementa el valor con el paso activo, respetando `min`. |
<!-- /@api:eventos -->

### Slots

<!-- @api:slots -->
Ninguno.
<!-- /@api:slots -->

### Métodos expuestos

<!-- @api:metodos -->
| Método | Descripción |
| ------ | ------ |
| `get` | Devuelve el valor actual (o `null` si el campo está vacío). |
| `set` | Setea el valor (clampeado a `min`/`max`) y emite `change`. |
| `reset` | Vacía el campo y emite `change` con `null`. |
| `focus` | Enfoca el campo. |
| `increment` | Incrementa el valor con el paso activo, respetando `max`. |
| `decrement` | Decrementa el valor con el paso activo, respetando `min`. |
<!-- /@api:metodos -->

## API del componente Vue

### Props

<!-- @api:props -->
| Prop | Tipo | Default | Descripción |
| ------ | ------ | ------ | ------ |
| `modelValue` | `number \| null` | `null` | — |
| `color` | `"primary" \| "secondary" \| "neutral" \| "success" \| "warning" \| "danger"` | `"neutral"` | Color semántico: `primary`, `neutral`, `success`, `warning`, `danger` |
| `variant` | `"outlined" \| "soft" \| "ghost" \| "subtle"` | `"soft"` | `outlined`, `soft`, `ghost`, `subtle` |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | Tamaño del campo y de los botones: `sm`, `md`, `lg` |
| `disabled` | `boolean` | `false` | Estado deshabilitado: apaga el campo, los botones y el select de paso |
| `readOnly` | `boolean` | `false` | Solo lectura: deja leer y seleccionar el texto, pero no editarlo ni cambiar el valor |
| `steps` | `number[]` | `[1, 5, 10]` | Pasos ofrecidos por el select de paso (el `step` siempre está incluido) |
| `step` | `number` | `1` | Incremento por defecto de los botones y las flechas |
| `showControls` | `boolean` | `true` | Muestra los botones − / + a los costados del campo |
| `showStepSelect` | `boolean` | `false` | Muestra el select de paso, que define cuánto suman o restan los botones y las flechas |
| `placeholder` | `string` | `—` | Placeholder del campo |
| `min` | `number` | `—` | Valor mínimo permitido (inclusive); por debajo se clampea |
| `max` | `number` | `—` | Valor máximo permitido (inclusive); por encima se clampea |
<!-- /@api:props -->

### Emits

<!-- @api:emits -->
| Evento | Payload | Descripción |
| ------ | ------ | ------ |
| `update:modelValue` | `number \| null` | — |
| `change` | `number \| null` | Se dispara al confirmar el valor (Enter, blur, botones o `set()`/`reset()`), con el valor final. |
| `increment` | `number` | Incrementa el valor con el paso activo, respetando `max`. |
| `decrement` | `number` | Decrementa el valor con el paso activo, respetando `min`. |
<!-- /@api:emits -->

### Slots

<!-- @api:slots-vue -->
Ninguno.
<!-- /@api:slots-vue -->

### Expose

<!-- @api:expose -->
| Método | Descripción |
| ------ | ------ |
| `get` | Devuelve el valor actual (o `null` si el campo está vacío). |
| `set` | Setea el valor (clampeado a `min`/`max`) y emite `change`. |
| `reset` | Vacía el campo y emite `change` con `null`. |
| `focus` | Enfoca el campo. |
| `increment` | Incrementa el valor con el paso activo, respetando `max`. |
| `decrement` | Decrementa el valor con el paso activo, respetando `min`. |
<!-- /@api:expose -->
