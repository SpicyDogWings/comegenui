[← Volver](../README.md)

# `<cu-autocomplete>`

Campo de texto con sugerencias en menú desplegable. Filtra los `items` en vivo según lo que escribe el usuario.

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
  ];
</script>
```

En Vue, importá `Autocomplete` de `@/components/form/Autocomplete.vue` (ver [ficha Vue](/componentes/vue/autocomplete)).

> **No existe la prop `label`.** Para mostrar un rótulo sobre el campo, combiná con `<cu-label>`. Todos los ejemplos de abajo asumen `items` ya cargado (ver arriba).

## Colores

`color` es un nombre semántico (`primary`, `secondary`, `neutral`, `success`, `warning`, `danger`) que tiñe el campo y el panel.

```html
<cu-autocomplete color="primary" placeholder="primary"></cu-autocomplete>
<cu-autocomplete color="secondary" placeholder="secondary"></cu-autocomplete>
<cu-autocomplete color="neutral" placeholder="neutral"></cu-autocomplete>
<cu-autocomplete color="success" placeholder="success"></cu-autocomplete>
<cu-autocomplete color="warning" placeholder="warning"></cu-autocomplete>
<cu-autocomplete color="danger" placeholder="danger"></cu-autocomplete>
```

<!-- demo:autocomplete-colores -->

## Variantes

`variant` decide el aspecto del campo: `outlined` (borde), `soft` (**default**; fondo tenue), `ghost` (transparente) y `subtle` (tenue con borde).

```html
<cu-autocomplete color="primary" variant="outlined" placeholder="outlined"></cu-autocomplete>
<cu-autocomplete color="primary" variant="soft" placeholder="soft"></cu-autocomplete>
<cu-autocomplete color="primary" variant="ghost" placeholder="ghost"></cu-autocomplete>
<cu-autocomplete color="primary" variant="subtle" placeholder="subtle"></cu-autocomplete>
```

<!-- demo:autocomplete-variantes -->

## Estados

`disabled` bloquea el campo y no abre el panel. `readonly` deja leer y abrir el panel, pero no escribir.
`loading` muestra el spinner de carga en el panel de sugerencias (como en `<cu-select>`), para cuando
los items se están buscando.

```html
<cu-autocomplete placeholder="habilitado"></cu-autocomplete>
<cu-autocomplete disabled placeholder="disabled"></cu-autocomplete>
<cu-autocomplete readonly placeholder="readonly"></cu-autocomplete>
```

<!-- demo:autocomplete-estados -->

## Carga

Con `loading` el panel muestra el spinner mientras se buscan los items (igual que en `<cu-select>`):
abrí el panel con `open()` y volvé a `loading = false` cuando termine la búsqueda.

```html
<cu-autocomplete id="carga" placeholder="Buscá una persona"></cu-autocomplete>

<script>
  const ac = document.getElementById('carga');
  ac.loading = true; // propiedad JS
  ac.open();
  buscar().finally(() => { ac.loading = false; });
</script>
```

<!-- demo:autocomplete-loading -->

## Items del menú

Cada item puede llevar un `icon` (SVG inline), un `value` distinto del `label`, o estar `disabled`.

```html
<cu-autocomplete id="ac" placeholder="Elegí un item..."></cu-autocomplete>

<script>
  const icon = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>';

  const ac = document.getElementById('ac');
  ac.items = [
    { label: 'Administrador', icon },
    { label: 'Editor de contenido', icon },
    { label: 'Juan Pérez (juan@mail.com)', value: 'Juan Pérez' },
    { label: 'Invitado externo', disabled: true },
  ];
</script>
```

Al seleccionar, el input se completa con el `label` (o con el `value` si el item no tiene `label`).

<!-- demo:autocomplete-items -->

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

<!-- demo:autocomplete-minimo-caracteres -->

> `open()` ignora `min-chars`: es la salida programática. Lo que sí lo bloquea es `disabled`.

## Posicionamiento

`position` (`bottom` **default**, `top`, `left`, `right`) y `align` (`start` **default**, `center`, `end`) ubican el panel respecto al campo. `fixed` lo posiciona en `position: fixed` (útil en contenedores con `overflow`).

```html
<cu-autocomplete position="top" align="end" placeholder="position=top / align=end"></cu-autocomplete>
<cu-autocomplete position="bottom" align="end" placeholder="position=bottom / align=end"></cu-autocomplete>
```

<!-- demo:autocomplete-posicionamiento -->

## Tipos de input

`type` es el tipo del `<input>` interno: `text` (**default**), `password`, `email`, `number`, `tel`, `url` o `search`.

```html
<cu-autocomplete type="text" placeholder="Buscar..."></cu-autocomplete>
<cu-autocomplete type="search" placeholder="Buscar..."></cu-autocomplete>
<cu-autocomplete type="email" placeholder="Email..."></cu-autocomplete>
```

<!-- demo:autocomplete-tipos-de-input -->

## Alineación del texto

`text-align` (`left` **default**, `center`, `right`) alinea el texto del **input** (el valor y su
placeholder) y los **items del panel**, cada uno dentro de su ancho; con ícono, el ícono y el label
se mueven juntos (el ícono no se descentra).

```html
<cu-autocomplete id="acLeft" text-align="left" placeholder="text-align: left (default)"></cu-autocomplete>
<cu-autocomplete id="acCenter" text-align="center" placeholder="text-align: center"></cu-autocomplete>
<cu-autocomplete id="acRight" text-align="right" placeholder="text-align: right"></cu-autocomplete>

<script>
  const items = [
    { label: 'Administrador' },
    { label: 'Editor de contenido' },
    { label: 'Visor de reportes' },
  ];
  for (const id of ['acLeft', 'acCenter', 'acRight']) {
    document.getElementById(id).items = items;
  }
</script>
```

<!-- demo:autocomplete-alineacion -->

## Selección

`select` se dispara al elegir un item (con el item en `e.detail`) y `blur` al salir del campo.

```html
<cu-autocomplete id="ac" placeholder="Buscá un país..."></cu-autocomplete>

<script>
  const ac = document.getElementById('ac');
  ac.items = [{ label: 'Argentina' }, { label: 'Brasil' }, { label: 'Chile' }];

  ac.addEventListener('select', (e) => console.log('select:', e.detail));
  ac.addEventListener('blur', () => console.log('blur: el foco salió del campo'));
</script>
```

<!-- demo:autocomplete-seleccion -->

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

<!-- demo:autocomplete-control-programatico -->

## Atributos

<!--@include: ../partials/autocomplete/props-vanilla.md-->

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

<!--@include: ../partials/autocomplete/eventos.md-->

> Los eventos nativos del DOM (`input`, `change`, `focus`, `blur`) **burbujean automáticamente** al host desde el Shadow DOM. No se re-emiten como eventos custom con esos nombres.

## Slots

<!--@include: ../partials/autocomplete/slots.md-->

## Métodos expuestos

<!--@include: ../partials/autocomplete/metodos-vanilla.md-->

> `.reset()` limpia el texto de búsqueda; `.set('')` deja el input vacío sin tocar el estado de búsqueda.
