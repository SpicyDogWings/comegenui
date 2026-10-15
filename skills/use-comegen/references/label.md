# Label — `<cu-label>` / `<Label>`

Label con color semántico que enfoca el control hijo (o el de `for`) al hacer clic, para ganar área
clickeable. No es para texto decorativo suelto.

## Receta

- Texto por `label` (declarativo) o por el slot default.
- Envolvé el control como hijo: al clic en el label, se enfoca.
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
- El foco depende de que el hijo sea focusable.
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
