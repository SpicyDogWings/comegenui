# NavbarHorizontal — `<cu-navbar-horizontal>` / `<NavbarHorizontal>`

Barra de navegación horizontal con submenús desplegables y detección del ítem activo por ruta. Si
necesitás búsqueda, modo scroll o colapso responsive, usá `cu-navbar`.

## Receta

- Definí `items` (`{ label, path?, icon?, children? }`) como **propiedad JS**.
- `children` abre un submenú; `path` hace link; sin ninguno de los dos el item se muestra atenuado y no navega.
- `trigger` (`click` default o `hover`) define cómo abren los submenús.
- Marcá el activo con `active-path`; en Vue con vue-router se toma de la ruta y `active-path` lo pisa.
- `icon` es un string de HTML/SVG (usá `currentColor`).
- Los submenús anidan a cualquier profundidad (recursivo).

```html
<cu-navbar-horizontal id="<id>" trigger="<trigger>" active-path="<path>"></cu-navbar-horizontal>
```

```vue
<NavbarHorizontal :items="<items>" trigger="<trigger>" active-path="<path>" />
```

Los valores de `trigger` están en «Atributos» / «Props», abajo.

## Límites

- No emite eventos custom: la navegación es un link real (`path`), no un callback (`select`/`navigate` no existen).
- No tiene slots, ni default ni por item: todo se define con `items`.
- No expone métodos.
- No acepta `color`, `variant` ni `size`: el ítem activo siempre se pinta `primary` + `soft` y el resto ghost.
- `items` es requerido y sólo se asigna como propiedad JS: como atributo HTML no funciona.
- `icon` es HTML crudo (`v-html`): no acepta componentes ni slots.
- Un item de primer nivel con `children` usa su `path` apenas como identificador: el toggle es un botón que no navega.
- No tiene búsqueda, modo scroll ni colapso responsive.

## API del custom element

### Atributos

<!-- @api:atributos -->
| Atributo | Tipo | Default | Descripción |
| ------ | ------ | ------ | ------ |
| `trigger` | `"click" \| "hover"` | `'click'` | Cómo abren los submenús: `click` o `hover` |
| `active-path` | `string` | `''` | Path activo manual. Si se omite, se toma de la ruta (cuando hay router) |
| `items` | `unknown[]` | `—` | Estructura de navegación. **Se asigna como propiedad JS** |
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
| `trigger` | `"click" \| "hover"` | `'click'` | — |
| `activePath` | `string` | `''` | — |
| `items` | `NavItem[]` | `—` | — |
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
