# `<cu-dropdown-menu>`

Menú desplegable con items declarativos, iconos SVG, divisores y colores semánticos.

[← Volver](../SKILL.md)

---

## Props

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `theme` | `string` | `""` | Tema: `light`, `dark`, `sigacadv2` |
| `color` | `string` | `"neutral"` | Color semántico del toggle |
| `variant` | `string` | `"ghost"` | `solid`, `outlined`, `soft`, `ghost`, `subtle` |
| `disabled` | `boolean` | `false` | Deshabilitado |
| `label` | `string` | `""` | Texto del toggle |
| `placement` | `string` | `"bottom-start"` | `bottom-start`, `bottom-end`, `top-start`, `top-end` |
| `offset` | `number` | `4` | Gap entre toggle y menú (px) |
| `items` | `array` | `[]` | Items del menú (ver abajo) |

## Items

Cada item del array `items` puede tener:

| Campo | Tipo | Default | Descripción |
|-------|------|---------|-------------|
| `label` | `string` | `""` | Texto del item |
| `icon` | `string` | — | SVG string completo (`<svg>...</svg>`) |
| `onClick` | `function` | — | Callback al hacer clic |
| `color` | `string` | hereda del toggle | Color semántico del item |
| `variant` | `string` | `"ghost"` | Variante del botón |
| `disabled` | `boolean` | `false` | Item deshabilitado |
| `divider` | `boolean` | `false` | Renderiza una línea divisoria |
| `href` | `string` | — | Convierte el item en un link |
| `target` | `string` | `"_self"` | Target del link |

## Eventos

| Evento | Payload | Descripción |
|--------|---------|-------------|
| `open` | — | Se abre el menú |
| `close` | — | Se cierra el menú |

## Métodos expuestos

| Método | Descripción |
|--------|-------------|
| `.open()` | Abre el menú |
| `.close()` | Cierra el menú |
| `.toggle()` | Alterna visibilidad |
| `.isOpen` (getter) | Estado actual (`boolean`) |

## Uso en HTML plano

```html
<script src="dist/CuDropdownMenu.umd.js"></script>

<cu-dropdown-menu id="dd" label="Acciones" color="primary" variant="soft"></cu-dropdown-menu>

<script>
  const dd = document.getElementById('dd');
  dd.items = [
    { label: 'Editar', icon: '<svg ...>...</svg>', onClick: () => console.log('edit') },
    { label: 'Duplicar', icon: '<svg ...>...</svg>', onClick: () => console.log('dup') },
    { divider: true },
    { label: 'Eliminar', icon: '<svg ...>...</svg>', color: 'danger', onClick: () => console.log('del') },
  ];
</script>
```

Los items se asignan como propiedad JS (array de objetos). No se pasan como atributo HTML.

## Items con link

```js
dd.items = [
  { label: 'Perfil', href: '/perfil' },
  { label: 'Configuración', href: '/config' },
  { label: 'Cerrar sesión', href: '/logout', color: 'danger' },
];
```

## Toggle personalizado

Reemplaza el botón toggle usando `slot="toggle"`:

```html
<cu-dropdown-menu id="ddCustom" color="primary">
  <button slot="toggle"
          onclick="document.getElementById('ddCustom').toggle()"
          style="background:#3b82f6;color:white;border:none;border-radius:6px;padding:8px 14px;cursor:pointer">
    ☰ Menú
  </button>
</cu-dropdown-menu>
```

## Control programático

```html
<cu-dropdown-menu id="ddAPI" label="Dropdown"></cu-dropdown-menu>

<script>
  const dd = document.getElementById('ddAPI');
  dd.items = [ /* ... */ ];
  dd.open();                // Abre el menú
  dd.close();               // Cierra el menú
  dd.toggle();              // Alterna visibilidad
  console.log(dd.isOpen);   // true | false
</script>
```
