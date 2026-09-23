# `<cu-autocomplete>`

Campo de texto con sugerencias en menú desplegable. Filtra los `items` en vivo según lo que escribe el usuario.

[← Volver](../SKILL.md)

---

---

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

### Con label

El label se muestra sobre el input:

```html
<cu-autocomplete id="ac" label="Buscar rol" placeholder="Escriba para buscar..."></cu-autocomplete>
```

---

## Items con ícono

```js
const icon = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>';

ac.items = [
  { label: 'Administrador', icon },
  { label: 'Editor de contenido', icon },
];
```

---

## Items con `value` distinto del `label`

Útil cuando querés mostrar más contexto (ej. email) pero asignar un valor más corto:

```js
ac.items = [
  { label: 'Juan Pérez (juan@mail.com)', value: 'Juan Pérez' },
  { label: 'María García (maria@mail.com)', value: 'María García' },
];
```

Al seleccionar, el input se completa con el `value` en vez del `label`.

---

## Mínimo de caracteres

Por defecto el menú se abre al recibir foco. Con `min-chars="2"` solo se abre tras escribir 2+ caracteres:

```html
<cu-autocomplete min-chars="2" placeholder="Escribí al menos 2 letras..."></cu-autocomplete>
```

---

## Posicionamiento

```html
<!-- Con position + align -->
<cu-autocomplete position="top" align="end"></cu-autocomplete>

<cu-autocomplete position="bottom" align="end"></cu-autocomplete>
```

---

## Control programático

```html
<cu-autocomplete id="ac" placeholder="Buscá..." color="primary"></cu-autocomplete>

<script>
  const ac = document.getElementById('ac');
  ac.items = [/* ... */];

  ac.set('Admin');             // asigna texto
  console.log(ac.get());       // "Admin"
  ac.focus();                  // enfoca
  console.log(ac.selectedItem()); // último item seleccionado
  console.log(ac.isOpen());      // true / false
</script>
```

---

## Tipos de input

```html
<cu-autocomplete type="text" placeholder="Buscar..."></cu-autocomplete>
<cu-autocomplete type="search" placeholder="Buscar..."></cu-autocomplete>
<cu-autocomplete type="email" placeholder="Email..."></cu-autocomplete>
```

## Props

| Atributo | Tipo | Default | Descripción |
|------|------|------|------|
| `color` | `"primary" \| "secondary" \| "neutral" \| "success" \| "warning" \| "danger"` | `"neutral"` | Color semántico: `primary`, `neutral`, `success`, `warning`, `danger` |
| `disabled` | `boolean` | `false` | Estado deshabilitado |
| `readOnly` | `boolean` | `false` | Solo lectura (en HTML se usa como `readonly`) |
| `placeholder` | `string` | `""` | Placeholder del input |
| `variant` | `"outlined" \| "soft" \| "ghost" \| "subtle"` | `"soft"` | `outlined`, `soft`, `ghost`, `subtle` |
| `type` | `string` | `"text"` | `text`, `password`, `email`, `number`, `tel`, `url`, `search` |
| `minChars` | `number` | `0` | Caracteres mínimos para abrir el menú (atributo HTML: `min-chars`) |
| `items` | `AutocompleteItem[]` | `[]` | Opciones del menú (ver abajo). Se asigna como propiedad JS |
| `position` | `"bottom" \| "top" \| "left" \| "right"` | `"bottom"` | Posición del dropdown: `bottom`, `top` |
| `align` | `"start" \| "center" \| "end"` | `"start"` | Alineación: `start`, `center`, `end` |
| `fixed` | `boolean` | `false` |  |
| `modelValue` | `string` | `""` | Valor del texto de búsqueda (v-model). |

### Items

Cada item del array `items` puede tener:

| Campo | Tipo | Default | Descripción |
|-------|------|---------|-------------|
| `label` | `string` | — | Texto que se muestra y sobre el que se busca |
| `value` | `string` | `label` | Valor que se asigna al input al seleccionar el item |
| `icon` | `string` | — | SVG completo inline (`<svg>...</svg>`) |
| `disabled` | `boolean` | `false` | Opción deshabilitada (no clickeable, atenuada) |

> La búsqueda se hace sobre `label` y `value` (cuando existe). Es **case-insensitive** y **acento-insensitive**: buscar `"matricula"` encuentra `"Matrícula"`.

> **Importante:** `items` se asigna como propiedad JS (`ac.items = [...]`), no como atributo HTML.

## Eventos

| Evento | Payload (`e.detail`) | Descripción |
|------|------|------|
| `update:modelValue` | `string` | Se emite en cada cambio de valor (al escribir) |
| `select` | `{ label, value?, icon? }` | Se emite al elegir un item de la lista |
| `blur` | `FocusEvent` | Pérdida de foco (útil en celdas editables) |

> Los eventos nativos del DOM (`input`, `change`, `focus`, `blur`) **burbujean automáticamente** al host desde el Shadow DOM. No se re-emiten como eventos custom con esos nombres.

## Slots

Ninguno.

## Métodos expuestos

| Método | Descripción |
|------|------|
| `.get()` | Devuelve el texto actual. |
| `.set(val: string)` | Setea el texto actual en el input. |
| `.reset()` | Limpia el texto de búsqueda. |
| `.focus()` | Enfoca el input. |
| `.isOpen()` | Indica si el panel está abierto. |
| `.selectedItem()` | Devuelve el item seleccionado o null. |

> El componente **no expone** `.reset()`. Si necesitás limpiar programáticamente, usá `.set('')`.

## Interfaces

### `AutocompleteItem`

```ts
interface AutocompleteItem {
  label: string;
  icon?: string;
  value?: string;
}
```
