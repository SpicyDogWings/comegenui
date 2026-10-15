[← Volver](../README.md)

# `<cu-navbar-horizontal>`

Barra de navegación horizontal con submenús desplegables (Dropdown) y detección de ítem activo
por ruta. Toda la estructura entra por `items`.

## Uso en HTML plano

```html
<script src="dist-libs/umd-core/CuNavbarHorizontal.umd.js"></script>

<cu-navbar-horizontal id="nav"></cu-navbar-horizontal>

<script>
  const nav = document.getElementById('nav');
  nav.items = [
    { label: 'Inicio', path: '/inicio' },
    { label: 'Equipo', children: [
      { label: 'Desarrollo', path: '/equipo/dev' },
      { label: 'Diseño', path: '/equipo/diseno' },
    ]},
  ];
</script>
```

<!-- demo:navbar-horizontal-uso -->

## Submenús

Un item con `children` se convierte en un Dropdown que despliega un `<NavbarMenu>`; los niveles
se pueden anidar sin límite.

```html
<cu-navbar-horizontal id="nav"></cu-navbar-horizontal>

<script>
  document.getElementById('nav').items = [
    { label: 'Inicio', path: '/inicio' },
    { label: 'Equipo', children: [
      { label: 'Desarrollo', path: '/equipo/dev' },
      { label: 'Diseño', children: [
        { label: 'Sistema', path: '/diseno/sistema' },
        { label: 'Marca', path: '/diseno/marca' },
      ]},
    ]},
    { label: 'Contacto', path: '/contacto' },
  ];
</script>
```

<!-- demo:navbar-horizontal-submenus -->

## Enlaces e iconos

`path` es el destino del enlace (y lo que `active-path` compara); `icon` es un string HTML
(SVG inline) que se inyecta antes del label. Un item **sin** `path` no navega: renderiza un
`<button>`.

```html
<cu-navbar-horizontal id="nav"></cu-navbar-horizontal>

<script>
  const casa = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>';

  document.getElementById('nav').items = [
    { label: 'Inicio', path: '/inicio', icon: casa },
    { label: 'Ajustes', path: '/ajustes' },
    { label: 'Sólo texto' },
  ];
</script>
```

<!-- demo:navbar-horizontal-iconos -->

## Trigger

`trigger` decide cómo abren los submenús: `click` (**default**) o `hover`.

```html
<cu-navbar-horizontal id="click" trigger="click"></cu-navbar-horizontal>
<cu-navbar-horizontal id="hover" trigger="hover"></cu-navbar-horizontal>

<script>
  const items = [
    { label: 'Inicio', path: '/inicio' },
    { label: 'Producto', children: [
      { label: 'Features', path: '/features' },
      { label: 'Precios', path: '/precios' },
    ]},
  ];
  document.getElementById('click').items = items;
  document.getElementById('hover').items = items;
</script>
```

<!-- demo:navbar-horizontal-trigger -->

## Activo

`active-path` marca el item activo (color `primary` + variante `soft`). Si el item activo está
dentro de un submenú, se resalta el padre.

```html
<cu-navbar-horizontal id="enSubmenu" active-path="/equipo/dev"></cu-navbar-horizontal>
<cu-navbar-horizontal id="suelto" active-path="/contacto"></cu-navbar-horizontal>

<script>
  const items = [
    { label: 'Inicio', path: '/inicio' },
    { label: 'Equipo', children: [
      { label: 'Desarrollo', path: '/equipo/dev' },
      { label: 'Diseño', path: '/equipo/diseno' },
    ]},
    { label: 'Contacto', path: '/contacto' },
  ];
  document.getElementById('enSubmenu').items = items;
  document.getElementById('suelto').items = items;
</script>
```

<!-- demo:navbar-horizontal-activo -->

## Estructura de `items`

```ts
interface NavItem {
  label: string;
  path?: string;        // enlaces y detección de activo
  icon?: string;        // string HTML (puede ser un SVG inline)
  children?: NavItem[]; // submenús desplegables
}
```

## Atributos

<!--@include: ../partials/navbar-horizontal/props-vanilla.md-->

> **`items` se asigna como propiedad JS**, no como atributo HTML:

```js
const nav = document.getElementById('nav');
nav.items = [
  { label: 'Inicio', path: '/' },
  { label: 'Equipo', children: [
    { label: 'Desarrollo', path: '/equipo/dev' },
    { label: 'Diseño', path: '/equipo/diseno' },
  ]},
];
```

## Eventos

<!--@include: ../partials/navbar-horizontal/eventos.md-->

## Slots

<!--@include: ../partials/navbar-horizontal/slots.md-->

## Métodos expuestos

<!--@include: ../partials/navbar-horizontal/metodos.md-->
