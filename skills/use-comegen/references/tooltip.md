# Tooltip — `<cu-tooltip>` / `<Tooltip>`

Tooltip al hacer hover sobre el elemento del slot default, con posición, alineación, offset y
delay configurables. Para abrir contenido con click (o controlarlo por código) usá
`cu-popover` o `cu-dropdown-menu`.

## Receta

- El disparador va en el **slot default**.
- Texto simple: `text`. HTML: slot `content` (tiene prioridad sobre `text`).
- `position` (`top`) + `align` (`center`); separá con `offset` (px) y esperá `delay` (ms).
- `disabled` lo apaga. `color` es el **fondo** (el texto siempre es `surface`).

```html
<cu-tooltip text="<texto>" position="<position>" align="<align>" color="<color>"><trigger></cu-tooltip>
```

```vue
<Tooltip text="<texto>" position="<position>" align="<align>" :delay="<ms>"><Trigger /></Tooltip>
```

Los valores de `color` / `position` / `align` están en «Atributos» / «Props», abajo.

## Límites

- Sólo hover del mouse: no hay trigger por click ni por foco de teclado, y no está pensado para touch.
- No emite eventos ni expone métodos.
- No dibuja flecha.
- `color` sólo cambia el fondo: no hay prop de color del texto (siempre `surface`).
- El slot default es el trigger, no el contenido: el contenido va por `content`.
- El ancho está topeado a `18rem`, no es configurable por prop.
- No hay props de posicionamiento tipo `fixed`: el panel se ubica con CSS relativo al trigger.

## API del custom element

### Atributos

<!-- @api:atributos -->
| Atributo | Tipo | Default | Descripción |
| ------ | ------ | ------ | ------ |
| `color` | `"primary" \| "secondary" \| "neutral" \| "success" \| "warning" \| "danger"` | `"neutral"` | Color semántico del fondo: `primary`, `secondary`, `neutral`, `success`, `warning`, `danger` |
| `text` | `string` | `""` | Texto del tooltip. Si se usa el slot `content`, tiene prioridad |
| `disabled` | `boolean` | `false` | Deshabilita el tooltip (no se muestra) |
| `position` | `"left" \| "right" \| "bottom" \| "top"` | `"top"` | Lado donde aparece: `top`, `bottom`, `left`, `right` |
| `align` | `"center" \| "start" \| "end"` | `"center"` | Alineación respecto al elemento: `start`, `center`, `end` |
| `offset` | `number` | `6` | Distancia (px) entre el elemento y el tooltip |
| `delay` | `number` | `200` | Retardo (ms) antes de mostrar el tooltip al hacer hover |
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
| `content` | — |
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
| `text` | `string` | `""` | — |
| `disabled` | `boolean` | `false` | — |
| `position` | `"left" \| "right" \| "bottom" \| "top"` | `"top"` | — |
| `align` | `"center" \| "start" \| "end"` | `"center"` | — |
| `offset` | `number` | `6` | — |
| `delay` | `number` | `200` | — |
<!-- /@api:props -->

### Emits

<!-- @api:emits -->
Ninguno.
<!-- /@api:emits -->

### Slots

<!-- @api:slots-vue -->
| Slot | Descripción |
| ------ | ------ |
| `default` | — |
| `content` | — |
<!-- /@api:slots-vue -->

### Expose

<!-- @api:expose -->
No expone métodos.
<!-- /@api:expose -->
