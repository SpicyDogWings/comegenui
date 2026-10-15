# Badge — `<cu-badge>` / `<Badge>`

Etiqueta pequeña para estados, categorías o metadata. Para algo que navega o acciona usá `cu-button`;
para un aviso extenso, `cu-alert`.

## Receta

- Texto por el **slot default**; admite `<svg>` inline (hereda el color del badge).
- Combiná `color` con `variant` para definir el look.

```html
<cu-badge color="<color>" variant="<variant>"><label></cu-badge>
```

```vue
<Badge color="<color>" variant="<variant>"><label></Badge>
```

Los valores de `color` / `variant` están en «Atributos» / «Props», abajo.

## Límites

- Presentación pura: no emite eventos, no expone métodos y no tiene slots con nombre.
- No tiene `size` (tamaño fijo) ni `theme`.
- No navega ni acciona: no acepta `to`/`href` ni emite `click` custom.
- No se puede cerrar ni tiene estado de descarte.

## API del custom element

### Atributos

<!-- @api:atributos -->
| Atributo | Tipo | Default | Descripción |
| ------ | ------ | ------ | ------ |
| `color` | `"primary" \| "secondary" \| "neutral" \| "success" \| "warning" \| "danger"` | `"neutral"` | Color semántico: `primary`, `neutral`, `success`, `warning`, `danger` |
| `variant` | `"solid" \| "outlined" \| "soft" \| "ghost" \| "subtle"` | `"soft"` | `solid`, `outlined`, `soft`, `ghost`, `subtle` |
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
| `color` | `"primary" \| "secondary" \| "neutral" \| "success" \| "warning" \| "danger"` | `"neutral"` | Color semántico: `primary`, `neutral`, `success`, `warning`, `danger` |
| `variant` | `"solid" \| "outlined" \| "soft" \| "ghost" \| "subtle"` | `"soft"` | `solid`, `outlined`, `soft`, `ghost`, `subtle` |
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
<!-- /@api:slots-vue -->

### Expose

<!-- @api:expose -->
No expone métodos.
<!-- /@api:expose -->
