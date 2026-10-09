# Navbar — `<cu-navbar>` / `<Navbar>`

Barra de navegación vertical (tipo sidebar) con submenús, búsqueda (`filter`/`scroll`), modo compacto
y opción responsive con hamburguesa + panel lateral.

## Cuándo usarlo

Para la navegación principal de una app, en una sidebar. Para una barra superior usá
`<cu-navbar-horizontal>`.

## Receta

1. Definí la estructura con `items` (`NavItem[]`). **Se asigna como propiedad JS**, no como atributo
   HTML.
2. Forma de un `NavItem`: `{ label, path?, icon?, children? }`. `icon` es un **string HTML** (podés
   pasar un SVG inline); `children` arma submenús anidados.
3. Marcá el activo con `active-path`. En vue-router, si se omite, se toma de la ruta.
4. Activá la búsqueda con `search` (+ `search-placeholder`, `search-mode` `filter`/`scroll` y
   `search-fields`, también por propiedad JS) y escuchá `search`.
5. Modo compacto con `compact`; `compactable` agrega el botón nativo de toggle y `trigger`
   (`click`/`hover`) define cómo abren los flyouts.
6. Responsive: `responsive` reemplaza la nav por una hamburguesa que abre un panel
   (`responsive-mode` y `side-over-position`).
7. Los submenús arrancan expandidos; `collapsed` los arranca colapsados.

```html
<!-- HTML plano (UMD) -->
<cu-navbar id="nav" search active-path="/usuarios" search-placeholder="Buscar..."></cu-navbar>

<script src="dist-libs/umd-core/CuNavbar.umd.js"></script>
<script>
  const nav = document.getElementById('nav');
  nav.items = [
    { label: 'Inicio', path: '/' },
    {
      label: 'Usuarios',
      icon: '<svg width="16" height="16" viewBox="0 0 24 24"></svg>',
      children: [
        { label: 'Lista', path: '/usuarios' },
        { label: 'Roles', path: '/roles' },
      ],
    },
    { label: 'Ajustes', path: '/ajustes' },
  ];

  nav.addEventListener('search', (e) => console.log('buscando:', e.detail));
</script>
```

```vue
<!-- Vue -->
<script setup lang="ts">
import Navbar from "@/components/navigation/Navbar.vue";
import { ref } from "vue";

const items = ref([
  { label: "Inicio", path: "/" },
  {
    label: "Usuarios",
    children: [
      { label: "Lista", path: "/usuarios" },
      { label: "Roles", path: "/roles" },
    ],
  },
  { label: "Ajustes", path: "/ajustes" },
]);
</script>

<template>
  <Navbar
    :items="items"
    search
    active-path="/usuarios"
    @search="(q: string) => console.log('buscando:', q)"
  />
</template>
```

## Qué puede y qué no puede

**Puede:** submenús anidados, búsqueda (`filter`/`scroll`), `search-fields`, `search-placeholder`,
modo compacto (`compact`, `compactable`, `trigger`), `collapsed`, responsive (`responsive`,
`responsive-mode`, `side-over-position`) y `active-path`. Emite `search`.

**No puede:**

- **`items` es obligatorio y se asigna como propiedad JS.** No se puede pasar como JSON por atributo
  (a diferencia de otros CE): usá `nav.items = [...]`.
- **`search-fields` también es propiedad JS**, no atributo.
- **No expone métodos.**
- **No navega por sí solo:** en vanilla manejás `path` + `active-path` y escuchás los clicks; en Vue
  con vue-router se usa `path` y la ruta activa.
- **No tiene slots.**
- **`active-path` es manual en vanilla;** no hay detección de ruta sin router.
- **`highlightItem` es interno** (lo calcula la raíz y lo propaga a las instancias recursivas): no
  lo setees.
- **`responsive` aplica a la instancia raíz**, no a las recursivas.
- **No acepta `color`, `variant`, `size` ni `theme`.**
- **No hay `v-model`:** la búsqueda se escucha por `search`.

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
