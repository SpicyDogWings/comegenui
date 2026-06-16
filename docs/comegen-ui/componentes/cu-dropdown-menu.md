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
  const pencil = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.168 16.931a.5.5 0 0 0-.131.237l-.8 2.685a.5.5 0 0 0 .61.61l2.685-.8a.5.5 0 0 0 .237-.13z"/><path d="M17.25 3.75 20.25 6.75"/></svg>';
  const copy = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>';
  const download = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>';
  const trash = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>';

  const dd = document.getElementById('dd');
  dd.items = [
    { label: 'Editar', icon: pencil, onClick: () => console.log('edit') },
    { label: 'Duplicar', icon: copy, onClick: () => console.log('dup') },
    { label: 'Exportar', icon: download, onClick: () => console.log('export') },
    { divider: true },
    { label: 'Eliminar', icon: trash, color: 'danger', onClick: () => console.log('del') },
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
