# Navbar — `<cu-navbar>` / `<Navbar>`

Barra de navegación vertical (sidebar) con submenús, búsqueda (`filter`/`scroll`), modo compacto y
responsive con hamburguesa + panel lateral. Para una barra superior usá `<cu-navbar-horizontal>`.

## Receta

- Definí `items` (`NavItem[]`): `{ label, path?, icon?, children? }`; `icon` es un string HTML y `children` arma submenús anidados.
- `items` (y `search-fields`) se asignan como **propiedad JS**, nunca por atributo.
- Marcá el activo con `active-path`; en Vue con vue-router, si se omite, se toma de la ruta.
- Búsqueda: `search` + `search-placeholder` + `search-mode` (`filter`/`scroll`) + `search-fields`, y escuchá `search`.
- Compacto: `compact` (sólo iconos), `compactable` (botón nativo de toggle) y `trigger` (`click`/`hover`) para los flyouts.
- Responsive: `responsive` reemplaza la nav por una hamburguesa que abre un panel (`responsive-mode`, `side-over-position`).
- Los submenús arrancan expandidos; `collapsed` los arranca colapsados.

```html
<cu-navbar id="<id>" search search-placeholder="<placeholder>" active-path="<path>" compactable></cu-navbar>
```

```vue
<Navbar :items="<items>" search active-path="<path>" compactable @search="<handler>" />
```

Los valores de `search-mode` / `trigger` / `responsive-mode` / `side-over-position` están en «Atributos» / «Props», abajo.

## Límites

- `items` es obligatorio y se asigna como **propiedad JS** (`nav.items = [...]`): no se puede pasar como JSON por atributo.
- `search-fields` también es propiedad JS, no atributo.
- No expone métodos ni tiene slots.
- No navega por sí solo: manejás `path` + `active-path` y escuchás los clicks; en Vue con vue-router sale de la ruta.
- `active-path` es manual en vanilla: no hay detección de ruta sin router.
- `highlightItem` es interno (lo calcula la raíz y lo propaga a las instancias recursivas): no lo setees.
- `responsive` aplica a la instancia raíz, no a las recursivas.
- No acepta `color`, `variant`, `size` ni `theme`.
- No hay `v-model`: la búsqueda se escucha por `search`.

## API del custom element

### Atributos

<!-- @api:atributos -->
| Atributo | Tipo | Default | Descripción |
| ------ | ------ | ------ | ------ |
| `search-placeholder` | `string` | `'Buscar...'` | Placeholder del input de búsqueda |
| `search-fields` | `string[]` | `[]` | Campos del item a buscar. **Se asigna como propiedad JS.** Vacío = busca en todos los campos string |
| `compact` | `boolean` | `false` | Modo compacto: muestra solo iconos (o la inicial del label) |
| `trigger` | `"click" \| "hover"` | `'click'` | Cómo abren los submenús en modo compact (flyout): `click` o `hover` |
| `search` | `boolean` | `false` | Muestra el input de búsqueda |
| `search-mode` | `"filter" \| "scroll"` | `'filter'` | `filter` (oculta los que no matchean) o `scroll` (resalta y hace scroll al primero que matchea) |
| `compactable` | `boolean` | `false` | Agrega un botón nativo que alterna el modo compacto |
| `collapsed` | `boolean` | `false` | Los submenús arrancan colapsados en lugar de expandidos |
| `responsive` | `boolean` | `false` | En lugar de la nav inline, muestra una hamburguesa que abre el menú en un panel lateral |
| `responsive-mode` | `"auto" \| "side" \| "fullscreen"` | `'auto'` | `auto` (fullscreen en pantallas muy chicas, lateral en el resto), `side` (siempre lateral) o `fullscreen` (siempre pantalla completa) |
| `side-over-position` | `"left" \| "right" \| "bottom" \| "top"` | `'left'` | Borde desde donde desliza el panel del responsive: `left`, `right`, `top`, `bottom` |
| `active-path` | `string` | `''` | Path activo manual. Si se omite, se toma de la ruta (cuando hay router) |
| `items` | `unknown[]` | `—` | Estructura de navegación. **Se asigna como propiedad JS** |
<!-- /@api:atributos -->

### Eventos

<!-- @api:eventos -->
| Evento | Payload (`e.detail`) | Descripción |
| ------ | ------ | ------ |
| `search` | `string` | — |
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
| `searchPlaceholder` | `string` | `'Buscar...'` | — |
| `searchFields` | `string[]` | `[]` | — |
| `compact` | `boolean` | `false` | — |
| `trigger` | `"click" \| "hover"` | `'click'` | — |
| `search` | `boolean` | `false` | — |
| `searchMode` | `"filter" \| "scroll"` | `'filter'` | — |
| `compactable` | `boolean` | `false` | — |
| `collapsed` | `boolean` | `false` | — |
| `responsive` | `boolean` | `false` | — |
| `responsiveMode` | `"auto" \| "side" \| "fullscreen"` | `'auto'` | — |
| `sideOverPosition` | `"left" \| "right" \| "bottom" \| "top"` | `'left'` | — |
| `activePath` | `string` | `''` | — |
| `highlightItem` | `NavItem \| null` | `null` | — |
| `items` | `NavItem[]` | `—` | — |
<!-- /@api:props -->

### Emits

<!-- @api:emits -->
| Evento | Payload | Descripción |
| ------ | ------ | ------ |
| `search` | `string` | — |
<!-- /@api:emits -->

### Slots

<!-- @api:slots-vue -->
Ninguno.
<!-- /@api:slots-vue -->

### Expose

<!-- @api:expose -->
No expone métodos.
<!-- /@api:expose -->
