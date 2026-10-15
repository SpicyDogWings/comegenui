# Checkbox — `<cu-checkbox>` / `<Checkbox>`

Opción binaria con label y color, con `modelValue`/`v-model` o los métodos `get`/`set`. Para un
encendido/apagado usá `<cu-switch>`; para elegir entre varias opciones, `<cu-select>`.

## Receta

- Estado **boolean**: el control lo sincroniza al clickear; usá `model-value`/`v-model` sólo para
  controlarlo.
- `change` para reaccionar al toggle.
- Programático: `set(true | false)` / `reset()` / `get()` / `focus()`.
- Estilo y texto: `color` (default `neutral`), `size` (`sm` | `md`), `label`, `disabled`.

```html
<cu-checkbox label="<texto>" color="<color>" size="<size>"></cu-checkbox>
```

```vue
<Checkbox v-model="<ref>" label="<texto>" color="<color>" />
```

Los valores de `color` / `size` están en «Atributos» / «Props», abajo.

## Límites

- No tiene `variant`: el estilo se define con `size` y `color`.
- No tiene estado indeterminado ni una prop `checked`.
- No tiene slot de label: el texto va por la prop `label` (string).
- El `change` de la interacción es el nativo del `<input>`; `set()`/`reset()` emiten `{ target: { checked } }`. El valor concreto se lee con `get()` o `update:modelValue`.
- No participa de formularios nativos: sin `name`, `required` ni submit.
- No acepta `theme`.
- `disabled` es por presencia: `disabled="false"` desde HTML no lo apaga (por propiedad JS sí).

## API del custom element

### Atributos

<!-- @api:atributos -->
| Atributo | Tipo | Default | Descripción |
| ------ | ------ | ------ | ------ |
| `color` | `"primary" \| "secondary" \| "neutral" \| "success" \| "warning" \| "danger"` | `"neutral"` | Color semántico: `primary`, `neutral`, `success`, `warning`, `danger` |
| `size` | `"sm" \| "md"` | `"md"` | Tamaño del checkbox: `sm`, `md` |
| `disabled` | `boolean` | `—` | Estado deshabilitado |
| `model-value` | `boolean` | `false` | Estado del checkbox. El CE sincroniza su estado; asigná `modelValue` sólo si querés controlarlo |
| `label` | `string` | `—` | Texto visible junto al checkbox |
<!-- /@api:atributos -->

### Eventos

<!-- @api:eventos -->
| Evento | Payload (`e.detail`) | Descripción |
| ------ | ------ | ------ |
| `update:modelValue` | `boolean` | — |
| `change` | — | — |
<!-- /@api:eventos -->

### Slots

<!-- @api:slots -->
Ninguno.
<!-- /@api:slots -->

### Métodos expuestos

<!-- @api:metodos -->
| Método | Descripción |
| ------ | ------ |
| `get` | Devuelve el estado actual (`boolean`) |
| `set` | Asigna el estado (programáticamente) |
| `reset` | Pone el estado en `false` |
| `focus` | Enfoca el checkbox |
<!-- /@api:metodos -->

## API del componente Vue

### Props

<!-- @api:props -->
| Prop | Tipo | Default | Descripción |
| ------ | ------ | ------ | ------ |
| `color` | `"primary" \| "secondary" \| "neutral" \| "success" \| "warning" \| "danger"` | `"neutral"` | — |
| `size` | `"sm" \| "md"` | `"md"` | — |
| `disabled` | `boolean` | `false` | — |
| `label` | `string` | `—` | — |
<!-- /@api:props -->

### Emits

<!-- @api:emits -->
| Evento | Payload | Descripción |
| ------ | ------ | ------ |
| `update:modelValue` | `boolean` | — |
| `change` | — | — |
<!-- /@api:emits -->

### Slots

<!-- @api:slots-vue -->
Ninguno.
<!-- /@api:slots-vue -->

### Expose

<!-- @api:expose -->
| Método | Descripción |
| ------ | ------ |
| `get` | Devuelve si el checkbox está marcado. |
| `set` | Setea el estado marcado y emite change. |
| `reset` | Desmarca el checkbox y emite change. |
| `focus` | Enfoca el input nativo. |
<!-- /@api:expose -->
