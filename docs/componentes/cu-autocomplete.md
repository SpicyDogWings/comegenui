# `<cu-autocomplete>`

Campo de texto con sugerencias en menú desplegable. Filtra los `items` en vivo según lo que escribe el usuario.

[← Volver](../README.md)

## Uso en HTML plano

```html
<script src="dist-libs/umd-core/CuAutocomplete.umd.js"></script>

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

> **No existe la prop `label`.** Para mostrar un rótulo sobre el campo, combiná con `<cu-label>`.

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

Al seleccionar, el input se completa con el `label` del item (o con su `value` si el item no tiene `label`).

---

## Mínimo de caracteres

Por defecto el menú se abre al recibir foco. Con `min-chars="2"` solo se abre tras escribir 2+ caracteres, **o al enfocar un campo cuyo texto ya tenga esos 2+ caracteres** (por ejemplo, precargado con `set()`).

```html
<cu-autocomplete id="ac" min-chars="2" placeholder="Escribí al menos 2 letras..."></cu-autocomplete>

<script>
  const ac = document.getElementById('ac');
  ac.items = [/* ... */];

  ac.set('Chile'); // texto precargado (5 caracteres, cumple min-chars)
  ac.focus();      // al enfocar, el panel se abre

  ac.open();       // abrelo por código sin importar min-chars
</script>
```

> `open()` ignora `min-chars`: es la salida programática. Lo que sí lo bloquea es `disabled`.

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
  ac.focus();                  // enfoca (abre si el texto cumple min-chars)
  console.log(ac.selectedItem()); // último item seleccionado
  console.log(ac.isOpen());      // true / false
  ac.open();                   // abre el panel (ignora min-chars)
  ac.close();                  // lo cierra
  ac.toggle();                 // alterna abierto/cerrado
</script>
```

---

## Tipos de input

```html
<cu-autocomplete type="text" placeholder="Buscar..."></cu-autocomplete>
<cu-autocomplete type="search" placeholder="Buscar..."></cu-autocomplete>
<cu-autocomplete type="email" placeholder="Email..."></cu-autocomplete>
```

---

## Atributos

<!-- @api:atributos -->
| Atributo | Tipo | Default | Descripción |
| ------ | ------ | ------ | ------ |
| `type` | `string` | `"text"` | `text`, `password`, `email`, `number`, `tel`, `url`, `search` |
| `color` | `"primary" \| "secondary" \| "neutral" \| "success" \| "warning" \| "danger"` | `"neutral"` | Color semántico: `primary`, `neutral`, `success`, `warning`, `danger` |
| `variant` | `"outlined" \| "soft" \| "ghost" \| "subtle"` | `"soft"` | `outlined`, `soft`, `ghost`, `subtle` |
| `disabled` | `boolean` | `false` | Estado deshabilitado |
| `read-only` | `boolean` | `false` | Solo lectura (en HTML se usa como `readonly`) |
| `placeholder` | `string` | `""` | Placeholder del input |
| `min-chars` | `number` | `0` | Caracteres mínimos para que el menú se abra al tipear o al enfocar (atributo HTML: `min-chars`) |
| `position` | `"left" \| "right" \| "bottom" \| "top"` | `"bottom"` | Posición del dropdown: `bottom`, `top` |
| `align` | `"center" \| "start" \| "end"` | `"start"` | Alineación: `start`, `center`, `end` |
| `fixed` | `boolean` | `false` | Panel en `position: fixed` (útil en contenedores con overflow) |
| `items` | `unknown[]` | `[]` | Opciones del menú (ver abajo). Se asigna como propiedad JS |
| `model-value` | `string` | `""` | Valor actual del texto. El CE sincroniza su estado; asigná `modelValue` sólo si querés controlarlo |
<!-- /@api:atributos -->

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

<!-- @api:eventos -->
| Evento | Payload (`e.detail`) | Descripción |
| ------ | ------ | ------ |
| `update:modelValue` | `string` | — |
| `select` | — | — |
| `blur` | — | — |
<!-- /@api:eventos -->

> Los eventos nativos del DOM (`input`, `change`, `focus`, `blur`) **burbujean automáticamente** al host desde el Shadow DOM. No se re-emiten como eventos custom con esos nombres.

## Slots

<!-- @api:slots -->
Ninguno.
<!-- /@api:slots -->

## Métodos expuestos

<!-- @api:metodos -->
| Método | Descripción |
| ------ | ------ |
| `get` | — |
| `set` | Setea el texto actual sin abrir el panel (para ver sugerencias usá `open()`). |
| `focus` | — |
| `reset` | — |
| `open` | Abre el panel de sugerencias (ignora `min-chars`). |
| `close` | Cierra el panel de sugerencias. |
| `toggle` | Alterna la visibilidad del panel de sugerencias. |
| `isOpen` | Indica si el panel está abierto. |
| `selectedItem` | Devuelve el item seleccionado o null. |
<!-- /@api:metodos -->

> `.reset()` limpia el texto de búsqueda; `.set('')` deja el input vacío sin tocar el estado de búsqueda.
