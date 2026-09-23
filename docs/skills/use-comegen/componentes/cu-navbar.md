# `<cu-navbar>`

Barra de navegación vertical (tipo sidebar) con submenús, búsqueda (`filter`/`scroll`), modo compacto y opción responsive con hamburguesa + panel lateral.

[← Volver](../SKILL.md)

---

---

## Uso en HTML plano

```html
<script src="dist/CuNavbar.umd.js"></script>

<cu-navbar id="nav" search active-path="/usuarios"></cu-navbar>

<script>
  const nav = document.getElementById('nav');
  await customElements.whenDefined('cu-navbar');
  nav.items = [
    { label: 'Inicio', path: '/' },
    { label: 'Usuarios', children: [
      { label: 'Lista', path: '/usuarios' },
      { label: 'Roles', path: '/roles' },
    ]},
    { label: 'Ajustes', path: '/ajustes' },
  ];

  nav.addEventListener('search', (e) => console.log('buscando:', e.detail));
</script>
```

---

## Estructura de `items`

```ts
interface NavItem {
  label: string;
  path?: string;        // enlaces y detección de activo
  icon?: string;        // string HTML (puede ser un SVG inline)
  children?: NavItem[]; // submenús
}
```

---

## Modo compacto y responsive

```html
<cu-navbar id="nav2" compact trigger="hover"></cu-navbar>
<cu-navbar id="nav3" responsive responsive-mode="side" side-over-position="right"></cu-navbar>
```

## Props

| Atributo | Tipo | Default | Descripción |
|------|------|------|------|
| `items` | `NavItem[]` | — | Estructura de navegación. **Se asigna como propiedad JS** |
| `search` | `boolean` | `false` | Muestra el input de búsqueda |
| `searchPlaceholder` | `string` | `"Buscar..."` | Placeholder del input de búsqueda |
| `searchMode` | `"filter" \| "scroll"` | `"filter"` | `filter` (oculta los que no matchean) o `scroll` (resalta y hace scroll al primero que matchea) |
| `searchFields` | `string[]` | `[]` | Campos del item a buscar. **Se asigna como propiedad JS.** Vacío = busca en todos los campos string |
| `compact` | `boolean` | `false` | Modo compacto: muestra solo iconos (o la inicial del label) |
| `compactable` | `boolean` | `false` | Agrega un botón nativo que alterna el modo compacto |
| `collapsed` | `boolean` | `false` | Los submenús arrancan colapsados en lugar de expandidos |
| `trigger` | `"click" \| "hover"` | `"click"` | Cómo abren los submenús en modo compact (flyout): `click` o `hover` |
| `responsive` | `boolean` | `false` | En lugar de la nav inline, muestra una hamburguesa que abre el menú en un panel lateral |
| `responsiveMode` | `"auto" \| "side" \| "fullscreen"` | `"auto"` | `auto` (fullscreen en pantallas muy chicas, lateral en el resto), `side` (siempre lateral) o `fullscreen` (siempre pantalla completa) |
| `sideOverPosition` | `"left" \| "right" \| "bottom" \| "top"` | `"left"` | Borde desde donde desliza el panel del responsive: `left`, `right`, `top`, `bottom` |
| `activePath` | `string` | `""` | Path activo manual. Si se omite, se toma de la ruta (cuando hay router) |
| `highlightItem` | `NavItem \| null` | `null` |  |

> **`items` se asigna como propiedad JS**, no como atributo HTML:

```js
const nav = document.getElementById('nav');
nav.items = [
  { label: 'Inicio', path: '/' },
  {
    label: 'Usuarios',
    icon: '👤',
    children: [
      { label: 'Lista', path: '/usuarios' },
      { label: 'Roles', path: '/roles' },
    ],
  },
];
```

## Eventos

| Evento | Payload (`e.detail`) | Descripción |
|------|------|------|
| `search` | `string` | La consulta de búsqueda (se emite en cada cambio del input) |

## Slots

Ninguno.

## Métodos expuestos

Ninguno.
