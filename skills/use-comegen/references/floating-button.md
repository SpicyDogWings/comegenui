# FloatingButton — `<cu-floating-button>` / `<FloatingButton>`

Botón flotante (FAB) fijo en la esquina inferior derecha, para una acción primaria global. Para
acciones en línea (dentro de un formulario o una fila) usá `<cu-button>`.

## Receta

- El contenido va por el slot default: normalmente un `<svg>` con `stroke="currentColor"`.
- `color` (default `primary`), `variant` (default `solid`) y `size` (default `lg`).
- Escuchá el `click` nativo (burbujea desde el shadow DOM) para disparar la acción.
- Acción asincrónica: `loading` (spinner + deshabilitado).
- No hace falta ubicarlo: ya es `position: fixed` abajo a la derecha, con `z-index` y sombra.

```html
<cu-floating-button color="<color>" variant="<variant>" size="<size>"><svg></svg></cu-floating-button>
```

```vue
<FloatingButton color="<color>" variant="<variant>" :loading="<bool>" @click="<handler>"><svg></svg></FloatingButton>
```

Los valores de `color` / `variant` / `size` están en «Atributos» / «Props», abajo.

## Límites

- No expone métodos: usá la API del DOM (`.focus()`, `.click()`).
- No emite eventos custom: el `click` es el nativo (sin `e.detail`; `e.target` es el interno).
- No acepta `theme` ni `hightContrast`: el tema se define en `<html data-theme="…">` (`theming.md`).
- No fija tamaño ni forma propios: hereda de `Button` el `padding`, el `border-radius` y el `size`.
- La posición es fija (esquina inferior derecha): no se configura.
- No tiene `type` ni `to`: no sirve como `submit` de un `<form>` ni como link de navegación.
- `variant="link"` no tiene sentido acá: un link flotante y fijo no aporta navegación.
- `disabled` y `loading` deshabilitan igual; `loading` además cambia el contenido por el spinner.

## API del custom element

### Atributos

<!-- @api:atributos -->
| Atributo | Tipo | Default | Descripción |
| ------ | ------ | ------ | ------ |
| `color` | `"primary" \| "secondary" \| "neutral" \| "success" \| "warning" \| "danger"` | `"primary"` | Color semántico del FAB: `primary`, `secondary`, `neutral`, `success`, `warning`, `danger` |
| `variant` | `"solid" \| "outlined" \| "soft" \| "ghost" \| "subtle" \| "link" \| "none"` | `"solid"` | Variante visual, heredada de `Button`: `solid`, `outlined`, `soft`, `ghost`, `subtle`, `link`, `none` |
| `loading` | `boolean` | `false` | Muestra un spinner y deshabilita el botón mientras está activo. |
| `size` | `"sm" \| "md" \| "lg"` | `"lg"` | Tamaño, heredado de `Button`: `sm`, `md`, `lg` |
| `disabled` | `boolean` | `false` | Deshabilita el botón. |
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
| `color` | `"primary" \| "secondary" \| "neutral" \| "success" \| "warning" \| "danger"` | `"primary"` | Color semántico del FAB: `primary`, `secondary`, `neutral`, `success`, `warning`, `danger` |
| `variant` | `"solid" \| "outlined" \| "soft" \| "ghost" \| "subtle" \| "link" \| "none"` | `"solid"` | Variante visual, heredada de `Button`: `solid`, `outlined`, `soft`, `ghost`, `subtle`, `link`, `none` |
| `loading` | `boolean` | `false` | Muestra un spinner y deshabilita el botón mientras está activo. |
| `size` | `"sm" \| "md" \| "lg"` | `"lg"` | Tamaño, heredado de `Button`: `sm`, `md`, `lg` |
| `disabled` | `boolean` | `false` | Deshabilita el botón. |
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
