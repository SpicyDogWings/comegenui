# Label — `<cu-label>` / `<Label>`

Label con color semántico que enfoca el control hijo (o el de `for`) al hacer clic y, si es un
`checkbox`/`radio`, además lo activa (toggle), para ganar área clickeable. No es para texto
decorativo suelto.

## Receta

- Texto por `label` (declarativo); el slot default es el control que se enfoca y activa.
- Envolvé el control como hijo: al clic en el label, se enfoca (y un `Checkbox`/`Switch` se activa).
- Control afuera del label: apuntá con `for="<id>"`.
- `color` (default `neutral`).
- En Vue el clic se escucha con `@click`; en vanilla burbujea el `click` nativo del shadow DOM.

```html
<cu-label label="<label>" for="<id>" color="<color>"><cu-input></cu-input></cu-label>
```

```vue
<Label label="<label>" for="<id>" color="<color>"><Input /></Label>
```

Los valores de `color` están en «Atributos» / «Props», abajo.

## Límites

- No tiene `variant` ni `size`; sólo se controla el color.
- `hight-contrast` no hace nada: está declarado y reenviado, pero el `.vue` no lo usa.
- No expone métodos.
- El CE no emite eventos custom: el `click` es el nativo (el `defineEmits('click')` interno no se bridgea).
- No acepta `theme`: se define en `<html data-theme="…">`.
- El click **enfoca y activa**: si el control es un `checkbox`/`radio` (un `Checkbox`, un `Switch`),
  se togglea una sola vez, como un `<label>` nativo; un campo de texto, `select`, etc. sólo se enfoca.
  Si el click nace dentro del control, no se intercepta (no hay doble toggle).
- `for` es opcional: el control que está dentro del label se resuelve solo.
- El foco busca el primer control focuseable del hijo (`input`, `select`, `textarea`, `button`,
  `[tabindex]`), también dentro de un componente Vue (`Checkbox`, `Switch`) o del shadow root de un
  custom element.
- Con `for`, el id tiene que existir y ser único (el foco es global al documento).

## API del custom element

### Atributos

<!-- @api:atributos -->
| Atributo | Tipo | Default | Descripción |
| ------ | ------ | ------ | ------ |
| `color` | `"primary" \| "secondary" \| "neutral" \| "success" \| "warning" \| "danger"` | `"neutral"` | Color semántico del texto; se resuelve vía el token `--cu-color-{color}` |
| `label` | `string` | `""` | Texto del label (modo declarativo) |
| `for` | `string` | `""` | ID del elemento a enfocar al hacer clic (atributo HTML `for`) |
| `hight-contrast` | `boolean` | `false` | Modo de alto contraste para el texto |
<!-- /@api:atributos -->

### Eventos

<!-- @api:eventos -->
Ninguno.
<!-- /@api:eventos -->

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
| `color` | `"primary" \| "secondary" \| "neutral" \| "success" \| "warning" \| "danger"` | `"neutral"` | — |
| `label` | `string` | `""` | — |
| `for` | `string` | `""` | — |
| `hightContrast` | `boolean` | `false` | — |
<!-- /@api:props -->

### Emits

<!-- @api:emits -->
| Evento | Payload | Descripción |
| ------ | ------ | ------ |
| `click` | — | — |
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
