# Switch — `<cu-switch>` / `<Switch>`

Toggle booleano con color semántico, dos tamaños y label opcional. Si necesitás un estado
intermedio, no aplica: sólo maneja `true`/`false`.

## Receta

- Estado **boolean**: el control lo sincroniza al clickear; usá `model-value`/`v-model` sólo para
  controlarlo.
- `change` (payload `boolean`) para reaccionar al toggle; también se emite con `set()`/`reset()`.
- Texto: `label` o el slot default (el label nativo hace clickeable el texto).
- Estilo: `color` (default `neutral`), `size` (`sm` | `md`), `disabled`.
- Programático: `get()` / `set(v)` / `reset()` / `focus()`.

```html
<cu-switch label="<texto>" color="<color>" size="<size>"></cu-switch>
```

```vue
<Switch v-model="<ref>" label="<texto>" color="<color>" size="<size>" @change="<handler>" />
```

Los valores de `color` / `size` están en «Atributos» / «Props», abajo.

## Límites

- No existe prop `checked`: el estado se llama `modelValue` (aunque el `<input>` interno sea un checkbox).
- No tiene `variant`, `theme` ni `hightContrast`.
- No expone `toggle()`: para alternar programáticamente usá `set(!get())`.
- `reset()` siempre apaga (`false`), no vuelve a un valor inicial.
- `change` también se dispara con `set()`/`reset()`, no sólo por interacción del usuario.
- `disabled` bloquea la interacción pero no `set()`.
- El `<input>` interno tiene `tabindex="-1"`: no se enfoca con Tab, sólo con `focus()`.
- No hay `name`/`value` para enviarlo por un `<form>`.
- No tiene slots con nombre: sólo el default.

## API del custom element

### Atributos

<!-- @api:atributos -->
| Atributo | Tipo | Default | Descripción |
| ------ | ------ | ------ | ------ |
| `color` | `"primary" \| "secondary" \| "neutral" \| "success" \| "warning" \| "danger"` | `"neutral"` | Color semántico: `primary`, `neutral`, `success`, `warning`, `danger` |
| `size` | `"sm" \| "md"` | `"md"` | Tamaño del switch: `sm`, `md` |
| `disabled` | `boolean` | `—` | Estado deshabilitado |
| `model-value` | `boolean` | `false` | Estado del toggle. El CE sincroniza su estado; asigná `modelValue` sólo si querés controlarlo |
| `label` | `string` | `""` | — |
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
| Slot | Descripción |
| ------ | ------ |
| `default` | — |
<!-- /@api:slots -->

### Métodos expuestos

<!-- @api:metodos -->
| Método | Descripción |
| ------ | ------ |
| `get` | Devuelve el estado actual (`boolean`) |
| `set` | Asigna el estado |
| `reset` | Pone el estado en `false` |
| `focus` | Enfoca el switch |
<!-- /@api:metodos -->

## API del componente Vue

### Props

<!-- @api:props -->
| Prop | Tipo | Default | Descripción |
| ------ | ------ | ------ | ------ |
| `color` | `"primary" \| "secondary" \| "neutral" \| "success" \| "warning" \| "danger"` | `"neutral"` | — |
| `size` | `"sm" \| "md"` | `"md"` | — |
| `disabled` | `boolean` | `false` | — |
| `label` | `string` | `""` | — |
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
| Slot | Descripción |
| ------ | ------ |
| `default` | — |
<!-- /@api:slots-vue -->

### Expose

<!-- @api:expose -->
| Método | Descripción |
| ------ | ------ |
| `get` | Devuelve el estado actual del switch. |
| `set` | Setea el estado del switch y emite change. |
| `reset` | Apaga el switch y emite change. |
| `focus` | Enfoca el input nativo. |
<!-- /@api:expose -->
