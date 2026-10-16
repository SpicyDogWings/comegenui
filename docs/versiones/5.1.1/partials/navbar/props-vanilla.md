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
