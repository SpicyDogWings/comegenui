# `<cu-navbar-horizontal>`

Barra de navegación horizontal con submenús desplegables (Dropdown) y detección de ítem activo por ruta.

[← Volver](../README.md)

## Uso en HTML plano

```html
<script src="dist/CuNavbarHorizontal.umd.js"></script>

<cu-navbar-horizontal id="nav" trigger="hover" active-path="/equipo/dev"></cu-navbar-horizontal>

<script>
  const nav = document.getElementById('nav');
  await customElements.whenDefined('cu-navbar-horizontal');
  nav.items = [
    { label: 'Inicio', path: '/' },
    { label: 'Equipo', children: [
      { label: 'Desarrollo', path: '/equipo/dev' },
      { label: 'Diseño', path: '/equipo/diseno' },
    ]},
  ];
</script>
```

---

## Estructura de `items`

```ts
interface NavItem {
  label: string;
  path?: string;        // enlaces y detección de activo
  icon?: string;        // string HTML (puede ser un SVG inline)
  children?: NavItem[]; // submenús desplegables
}
```

---

## Atributos

<!-- @api:atributos -->
| Atributo | Tipo | Default | Descripción |
| ------ | ------ | ------ | ------ |
| `trigger` | `"click" \| "hover"` | `'click'` | Cómo abren los submenús: `click` o `hover` |
| `active-path` | `string` | `''` | Path activo manual. Si se omite, se toma de la ruta (cuando hay router) |
| `items` | `unknown[]` | `—` | Estructura de navegación. **Se asigna como propiedad JS** |
<!-- /@api:atributos -->

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

<!-- @api:eventos -->
Ninguno.
<!-- /@api:eventos -->

## Slots

<!-- @api:slots -->
Ninguno.
<!-- /@api:slots -->

## Métodos expuestos

<!-- @api:metodos -->
No expone métodos.
<!-- /@api:metodos -->
