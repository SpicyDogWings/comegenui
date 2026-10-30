[← Volver](../README.md)

# `<cu-navbar>`

Barra de navegación vertical (tipo sidebar) con submenús, búsqueda (`filter`/`scroll`), modo
compacto y opción responsive con hamburguesa + panel lateral.

## Uso en HTML plano

```html
<script src="dist-libs/umd-core/CuNavbar.umd.js"></script>

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

<!-- demo:navbar-uso -->

`items` es la estructura de navegación y **se asigna como propiedad JS**, no como atributo HTML:

> El HTML del `icon` se sanitiza con **DOMPurify** antes de inyectarse: los SVG válidos se
> conservan y se eliminan `<script>`, handlers `on*` y URLs peligrosas.

```ts
interface NavItem {
  label: string;
  path?: string;        // enlaces y detección de activo
  icon?: string;        // string HTML (puede ser un SVG inline)
  children?: NavItem[]; // submenús
}
```

## Búsqueda

`search` muestra el input (`search-placeholder` cambia su texto). `search-mode` decide qué pasa
con los items que no matchean: `filter` (**default**) los oculta y `scroll` los deja y resalta +
desplaza al primero. `searchFields` limita en qué campos busca (vacío = todos los strings).

```html
<cu-navbar id="navFiltro" search search-placeholder="Buscar y filtrar…"></cu-navbar>
<cu-navbar id="navScroll" search search-mode="scroll"
  search-placeholder="Buscar y resaltar…"></cu-navbar>

<script>
  const items = [/* … */];

  const filtro = document.getElementById('navFiltro');
  filtro.items = items;
  filtro.searchFields = ['label']; // si se omite, busca en todos los campos string

  document.getElementById('navScroll').items = items;
</script>
```

<!-- demo:navbar-busqueda -->

## Modo compacto

`compact` deja sólo los iconos (o la inicial del label) y los submenús abren como flyout;
`trigger` define si abren con `click` (**default**) o con `hover`.

```html
<cu-navbar id="navClick" compact trigger="click"></cu-navbar>
<cu-navbar id="navHover" compact trigger="hover"></cu-navbar>
```

<!-- demo:navbar-compacto -->

> `trigger` sólo aplica en modo compacto: con la nav expandida los submenús siempre abren con
> click.

## Compactable y colapsado

`compactable` agrega el botón nativo que alterna el modo compacto (sin manejar estado afuera) y
`collapsed` hace que los submenús arranquen cerrados.

```html
<cu-navbar id="navCompactable" compactable collapsed trigger="click"></cu-navbar>
```

<!-- demo:navbar-compactable -->

## Responsive

`responsive` reemplaza la nav inline por una hamburguesa que abre el menú en un panel lateral.
`responsive-mode` acepta `auto` (**default**: fullscreen en pantallas muy chicas y lateral en el
resto), `side` (siempre lateral) y `fullscreen`; `side-over-position` elige desde qué borde
desliza (`left` —**default**—, `right`, `top`, `bottom`).

```html
<cu-navbar responsive responsive-mode="auto"></cu-navbar>
<cu-navbar responsive responsive-mode="side"></cu-navbar>
<cu-navbar responsive responsive-mode="fullscreen"></cu-navbar>

<cu-navbar responsive responsive-mode="side" side-over-position="left"></cu-navbar>
<cu-navbar responsive responsive-mode="side" side-over-position="right"></cu-navbar>
<cu-navbar responsive responsive-mode="side" side-over-position="top"></cu-navbar>
<cu-navbar responsive responsive-mode="side" side-over-position="bottom"></cu-navbar>
```

<!-- demo:navbar-responsive -->

## Activo

`active-path` marca qué item se ve como activo. Si se omite y hay router, se toma de la ruta
actual.

```html
<cu-navbar active-path="#usuarios"></cu-navbar>
```

<!-- demo:navbar-activo -->

## Atributos

<!--@include: ../partials/navbar/props-vanilla.md-->

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

<!--@include: ../partials/navbar/eventos.md-->

## Slots

<!--@include: ../partials/navbar/slots.md-->

## Métodos expuestos

<!--@include: ../partials/navbar/metodos.md-->
