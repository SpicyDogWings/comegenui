# `<cu-autocomplete>`

Campo de búsqueda con sugerencias en menú desplegable. Filtra los items en vivo al escribir.

[← Volver](../SKILL.md)

---

## Props

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `theme` | `string` | `""` | Tema: `light`, `dark`, `sigacadv2` |
| `color` | `string` | `"neutral"` | Color semántico |
| `variant` | `string` | `"none"` | `outlined`, `soft`, `ghost`, `subtle`, `none` |
| `type` | `string` | `"text"` | `text`, `password`, `email`, `number`, `tel`, `url`, `search` |
| `placeholder` | `string` | `""` | Placeholder del input |
| `min-chars` | `number` | `0` | Caracteres mínimos para abrir el menú |
| `position` | `string` | `"bottom"` | `bottom`, `top` |
| `align` | `string` | `"start"` | `start`, `center`, `end` |
| `placement` | `string` | `""` | Compatibilidad: `bottom-start`, etc. (si se usa, anula position+align) |
| `disabled` | `boolean` | `false` | Deshabilitado |
| `readonly` | `boolean` | `false` | Solo lectura |
| `items` | `array` | `[]` | Items del menú (ver abajo) |

## Items

Cada item del array `items` puede tener:

| Campo | Tipo | Default | Descripción |
|-------|------|---------|-------------|
| `label` | `string` | — | Texto que se muestra y se busca |
| `value` | `string` | `label` | Valor que se asigna al input al seleccionar |
| `icon` | `string` | — | SVG string completo (`<svg>...</svg>`) |
| `disabled` | `boolean` | `false` | Opción deshabilitada (no clickeable, atenuada) |

La búsqueda se hace sobre `label` y `value` (cuando existe). Las opciones con `disabled: true` se ven atenuadas y no responden al click.

## Eventos

| Evento | Payload | Descripción |
|--------|---------|-------------|
| `select` | `{ label, value?, icon? }` | Item seleccionado |
| `update:modelValue` | `string` | Cambio de valor (emitido al seleccionar) |
| `blur` | — | Perdió el foco (útil en celdas editables) |
| `input` *(nativo)* | `InputEvent` del `<input>` interno | Se emite al escribir. Atraviesa el Shadow DOM automáticamente — no necesita `ceEmit`. |

## Métodos expuestos

| Método | Descripción |
|--------|-------------|
| `.get()` | Texto actual del input |
| `.set(value)` | Asigna texto al input |
| `.focus()` | Enfoca el input |
| `.selectedItem` (getter) | Último item seleccionado o `null` |
| `.isOpen` (getter) | Estado del menú |

## Uso en HTML plano

```html
<script src="dist/CuAutocomplete.umd.js"></script>

<cu-autocomplete id="ac" placeholder="Buscá un rol..." color="primary"></cu-autocomplete>

<script>
  const ac = document.getElementById('ac');
  ac.items = [
    { label: 'Administrador' },
    { label: 'Editor de contenido' },
    { label: 'Visor de reportes' },
    { label: 'Invitado externo' },
    { label: 'Supervisor' },
    { label: 'Analista de datos' },
    { label: 'Gestor de usuarios' },
  ];

  ac.addEventListener('select', (e) => {
    console.log('Seleccionado:', e.detail.label);
  });
</script>
```

## Items con icono

```js
const icon = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>';

ac.items = [
  { label: 'Administrador', icon },
  { label: 'Editor de contenido', icon },
];
```

## Items con value distinto del label

```js
ac.items = [
  { label: 'Juan Pérez (juan@mail.com)', value: 'Juan Pérez' },
  { label: 'María García (maria@mail.com)', value: 'María García' },
];
```

Al seleccionar, el input se completa con el `value` en vez del `label`.

## Control programático

```html
<cu-autocomplete id="ac" placeholder="Buscá..." color="primary"></cu-autocomplete>

<script>
  const ac = document.getElementById('ac');
  ac.items = [ /* ... */ ];
  ac.set('Admin');          // asigna texto
  console.log(ac.get());     // obtiene texto
  ac.focus();                // enfoca
  console.log(ac.selectedItem); // último item seleccionado
  console.log(ac.isOpen);    // true/false
</script>
```
