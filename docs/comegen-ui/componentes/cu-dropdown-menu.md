# `<cu-dropdown-menu>`

Menú desplegable con items declarativos (label, ícono, color, divisor, link). El toggle se puede reemplazar con un slot, y el panel se puede llenar via `items` o con slot por defecto.

[← Volver](../SKILL.md)

---

## Props

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `theme` | `string` | `""` | Tema: `light`, `dark`, `sigacadv2` (hereda de `<html data-theme>` si se omite) |
| `color` | `string` | `"neutral"` | Color semántico del toggle: `primary`, `neutral`, `success`, `warning`, `danger` |
| `variant` | `string` | `"ghost"` | Variante del toggle: `solid`, `outlined`, `soft`, `ghost`, `subtle`, `link` |
| `disabled` | `boolean` | `false` | Deshabilita el toggle |
| `hightContrast` | `boolean` | `false` | Modo de alto contraste |
| `label` | `string` | `""` | Texto del toggle (se ignora si se provee slot `toggle`) |
| `position` | `string` | `"bottom"` | Posición preferida del panel: `bottom`, `top` |
| `align` | `string` | `"start"` | Alineación del panel: `start`, `center`, `end` |
| `placement` | `string` | `""` | Shorthand combinado (`bottom-start`, `bottom-end`, `top-start`, `top-end`). Si se define, sobrescribe `position` y `align` |
| `offset` | `number` | `4` | Separación en píxeles entre el toggle y el panel |
| `items` | `array` | `[]` | Lista de items (ver abajo). Se asigna como propiedad JS, no como atributo HTML |

### Items

Cada item del array `items` puede tener:

| Campo | Tipo | Default | Descripción |
|-------|------|---------|-------------|
| `label` | `string` | `""` | Texto visible del item |
| `icon` | `string` | — | SVG completo inline (`<svg>...</svg>`) |
| `onClick` | `function` | — | Callback al hacer clic |
| `color` | `string` | hereda del toggle | Color semántico del item |
| `variant` | `string` | `"ghost"` | Variante del item |
| `disabled` | `boolean` | `false` | Item deshabilitado (no clickeable, atenuado) |
| `divider` | `boolean` | `false` | Si es `true`, renderiza una línea divisoria en vez de un item |
| `href` | `string` | — | Convierte el item en un link (`<a>`) |
| `target` | `string` | `"_self"` | Target del link cuando hay `href` |

## Eventos

| Evento | Payload (`e.detail`) | Descripción |
|--------|----------------------|-------------|
| `open` | — | Se emite cuando se abre el menú |
| `close` | — | Se emite cuando se cierra el menú |

## Slots

| Slot | Descripción |
|------|-------------|
| `toggle` | Reemplaza el botón toggle (sintaxis HTML `slot="toggle"`) |
| `default` | Contenido del panel. Se usa solo si `items` está vacío o no se provee |

## Métodos expuestos

| Método | Descripción |
|--------|-------------|
| `.open()` | Abre el menú |
| `.close()` | Cierra el menú |
| `.toggle()` | Alterna visibilidad |
| `.isOpen` (getter) | Estado actual (`boolean`) |

---

## Uso en HTML plano

```html
<script src="dist/CuDropdownMenu.umd.js"></script>

<cu-dropdown-menu id="dd" label="Acciones" color="primary" variant="soft"></cu-dropdown-menu>

<script>
  const pencil = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>';
  const copy = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>';
  const trash = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>';

  const dd = document.getElementById('dd');
  dd.items = [
    { label: 'Editar', icon: pencil, onClick: () => console.log('edit') },
    { label: 'Duplicar', icon: copy, onClick: () => console.log('dup') },
    { divider: true },
    { label: 'Eliminar', icon: trash, color: 'danger', onClick: () => console.log('del') },
  ];
</script>
```

> **Importante:** `items` se asigna como propiedad JS (`dd.items = [...]`), no como atributo HTML.

## Items con link

```js
dd.items = [
  { label: 'Perfil', href: '/perfil' },
  { label: 'Configuración', href: '/config' },
  { label: 'Cerrar sesión', href: '/logout', color: 'danger' },
];
```

## Toggle personalizado

Reemplaza el botón toggle con un slot HTML nativo:

```html
<cu-dropdown-menu id="ddCustom" color="primary">
  <button slot="toggle"
          onclick="document.getElementById('ddCustom').toggle()"
          style="background:#3b82f6;color:white;border:none;border-radius:6px;padding:8px 14px;cursor:pointer">
    ☰ Menú
  </button>
</cu-dropdown-menu>
```

## Contenido libre en el panel (sin `items`)

Si pasás contenido en el slot por defecto, el panel ignora `items` y muestra lo que definas:

```html
<cu-dropdown-menu id="ddLibre" label="Opciones">
  <div style="padding: 12px; min-width: 200px;">
    <p style="margin: 0 0 8px;">Contenido arbitrario</p>
    <a href="/logout">Cerrar sesión</a>
  </div>
</cu-dropdown-menu>
```

## Posicionamiento

El dropdown usa tres props combinables:

- `position` + `align`: separados (`bottom` + `start`)
- `placement`: shorthand (`bottom-start`)

```html
<cu-dropdown-menu label="Arriba" placement="top-end"></cu-dropdown-menu>
<cu-dropdown-menu label="Alineado" position="bottom" align="end" offset="8"></cu-dropdown-menu>
```

## Control programático

```html
<cu-dropdown-menu id="ddAPI" label="Dropdown"></cu-dropdown-menu>

<script>
  const dd = document.getElementById('ddAPI');
  dd.items = [ /* ... */ ];
  dd.open();
  dd.close();
  dd.toggle();
  console.log(dd.isOpen);

  dd.addEventListener('open', () => console.log('abierto'));
  dd.addEventListener('close', () => console.log('cerrado'));
</script>
```
