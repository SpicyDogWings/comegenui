# Divider — `<cu-divider>` / `<Divider>`

Separador de una línea con texto o contenido opcional en el medio. Para separar campos de un
formulario usá el `gap` del layout; para separar secciones, `Divider`.

## Receta

- Sin `label` ni slot: una línea lisa a todo el ancho (`horizontal`) o a todo el alto (`vertical`).
- `label` es el texto **sobre** la línea (la línea se corta); el slot `default` lo reemplaza con
  contenido rico y tiene prioridad.
- `orientation` (default `horizontal`): en `vertical` el alto sale del contenedor — va dentro de una
  fila con `align-items: stretch` o un alto fijo.
- Estilo: `variant` (default `solid`, admite `dashed`/`dotted`) y `color` (default `neutral`), que
  resuelve el trazo con `--cu-color-{color}-subtle-border` del tema activo.
- Sin eventos ni métodos: es sólo visual.

```html
<cu-divider label="<texto>" orientation="<horizontal|vertical>" variant="<solid|dashed|dotted>" color="<color>"></cu-divider>
```

```vue
<Divider label="<texto>" orientation="<horizontal|vertical>" variant="<solid|dashed|dotted>" color="<color>" />
```

Los valores de `orientation` / `variant` / `color` están en «Atributos» / «Props», abajo.

## Límites

- El color del trazo es siempre `--cu-color-{color}-subtle-border`: el generador lo deriva para
  garantizar 3:1 contra el tinte y la superficie (no es el color crudo con alpha). No hay un token
  de borde liso por componente.
- En `vertical` el alto es el del contenedor: si el contenedor no tiene alto (ni es una fila flex
  con `stretch`), la línea cae al mínimo (`--cu-space-lg`).
- Horizontal sin `label` ni slot es un `<hr>`; con contenido es un `div` con `role="separator"` y las
  líneas decorativas `aria-hidden`. No hay `role` configurable.
- El slot `default` gana sobre `label`; si el host del custom element no tiene hijos reales (sólo
  espacios o comentarios), el slot no se pasa y se usa `label`/`<hr>`.
- No tiene `theme` (va por `data-theme`), ni estados `disabled`, ni tamaño propio: el grosor es
  `--cu-border-thin`.
- No expone métodos ni emite eventos.

## API del custom element

### Atributos

<!-- @api:atributos -->
| Atributo | Tipo | Default | Descripción |
| ------ | ------ | ------ | ------ |
| `color` | `"primary" \| "secondary" \| "neutral" \| "success" \| "warning" \| "danger"` | `"neutral"` | Color semántico del trazo: `primary`, `secondary`, `neutral`, `success`, `warning`, `danger` |
| `variant` | `"solid" \| "dashed" \| "dotted"` | `"solid"` | `solid`, `dashed`, `dotted` |
| `label` | `string` | `""` | Texto centrado sobre la línea; la línea se corta a los costados |
| `orientation` | `"vertical" \| "horizontal"` | `"horizontal"` | `horizontal` (línea de izquierda a derecha) o `vertical` (de arriba a abajo) |
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
| `color` | `"primary" \| "secondary" \| "neutral" \| "success" \| "warning" \| "danger"` | `"neutral"` | Color semántico del trazo: `primary`, `secondary`, `neutral`, `success`, `warning`, `danger` |
| `variant` | `"solid" \| "dashed" \| "dotted"` | `"solid"` | `solid`, `dashed`, `dotted` |
| `label` | `string` | `""` | Texto centrado sobre la línea; la línea se corta a los costados |
| `orientation` | `"vertical" \| "horizontal"` | `"horizontal"` | `horizontal` (línea de izquierda a derecha) o `vertical` (de arriba a abajo) |
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
