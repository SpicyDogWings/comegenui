# Loader — `<cu-loader>` / `<Loader>`

Barra de progreso indeterminada. Decorativa: no emite eventos, no expone métodos y no tiene slots.

## Receta

- `color` (default `primary`): nombre semántico; la barra usa `--cu-color-{color}`.
- `animation` (default `loading`): `loading` (barrido infinito) o `cooldown` (se consume una vez).
- `delay` (default `2000`): milisegundos que tarda `cooldown`; en `loading` se ignora.
- El componente es `position: absolute`; en el CE el host es `position: relative` y mide 0 de
  alto. Dale alto al host (o a su contenedor) para reservar espacio.

```html
<cu-loader color="<color>" animation="<loading|cooldown>" delay="<ms>"></cu-loader>
```

```vue
<Loader color="<color>" animation="<loading|cooldown>" :delay="<ms>" />
```

Los valores de `color` / `animation` están en «Atributos» / «Props», abajo.

## Límites

- `cooldown` se agota una sola vez: para repetirlo hay que remontar el componente/elemento.
- No anuncia el estado de carga: el `role="status"` o el texto van en el contenedor.
- No emite eventos, no expone métodos y no tiene slots.
- No hay prop `theme`: el color sale de los tokens del host (`data-theme`).

## API del custom element

### Atributos

<!-- @api:atributos -->
| Atributo | Tipo | Default | Descripción |
| ------ | ------ | ------ | ------ |
| `color` | `"primary" \| "secondary" \| "neutral" \| "success" \| "warning" \| "danger"` | `"primary"` | Color semántico: `primary`, `secondary`, `neutral`, `success`, `warning`, `danger` |
| `delay` | `number` | `2000` | Milisegundos que tarda en vaciarse `cooldown` (se ignora en `loading`) |
| `animation` | `"loading" \| "cooldown"` | `"loading"` | `loading` (barrido infinito) o `cooldown` (se consume una vez en `delay` ms) |
<!-- /@api:atributos -->

### Eventos

<!-- @api:eventos -->
Ninguno.
<!-- /@api:eventos -->

### Slots

<!-- @api:slots -->
Ninguno.
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
| `color` | `string` | `"primary"` | Color semántico (`primary`, `secondary`, `neutral`, `success`, `warning`, `danger`) o sufijo de token (`neutral-ghost-hover`, usado por `Dropdown`). |
| `delay` | `number` | `2000` | Milisegundos que tarda en vaciarse `cooldown` (se ignora en `loading`) |
| `animation` | `string` | `"loading"` | `loading` (barrido infinito) o `cooldown` (se consume una vez en `delay` ms) |
<!-- /@api:props -->

### Emits

<!-- @api:emits -->
Ninguno.
<!-- /@api:emits -->

### Slots

<!-- @api:slots-vue -->
Ninguno.
<!-- /@api:slots-vue -->

### Expose

<!-- @api:expose -->
No expone métodos.
<!-- /@api:expose -->
