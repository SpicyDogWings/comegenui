[← Volver](../README.md)

# `<cu-dropdown-menu>`

Menú desplegable con items declarativos (label, ícono, color, divisor, link). El toggle se puede reemplazar con un slot, y el panel se puede llenar via `items` o con slot por defecto.

## Uso en HTML plano

```html
<script src="dist-libs/umd-core/CuDropdownMenu.umd.js"></script>

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

<!-- demo:dropdown-menu-uso -->

> **Importante:** `items` se asigna como propiedad JS (`dd.items = [...]`), no como atributo HTML.

## Colores

`color` pinta el toggle con los 6 nombres semánticos, que se resuelven con los tokens del tema activo.

```html
<cu-dropdown-menu label="primary" color="primary" variant="solid"></cu-dropdown-menu>
<cu-dropdown-menu label="secondary" color="secondary" variant="solid"></cu-dropdown-menu>
<cu-dropdown-menu label="neutral" color="neutral" variant="solid"></cu-dropdown-menu>
<cu-dropdown-menu label="success" color="success" variant="solid"></cu-dropdown-menu>
<cu-dropdown-menu label="warning" color="warning" variant="solid"></cu-dropdown-menu>
<cu-dropdown-menu label="danger" color="danger" variant="solid"></cu-dropdown-menu>
```

<!-- demo:dropdown-menu-colores -->

> Las secciones de apariencia muestran sólo el toggle; el panel se llena igual que en «Uso en HTML plano»: con `items` por JS o con el slot por defecto.

## Variantes

`variant` decide el aspecto del toggle con las 7 variantes de `Button`; `ghost` es el default.

```html
<cu-dropdown-menu label="solid" color="primary" variant="solid"></cu-dropdown-menu>
<cu-dropdown-menu label="outlined" color="primary" variant="outlined"></cu-dropdown-menu>
<cu-dropdown-menu label="soft" color="primary" variant="soft"></cu-dropdown-menu>
<cu-dropdown-menu label="ghost" color="primary" variant="ghost"></cu-dropdown-menu>
<cu-dropdown-menu label="subtle" color="primary" variant="subtle"></cu-dropdown-menu>
<cu-dropdown-menu label="link" color="primary" variant="link"></cu-dropdown-menu>
<cu-dropdown-menu label="none" color="primary" variant="none"></cu-dropdown-menu>
```

<!-- demo:dropdown-menu-variantes -->

## Estados

`disabled` atenúa el toggle y bloquea el menú: no abre ni por click ni por teclado.

```html
<cu-dropdown-menu label="Deshabilitado" color="primary" variant="solid" disabled></cu-dropdown-menu>
```

<!-- demo:dropdown-menu-deshabilitado -->

## Posicionamiento

`position` (`bottom` default, `top`) y `align` (`start` default, `center`, `end`) eligen dónde se abre el panel y cómo queda alineado con el toggle; `offset` (default `4`) es la separación en píxeles y `fixed` usa `position: fixed`. Un valor fuera del set cae a `bottom` / `start` (y `text-align` a `left`): sin ese fallback el panel quedaba en el flujo, sin pegarse al trigger.

Contra el viewport el panel se **voltea** al lado opuesto si no entra y se **clampea** al borde: no
genera scroll horizontal ni coordenadas negativas.

```html
<cu-dropdown-menu label="bottom / start" position="bottom" align="start"></cu-dropdown-menu>
<cu-dropdown-menu label="bottom / center" position="bottom" align="center"></cu-dropdown-menu>
<cu-dropdown-menu label="bottom / end" position="bottom" align="end"></cu-dropdown-menu>
<cu-dropdown-menu label="top / start" position="top" align="start"></cu-dropdown-menu>
<cu-dropdown-menu label="top / center" position="top" align="center"></cu-dropdown-menu>
<cu-dropdown-menu label="top / end" position="top" align="end"></cu-dropdown-menu>
<cu-dropdown-menu label="offset 16" offset="16"></cu-dropdown-menu>
<cu-dropdown-menu label="fixed" fixed></cu-dropdown-menu>
```

<!-- demo:dropdown-menu-posicionamiento -->

> El custom element sólo acepta `position`: `bottom` o `top`; en la API Vue también existen `left` y `right`.

## Alineación del texto

`text-align` (`left` **default**, `center`, `right`) alinea el **bloque de contenido** de los items
del panel: el ícono y el label se mueven juntos (el ícono no se descentra) y, si el label ocupa
más de una línea, el texto queda alineado dentro del ancho del item.

No confundir con `align`: `align` ubica el **panel** respecto del toggle; `text-align` alinea el
contenido **dentro** de cada item. El toggle no se ve afectado (su ancho lo define su contenido).

```html
<cu-dropdown-menu id="ddLeft" label="text-align: left" color="primary" variant="outlined" text-align="left"></cu-dropdown-menu>
<cu-dropdown-menu id="ddCenter" label="text-align: center" color="primary" variant="outlined" text-align="center"></cu-dropdown-menu>
<cu-dropdown-menu id="ddRight" label="text-align: right" color="primary" variant="outlined" text-align="right"></cu-dropdown-menu>

<script>
  const pencil = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>';

  for (const id of ['ddLeft', 'ddCenter', 'ddRight']) {
    document.getElementById(id).items = [
      { label: 'Editar', icon: pencil },
      { label: 'Duplicar', icon: pencil },
      { label: 'Eliminar', icon: pencil, color: 'danger' },
    ];
  }
</script>
```

<!-- demo:dropdown-menu-text-align -->

## Items

`items` es el array declarativo: cada item puede llevar `label`, `icon` (SVG inline), `color`, `variant`, `disabled`, `divider`, `href` con `target`, `selected` (check al final) y `onClick`, que se dispara al elegirlo.

> El HTML del `icon` se sanitiza con **DOMPurify** antes de inyectarse: los SVG válidos se
> conservan y se eliminan `<script>`, handlers `on*` y URLs peligrosas.

```html
<cu-dropdown-menu id="ddItems" label="Acciones" color="neutral" variant="outlined"></cu-dropdown-menu>

<script>
  const pencil = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>';
  const copy = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>';
  const trash = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>';

  document.getElementById('ddItems').items = [
    { label: 'Editar', icon: pencil, selected: true, onClick: () => console.log('editar') },
    { label: 'Duplicar', icon: copy, variant: 'soft', onClick: () => console.log('duplicar') },
    { label: 'Deshabilitado', disabled: true },
    { divider: true },
    { label: 'Sitio externo', href: 'https://developer.mozilla.org', target: '_blank' },
    { label: 'Eliminar', icon: trash, color: 'danger', onClick: () => console.log('eliminar') },
  ];
</script>
```

<!-- demo:dropdown-menu-items -->

## Slots

El slot `toggle` reemplaza el botón del trigger.

```html
<cu-dropdown-menu id="ddCustom" color="primary">
  <button slot="toggle" onclick="document.getElementById('ddCustom').toggle()">☰ Menú</button>
</cu-dropdown-menu>
```

<!-- demo:dropdown-menu-toggle-personalizado -->

El slot por defecto rellena el panel y sólo se usa cuando `items` está vacío.

```html
<cu-dropdown-menu label="Opciones">
  <div style="padding: 12px; min-width: 200px;">
    <p style="margin: 0 0 8px;">Contenido arbitrario</p>
    <a href="/logout">Cerrar sesión</a>
  </div>
</cu-dropdown-menu>
```

<!-- demo:dropdown-menu-contenido-libre -->

## Submenús anidados

Un `<cu-dropdown-menu>` dentro del panel de otro es un **submenú**: su trigger se dibuja como fila
del menú padre (`role="menuitem"`, `aria-haspopup` y `aria-expanded`) y su panel abre en cascada a
la derecha manteniendo el padre abierto. La detección cruza el shadow root del wrapper, así que el
markup anidado funciona sin configuración.

```html
<cu-dropdown-menu label="Acciones">
  <cu-dropdown-menu id="ddSubmenu" label="Más"></cu-dropdown-menu>
</cu-dropdown-menu>

<script>
  document.getElementById("ddSubmenu").items = [
    { label: "Compartir", onClick: () => console.log("compartir") },
  ];
</script>
```

## Interacción

`open` y `close` son los dos CustomEvents propios, y `open()`, `close()`, `toggle()` e `isOpen()` gobiernan el panel por código. El panel se anuncia como `role="menu"`; al cerrarse con `Escape` (o al elegir un item), el foco vuelve al trigger. `Escape` cierra sólo el menú **de arriba** (la pila de overlays es compartida con `cu-modal`, `cu-side-over` y los submenús: un menú con un submenú abierto cierra el submenú y deja el menú). Con `items` vacío el panel muestra el slot por defecto; las entradas nulas o que no son objetos se ignoran (no rompen el menú).

```html
<cu-dropdown-menu id="ddAPI" label="Dropdown"></cu-dropdown-menu>

<script>
  const dd = document.getElementById('ddAPI');
  dd.open();
  dd.close();
  dd.toggle();
  console.log(dd.isOpen());

  dd.addEventListener('open', () => console.log('abierto'));
  dd.addEventListener('close', () => console.log('cerrado'));
</script>
```

<!-- demo:dropdown-menu-control-programatico -->


## Teclado

El trigger por defecto es un `<button>`: <kbd>Enter</kbd> y <kbd>Espacio</kbd> abren el menú, y
<kbd>Flecha abajo</kbd> / <kbd>Flecha arriba</kbd> lo abren con la primera / última fila enfocada.
Las filas son `menuitem` y **no** son paradas de tabulación: el menú es una sola parada (el
trigger) y adentro se navega con el teclado.

| Tecla | Acción |
|-------|--------|
| <kbd>Flecha abajo</kbd> / <kbd>Flecha arriba</kbd> | Fila siguiente / anterior, salteando deshabilitadas, con vuelta al extremo |
| <kbd>Home</kbd> / <kbd>End</kbd> | Primera / última fila habilitada |
| Letras | Typeahead: enfoca la fila cuyo label empieza con lo tipeado |
| <kbd>Enter</kbd> / <kbd>Espacio</kbd> | Activa la fila enfocada (acción o link) |
| <kbd>Tab</kbd> | Cierra el menú y sigue el orden de tabulación |
| <kbd>Escape</kbd> | Cierra el menú (sólo si es el overlay de arriba) y devuelve el foco al trigger |

Un trigger propio (slot `toggle`) es responsabilidad del consumidor: el wrapper publica
`aria-haspopup` y `aria-expanded` en el elemento con `slot="toggle"`, pero el manejo de teclado del
menú sigue funcionando una vez abierto.

## Accesibilidad

- El trigger lleva `aria-haspopup="menu"`, `aria-expanded` y `aria-controls` con el `id` del panel.
- El panel toma su **nombre accesible del trigger** (`aria-label`): un `role="menu"` sin nombre se
  anunciaba como "menú" a secas. Un submenú anidado es `menuitem` con `aria-haspopup`/`aria-expanded`.
- El panel es `role="menu"` y cada fila es `role="menuitem"`. Un item con `selected: true` se
  anuncia como `menuitemcheckbox` marcado (`aria-checked="true"`); el check de lucide es decorativo.
- Los divisores (`divider`) se anuncian como separador, y un item `disabled` se anuncia
  deshabilitado: no recibe foco ni dispara `onClick`.
- El chevron del trigger es decorativo (`aria-hidden`).
- Con `slot="toggle"` el `aria-controls` no puede cruzar el shadow root: el panel queda sin
  referencia por `id` (el resto del estado sí se publica).

## Atributos

<!--@include: ../partials/dropdown-menu/props-vanilla.md-->

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
| `selected` | `boolean` | `false` | Muestra el check de lucide al final del item (estado de selección). Con `true` la fila se anuncia como `menuitemcheckbox` marcado |

Las entradas nulas o que no son objetos se ignoran: el menú sigue renderizando el resto.

## Eventos

<!--@include: ../partials/dropdown-menu/eventos-vanilla.md-->

## Slots

<!--@include: ../partials/dropdown-menu/slots.md-->

## Métodos expuestos

<!--@include: ../partials/dropdown-menu/metodos.md-->
