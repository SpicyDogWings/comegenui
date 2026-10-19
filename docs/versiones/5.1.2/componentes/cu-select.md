[← Volver](../README.md)

# `<cu-select>`

Selector de opciones con color, variante, búsqueda por teclado, barra de cooldown,
posicionamiento configurable y estado de carga. Mantiene su estado y también se controla vía
`modelValue` o los métodos `get`/`set`.

## Uso en HTML plano

```html
<script src="dist-libs/umd-core/CuSelect.umd.js"></script>

<cu-select id="miSelect" placeholder="Seleccione una opción" color="primary" variant="outlined"></cu-select>

<script>
  const select = document.getElementById('miSelect');
  select.options = [
    { value: 'doc', label: 'Documento' },
    { value: 'pdf', label: 'PDF' },
    { value: 'csv', label: 'CSV' },
  ];
  select.set('pdf');
  console.log(select.get()); // "pdf"
</script>
```

<!-- demo:select-uso -->

## Colores

`color` es un nombre semántico, no un hex: se resuelve con los tokens del tema activo, así que
el mismo nombre se ve distinto en cada tema.

```html
<cu-select color="primary" placeholder="primary"></cu-select>
<cu-select color="secondary" placeholder="secondary"></cu-select>
<cu-select color="neutral" placeholder="neutral"></cu-select>
<cu-select color="success" placeholder="success"></cu-select>
<cu-select color="warning" placeholder="warning"></cu-select>
<cu-select color="danger" placeholder="danger"></cu-select>

<script>
  document.querySelectorAll('cu-select').forEach((s) => {
    s.options = [
      { value: 'ok', label: 'Aprobado' },
      { value: 'pend', label: 'Pendiente' },
    ];
  });
</script>
```

<!-- demo:select-colores -->

## Variantes

`variant` acepta `outlined` (borde), `soft` (fondo tenue, el **default**), `ghost`
(transparente) y `subtle` (fondo tenue con borde).

```html
<cu-select variant="outlined" placeholder="outlined"></cu-select>
<cu-select variant="soft" placeholder="soft (default)"></cu-select>
<cu-select variant="ghost" placeholder="ghost"></cu-select>
<cu-select variant="subtle" placeholder="subtle"></cu-select>
```

<!-- demo:select-variantes -->

## Opciones deshabilitadas

Una opción con `disabled: true` se ve atenuada y no responde al click.

```html
<cu-select id="miSelect" placeholder="Elige un formato"></cu-select>

<script>
  const s = document.getElementById('miSelect');
  s.options = [
    { value: 'pdf', label: 'PDF' },
    { value: 'doc', label: 'Documento', disabled: true },
    { value: 'csv', label: 'CSV', disabled: true },
    { value: 'xlsx', label: 'Excel' },
  ];
</script>
```

<!-- demo:select-opciones-deshabilitadas -->

## Opciones con color

Una opción puede fijar su propio `color` (y `variant`); si no lo hace, hereda los valores del
`<cu-select>`.

```html
<cu-select id="miSelect"></cu-select>

<script>
  const s = document.getElementById('miSelect');
  s.options = [
    { value: 'ok',   label: 'Aprobado',  color: 'success' },
    { value: 'warn', label: 'Pendiente', color: 'warning' },
    { value: 'err',  label: 'Rechazado', color: 'danger' },
  ];
</script>
```

<!-- demo:select-opciones-color -->

## Texto y alineación

`text-align` alinea el texto (`left` **default**, `center`, `right`) y `placeholder-wrap`
elige entre envolver el placeholder o truncarlo con `...`.

```html
<cu-select text-align="left" placeholder="text-align: left (default)"></cu-select>
<cu-select text-align="center" placeholder="text-align: center"></cu-select>
<cu-select text-align="right" placeholder="text-align: right"></cu-select>
<cu-select placeholder-wrap
  placeholder="Un placeholder largo que se envuelve en varias líneas en vez de truncarse"></cu-select>
```

<!-- demo:select-texto -->

## Búsqueda por teclado

Con `search-enabled` el select acepta entrada por teclado (como un `<select>` nativo): al
escribir, la lista hace scroll a la primera opción que coincide.

```html
<cu-select id="paises" search-enabled placeholder="Escribí para buscar"></cu-select>

<script>
  const select = document.getElementById('paises');
  select.options = [
    { value: 'ar', label: 'Argentina' },
    { value: 'br', label: 'Brasil' },
    { value: 'cl', label: 'Chile' },
    { value: 'co', label: 'Colombia' },
    { value: 'mx', label: 'México' },
    { value: 'pe', label: 'Perú' },
  ];
</script>
```

<!-- demo:select-search-enabled -->

La coincidencia la define `search-mode`: `startsWith` (**default**, sólo al inicio del label) o
`includes` (en cualquier parte); `search-reset-delay` (1000ms por default) es el tiempo sin
teclear antes de resetear el texto acumulado.

## Barra de cooldown

Mientras se escribe (con `search-enabled`), aparece una barra que se vacía en
`search-reset-delay` ms. `cooldown-variant` elige su estilo: `ghost` (color suave) o `solid`
(color lleno).

```html
<!-- Cooldown con color suave (ghost, default) -->
<cu-select search-enabled></cu-select>

<!-- Cooldown con color lleno (solid) -->
<cu-select search-enabled cooldown-variant="solid"></cu-select>

<!-- Cooldown personalizado: 3s -->
<cu-select search-enabled search-reset-delay="3000"></cu-select>
```

<!-- demo:select-cooldown -->

> Si `loading` está activo, la barra de cooldown **no se muestra**.

## Carga

Con `loading` se muestra una barra animada arriba del panel y el dropdown se atenúa (sin
interacción).

```html
<cu-select id="miSelect" loading placeholder="Elegí un formato"></cu-select>

<script>
  const select = document.getElementById('miSelect');
  select.loading = true;   // mostrar
  // ...carga...
  select.loading = false;  // ocultar
</script>
```

<!-- demo:select-loading -->

## Estado deshabilitado

`disabled` bloquea la apertura del dropdown y atenúa el control.

```html
<cu-select disabled placeholder="disabled"></cu-select>
```

<!-- demo:select-deshabilitado -->

## Posicionamiento

`position` acepta `bottom` (**default**) y `top` (el wrapper `Dropdown` también contempla
`left`/`right`); `align` acepta `start` (**default**), `center` y `end`. Con `fixed`, el panel
se posiciona respecto del viewport.

```html
<cu-select position="bottom" align="end" placeholder="bottom / end"></cu-select>
<cu-select position="top" align="center" placeholder="top / center"></cu-select>
<cu-select position="bottom" align="end" placeholder="bottom / end"></cu-select>
<cu-select position="top" align="start" placeholder="top / start"></cu-select>
```

<!-- demo:select-posicionamiento -->

## Escuchar cambios

`select` trae la opción elegida (`{ value, label }`), `update:modelValue` el valor nuevo y
`change` el valor nuevo cuando el cambio es por click (igual que un `<select>` nativo).

```html
<cu-select id="selector"></cu-select>

<script>
  const sel = document.getElementById('selector');
  sel.options = [
    { value: 'op1', label: 'Opción 1' },
    { value: 'op2', label: 'Opción 2' },
  ];

  sel.addEventListener('select', (e) => {
    console.log('Seleccionado:', e.detail); // { value, label }
  });

  sel.addEventListener('update:modelValue', (e) => {
    console.log('Valor:', e.detail); // string
  });

  sel.addEventListener('change', (e) => {
    console.log('Cambió a:', e.detail); // string
  });
</script>
```

<!-- demo:select-cambios -->

## Control programático

```html
<cu-select id="auto" placeholder="Elegí una letra"></cu-select>

<script>
  const s = document.getElementById('auto');
  s.options = [
    { value: 'a', label: 'A' },
    { value: 'b', label: 'B' },
  ];

  s.set('a');             // seleccionar 'a'
  s.get();                // 'a'
  s.selectedItem();       // { value: 'a', label: 'A' }
  s.reset();              // limpiar
  s.isOpen();             // false
  s.focus();              // foco
</script>
```

<!-- demo:select-control-programatico -->

## Atributos

<!--@include: ../partials/select/props-vanilla.md-->

### Opciones (`options`)

Cada opción del array `options` puede tener:

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `value` | `string` | — | Valor de la opción (lo que se asigna al `modelValue`) |
| `label` | `string` | — | Texto visible |
| `disabled` | `boolean` | `false` | Opción deshabilitada (no clickeable, atenuada) |
| `color` | `string` | hereda del padre | Color semántico individual |
| `variant` | `string` | hereda del padre | Variante individual |

> **Importante:** `options` se asigna como propiedad JS (`select.options = [...]`), no como atributo HTML.

## Eventos

<!--@include: ../partials/select/eventos-vanilla.md-->

## Slots

<!--@include: ../partials/select/slots.md-->

## Métodos expuestos

<!--@include: ../partials/select/metodos-vanilla.md-->

## Interfaces

### `SelectOption`

```ts
interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
  color?: string;
  variant?: string;
}
```
