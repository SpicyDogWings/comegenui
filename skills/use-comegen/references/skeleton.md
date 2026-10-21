# Skeleton — `<cu-skeleton>` / `<Skeleton>`

Placeholder de carga decorativo. Ocupa el lugar del contenido con la forma del bloque que va a
reemplazar.

## Receta

- `shape` (default `rect`): `rect` (bloque), `circle` (avatar) o `text` (líneas).
- `width` / `height`: medidas CSS (`100%`, `48px`, `1.5em`); vacíos usan el default de la forma:
  `rect` 100 % / `1rem`, `circle` `40px` / `40px`, `text` 100 % / `0.875em` (alto por línea).
- `lines` (default `1`, sólo `text`): N barras; la última queda al 60 %. En `rect`/`circle` se
  ignora.
- `animation` (default `pulse`): `pulse` (opacidad), `wave` (barrido) o `none`. Con
  `prefers-reduced-motion: reduce` no anima.
- `color` (default `neutral`): fondo `--cu-color-{color}-soft`; brillo de `wave`
  `--cu-color-{color}-subtle`.
- `radius`: `none` / `sm` / `md` / `lg` / `full`; vacío usa el default de la forma (`rect` md,
  `circle` full, `text` sm).
- Siempre `aria-hidden="true"`: sin eventos, slots ni métodos.

```html
<cu-skeleton shape="<rect|circle|text>" width="<css>" height="<css>" lines="<n>" animation="<pulse|wave|none>" color="<color>" radius="<none|sm|md|lg|full>"></cu-skeleton>
```

```vue
<Skeleton shape="<rect|circle|text>" width="<css>" height="<css>" :lines="<n>" animation="<pulse|wave|none>" color="<color>" radius="<none|sm|md|lg|full>" />
```

Los valores de `shape` / `animation` / `color` / `radius` están en «Atributos» / «Props», abajo.

## Límites

- `width` / `height` / `radius` no tienen un default fijo: vacíos resuelven por `shape`. La tabla
  los muestra como `""`.
- `lines` sólo aplica a `shape="text"`; en `rect` y `circle` siempre hay una sola barra.
- No reserva espacio por sí solo ni anuncia el estado de carga: el layout (gap/padding) y el
  `role="status"` van en el contenedor.
- No emite eventos, no expone métodos y no tiene slots.
- No hay prop `theme`: el color sale de los tokens del host (`data-theme`).

## API del custom element

### Atributos

<!-- @api:atributos -->
| Atributo | Tipo | Default | Descripción |
| ------ | ------ | ------ | ------ |
| `color` | `"primary" \| "secondary" \| "neutral" \| "success" \| "warning" \| "danger"` | `"neutral"` | Color semántico: `primary`, `secondary`, `neutral`, `success`, `warning`, `danger` |
| `height` | `string` | `""` | Alto CSS (`1rem`, `48px`); vacío = el default del `shape` (en `text`, alto de cada línea) |
| `width` | `string` | `""` | Ancho CSS (`100%`, `48px`, `12rem`); vacío = el default del `shape` |
| `animation` | `"none" \| "pulse" \| "wave"` | `"pulse"` | `pulse` (opacidad), `wave` (barrido) o `none`; con `prefers-reduced-motion` no anima |
| `shape` | `"text" \| "rect" \| "circle"` | `"rect"` | `rect` (bloque), `circle` (avatar) o `text` (líneas de texto) |
| `lines` | `number` | `1` | Cantidad de barras con `shape="text"` (se ignora en `rect` y `circle`) |
| `radius` | `"sm" \| "md" \| "lg" \| "none" \| "full"` | `""` | Radio de las esquinas; vacío = el default del `shape` (`rect` md, `circle` full, `text` sm) |
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
| `color` | `"primary" \| "secondary" \| "neutral" \| "success" \| "warning" \| "danger"` | `"neutral"` | Color semántico: `primary`, `secondary`, `neutral`, `success`, `warning`, `danger` |
| `height` | `string` | `""` | Alto CSS (`1rem`, `48px`); vacío = el default del `shape` (en `text`, alto de cada línea) |
| `width` | `string` | `""` | Ancho CSS (`100%`, `48px`, `12rem`); vacío = el default del `shape` |
| `animation` | `"none" \| "pulse" \| "wave"` | `"pulse"` | `pulse` (opacidad), `wave` (barrido) o `none`; con `prefers-reduced-motion` no anima |
| `shape` | `"text" \| "rect" \| "circle"` | `"rect"` | `rect` (bloque), `circle` (avatar) o `text` (líneas de texto) |
| `lines` | `number` | `1` | Cantidad de barras con `shape="text"` (se ignora en `rect` y `circle`) |
| `radius` | `"sm" \| "md" \| "lg" \| "none" \| "full"` | `""` | Radio de las esquinas; vacío = el default del `shape` (`rect` md, `circle` full, `text` sm) |
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
