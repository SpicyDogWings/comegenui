# NavbarHorizontal — `<cu-navbar-horizontal>` / `<NavbarHorizontal>`

Barra de navegación horizontal con submenús desplegables (Dropdown) y detección del ítem activo por ruta.

## Cuándo usarlo

Para una barra de navegación superior con items y submenús anidados. Si necesitás búsqueda,
modo scroll o colapso responsive, usá `cu-navbar`.

## Receta

1. Definí `items`: un array de `{ label, path?, icon?, children? }`.
2. Los items con `children` abren un submenú; los que tienen `path` son links; los que no
   tienen ninguno de los dos no navegan.
3. Elegí cómo abren los submenús con `trigger`: `click` (default) o `hover`.
4. Marcá el activo con `active-path`. En vanilla no hay router, así que pasalo siempre; en
   Vue, si hay vue-router, se toma de la ruta y `active-path` lo pisa.
5. Si usás `icon`, pasalo como string de HTML/SVG con `currentColor`.
6. Los submenús anidan a cualquier profundidad (recursivo).

```html
<!-- HTML plano (UMD) -->
<script src="dist/CuNavbarHorizontal.core.umd.js"></script>

<cu-navbar-horizontal id="nav" trigger="hover" active-path="/equipo/dev"></cu-navbar-horizontal>

<script>
  const nav = document.getElementById('nav');
  nav.items = [
    { label: 'Inicio', path: '/' },
    { label: 'Equipo', children: [
      { label: 'Desarrollo', path: '/equipo/dev' },
      { label: 'Diseño', path: '/equipo/diseno' },
    ]},
  ];
</script>
```

```vue
<!-- Vue -->
<script setup lang="ts">
import NavbarHorizontal from "@/components/navigation/NavbarHorizontal.vue";

const items = [
  { label: 'Inicio', path: '/' },
  { label: 'Equipo', children: [
    { label: 'Desarrollo', path: '/equipo/dev' },
    { label: 'Diseño', path: '/equipo/diseno' },
  ]},
];
</script>

<template>
  <NavbarHorizontal trigger="hover" active-path="/equipo/dev" :items="items" />
</template>
```

## Qué puede y qué no puede

**Puede:** anidamiento recursivo de submenús (`children` en cualquier nivel), `trigger`
(`click`/`hover`), ítem activo por `active-path` (o por ruta en Vue con vue-router), `icon`
como string HTML/SVG, e items sin `path` que se muestran atenuados.

**No puede:**

- **No emite eventos custom.** No hay `select` ni `navigate`: la navegación es un link real
  (`path`), no un callback.
- **No tiene slots**, ni default ni por item: todo se define con `items`.
- **No expone métodos.**
- **No acepta `color`, `variant` ni `size`.** El ítem activo siempre se pinta `primary` +
  `soft` y el resto va ghost.
- **`items` es requerido y sólo se asigna como propiedad JS** (es un array); como atributo
  HTML no funciona.
- **`icon` es HTML crudo** (se inyecta con `v-html`): no acepta componentes ni slots.
- Un item de primer nivel con `children` usa su `path` apenas como identificador: el toggle
  es un botón que no navega.
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
