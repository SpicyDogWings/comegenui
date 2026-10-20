[← Volver](../README.md)

# `<cu-number-input>`

Input numérico con botones − / +, paso configurable, límites `min`/`max` y los métodos
`get`/`set`/`reset`/`focus`/`increment`/`decrement`. Hereda el campo de `<cu-input>` (color,
variante, tamaño, estados) y usa los mismos botones que `<cu-button>`.

`null` es el campo vacío: el valor es un número o `null`, nunca `""`.

## Uso en HTML plano

```html
<script src="dist-libs/umd-core/CuNumberInput.umd.js"></script>

<cu-number-input placeholder="Cantidad" color="primary" variant="outlined"></cu-number-input>
<cu-number-input id="cantidad" min="1" max="10" step="2" show-step-select></cu-number-input>

<script>
  const cantidad = document.getElementById('cantidad');
  cantidad.steps = [1, 2, 5]; // el select de paso (propiedad JS)
  cantidad.set(4);            // set() → 4
  cantidad.increment();       // +2 → 6
  console.log(cantidad.get()); // 6
</script>
```

<!-- demo:number-input-uso -->

En Vue, importá `NumberInput` de `@/components/form/NumberInput.vue` (ver [ficha Vue](/componentes/vue/number-input)).

## Colores

`color` es un nombre semántico, no un hex: se resuelve con los tokens del tema activo
(`--cu-color-{color}*`), así que el mismo nombre se ve distinto en cada tema. Pinta el campo,
los botones y el select de paso.

```html
<cu-number-input color="primary" placeholder="primary"></cu-number-input>
<cu-number-input color="secondary" placeholder="secondary"></cu-number-input>
<cu-number-input color="neutral" placeholder="neutral"></cu-number-input>
<cu-number-input color="success" placeholder="success"></cu-number-input>
<cu-number-input color="warning" placeholder="warning"></cu-number-input>
<cu-number-input color="danger" placeholder="danger"></cu-number-input>
```

<!-- demo:number-input-colores -->

## Variantes

`variant` decide el fondo y el borde del campo: `outlined` (borde), `soft` (fondo tenue,
**default**), `ghost` (transparente) y `subtle` (tenue con borde).

```html
<cu-number-input color="primary" variant="outlined" placeholder="outlined"></cu-number-input>
<cu-number-input color="primary" variant="soft" placeholder="soft (default)"></cu-number-input>
<cu-number-input color="primary" variant="ghost" placeholder="ghost"></cu-number-input>
<cu-number-input color="primary" variant="subtle" placeholder="subtle"></cu-number-input>
```

<!-- demo:number-input-variantes -->

## Tamaños

`size` acepta `sm`, `md` (**default**) y `lg`; el tamaño se aplica al campo, a los botones y al
select de paso, así que el control queda parejo.

```html
<cu-number-input size="sm" placeholder="sm"></cu-number-input>
<cu-number-input size="md" placeholder="md (default)"></cu-number-input>
<cu-number-input size="lg" placeholder="lg"></cu-number-input>
```

<!-- demo:number-input-tamanos -->

## Estados

`disabled` apaga el campo, los botones y el select de paso; `readonly` deja leer y seleccionar el
texto, pero no editarlo ni cambiar el valor (los botones y las flechas tampoco responden).

```html
<cu-number-input model-value="3" disabled></cu-number-input>
<cu-number-input model-value="3" read-only></cu-number-input>
<cu-number-input placeholder="habilitado"></cu-number-input>
```

<!-- demo:number-input-estados -->

## Controles (− / +)

`show-controls` (**default** `true`) muestra los botones a los costados del campo; con la
propiedad `showControls` en `false` el campo queda solo y el valor se cambia tipeando o por API.

```html
<cu-number-input placeholder="con controles"></cu-number-input>
<cu-number-input id="sin-controles" placeholder="sin controles"></cu-number-input>

<script>
  document.getElementById('sin-controles').showControls = false;
</script>
```

<!-- demo:number-input-controles -->

## Paso

`step` (**default** `1`) es lo que suman y restan los botones y las flechas del teclado. Con
`show-step-select` aparece un select para elegirlo en caliente, con las opciones de `steps`
(**default** `[1, 5, 10]`); `step` siempre es la primera opción, aunque no esté en la lista.
Cambiar el paso **no** cambia el valor.

```html
<cu-number-input step="1" placeholder="paso 1"></cu-number-input>
<cu-number-input step="5" placeholder="paso 5"></cu-number-input>
<cu-number-input step="10" show-step-select placeholder="paso 10 + select"></cu-number-input>
<cu-number-input id="pasos" show-step-select placeholder="steps custom"></cu-number-input>

<script>
  document.getElementById('pasos').steps = [2, 4, 8];
</script>
```

<!-- demo:number-input-pasos -->

> `steps` es un array: en HTML plano se asigna como **propiedad JS** (`el.steps = [...]`), no
> como atributo.

## Límites (min / max)

`min` y `max` son inclusive y se respetan en todos los caminos: al tipear (el campo muestra el
límite, no el número tipeado), al setear por API y al incrementar o decrementar. En el límite el
botón correspondiente queda deshabilitado y no emite eventos, así que el valor nunca se sale del
rango.

```html
<cu-number-input min="0" max="10" placeholder="0 a 10"></cu-number-input>
<cu-number-input min="1" max="5" step="1" placeholder="1 a 5"></cu-number-input>
<cu-number-input min="0" max="100" step="10" show-step-select placeholder="0 a 100, paso 10"></cu-number-input>
```

<!-- demo:number-input-limites -->

> Con el campo vacío los botones parten de `min` (o de `0` si no hay `min`): `+` da
> `min + step` y `−` da `min`.

## Teclado

Con el campo enfocado, `↑` incrementa y `↓` decrementa con el paso activo (el del select si
está visible). `Enter` confirma el valor tipeado. Con `disabled` o `readonly` las flechas no
hacen nada.

```html
<cu-number-input placeholder="Enfocá y usá ↑ / ↓"></cu-number-input>
<cu-number-input step="5" placeholder="↑ / ↓ de a 5"></cu-number-input>
```

<!-- demo:number-input-teclado -->

## Valor, eventos y confirmación

`model-value` fija el valor (`null` = vacío) y `update:modelValue` avisa en cada cambio, con el
número en `e.detail`. `change` llega con el **valor final** al confirmar (Enter o blur), al usar
los botones y con `set()`/`reset()`; tipear no lo dispara. `increment` y `decrement` traen el
valor nuevo.

```html
<cu-number-input id="eventos" min="0" max="10" show-step-select></cu-number-input>

<script>
  const campo = document.getElementById('eventos');
  for (const name of ['update:modelValue', 'change', 'increment', 'decrement']) {
    campo.addEventListener(name, (e) => console.log(name, e.detail));
  }
</script>
```

<!-- demo:number-input-cambios -->

> El `<input>` interno también burbujea sus eventos nativos (`input`, `focus`, `blur`); el
> `change` nativo se detiene para no pisar el `change` del componente, que es el que lleva el
> valor en `e.detail`.

## API imperativa

`get()` devuelve el número (o `null`), `set(valor)` lo escribe (clampeado), `reset()` vacía el
campo, `focus()` enfoca el input y `increment()`/`decrement()` aplican el paso activo.

```html
<cu-number-input id="api" min="0" max="10"></cu-number-input>

<script>
  const campo = document.getElementById('api');
  campo.set(4);         // 4
  campo.increment();    // 5
  campo.decrement();    // 4
  console.log(campo.get()); // 4
  campo.reset();        // null
  campo.focus();
</script>
```

<!-- demo:number-input-metodos -->

> Los botones se deshabilitan en los límites; llamar `increment()`/`decrement()` ahí no cambia
> el valor ni emite eventos.

## Atributos

<!--@include: ../partials/number-input/props-vanilla.md-->

> **Atributos en HTML:** `readOnly` se escribe `read-only` y `showStepSelect` se escribe
> `show-step-select` (convención HTML). `steps` es un array y se asigna como propiedad JS.

## Eventos

<!--@include: ../partials/number-input/eventos.md-->

## Slots

<!--@include: ../partials/number-input/slots.md-->

## Métodos expuestos

<!--@include: ../partials/number-input/metodos.md-->
