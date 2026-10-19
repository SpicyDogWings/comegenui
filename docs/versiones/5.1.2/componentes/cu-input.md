[← Volver](../README.md)

# `<cu-input>`

Input de texto con color semántico, variante, tamaño, los tipos de input HTML5 y métodos
`get`/`set`/`reset`/`focus`. En el custom element el valor se sincroniza por `model-value`
y cada cambio avisa por el evento `update:modelValue`.

## Uso en HTML plano

```html
<script src="dist-libs/umd-core/CuInput.umd.js"></script>

<cu-input placeholder="Nombre" color="primary" variant="outlined"></cu-input>
<cu-input id="email" type="email" placeholder="correo@ejemplo.com" variant="soft"></cu-input>
<cu-input type="number" disabled model-value="42"></cu-input>

<script>
  const email = document.getElementById('email');
  email.set('usuario@dominio.com');
  console.log(email.get());
  email.focus();
</script>
```

<!-- demo:input-uso -->

En Vue, importá `Input` de `@/components/form/Input.vue` (ver [ficha Vue](/componentes/vue/input)).

## Colores

`color` es un nombre semántico, no un hex: se resuelve con los tokens del tema activo
(`--cu-color-{color}*`), así que el mismo nombre se ve distinto en cada tema.

```html
<cu-input color="primary" placeholder="primary"></cu-input>
<cu-input color="secondary" placeholder="secondary"></cu-input>
<cu-input color="neutral" placeholder="neutral"></cu-input>
<cu-input color="success" placeholder="success"></cu-input>
<cu-input color="warning" placeholder="warning"></cu-input>
<cu-input color="danger" placeholder="danger"></cu-input>
```

<!-- demo:input-colores -->

## Variantes

`variant` decide el fondo y el borde: `outlined` (borde), `soft` (fondo tenue, **default**),
`ghost` (transparente) y `subtle` (tenue con borde).

```html
<cu-input color="primary" variant="outlined" placeholder="outlined"></cu-input>
<cu-input color="primary" variant="soft" placeholder="soft (default)"></cu-input>
<cu-input color="primary" variant="ghost" placeholder="ghost"></cu-input>
<cu-input color="primary" variant="subtle" placeholder="subtle"></cu-input>
```

<!-- demo:input-variantes -->

## Tamaños

`size` acepta `sm`, `md` (**default**) y `lg`, y cambia el padding y el tamaño de fuente.

```html
<cu-input size="sm" placeholder="sm"></cu-input>
<cu-input size="md" placeholder="md (default)"></cu-input>
<cu-input size="lg" placeholder="lg"></cu-input>
```

<!-- demo:input-tamanos -->

## Tipos

`type` es el `type` del `<input>` interno: los siete tipos HTML5 que acepta el validador.

```html
<cu-input type="text" placeholder="Texto"></cu-input>
<cu-input type="password" placeholder="Contraseña"></cu-input>
<cu-input type="email" placeholder="correo@ejemplo.com"></cu-input>
<cu-input type="number" placeholder="0"></cu-input>
<cu-input type="tel" placeholder="+54 11 1234-5678"></cu-input>
<cu-input type="url" placeholder="https://..."></cu-input>
<cu-input type="search" placeholder="Buscar..."></cu-input>
```

<!-- demo:input-tipos -->

## Estados

`disabled` bloquea la interacción y atenúa el campo; `readonly` (atributo HTML) deja leer y
seleccionar el texto, pero no editarlo.

```html
<cu-input model-value="deshabilitado" disabled></cu-input>
<cu-input model-value="solo lectura (readonly)" readonly></cu-input>
<cu-input placeholder="habilitado"></cu-input>
```

<!-- demo:input-estados -->

## Valor y cambios

`model-value` fija el valor y `update:modelValue` avisa en cada cambio (con el valor en
`e.detail`); si no lo controlás, el campo se sincroniza solo.

```html
<cu-input id="nombre" placeholder="Tu nombre"></cu-input>

<script>
  document.getElementById('nombre').addEventListener('update:modelValue', (e) => {
    console.log('Valor actual:', e.detail);
  });
</script>
```

<!-- demo:input-cambios -->

## API imperativa

`get()` devuelve el valor, `set(valor)` lo escribe (acepta `string | number`), `reset()` limpia
el campo y `focus()` le da foco.

```html
<cu-input id="campo" placeholder="Valor por API"></cu-input>

<script>
  const campo = document.getElementById('campo');
  campo.set('Valor por API'); // set()
  console.log(campo.get());   // get() → "Valor por API"
  campo.reset();              // reset() → ""
  campo.focus();              // focus()
</script>
```

<!-- demo:input-metodos -->

> `reset()` limpia a `""`: `start-value` está declarada en el componente pero **no se aplica**.
> Para un valor inicial, usá `model-value`.

## Atributos

<!--@include: ../partials/input/props-vanilla.md-->

> **Atributos en HTML:** `readOnly` se escribe como `readonly` (convención HTML). Ej.: `<cu-input readonly>`

## Eventos

<!--@include: ../partials/input/eventos.md-->

> Los eventos nativos del DOM (`input`, `change`, `focus`, `blur`) **burbujean automáticamente** al host desde el Shadow DOM. Podés escucharlos con `addEventListener`, pero no se re-emiten como eventos custom (no hay `input`/`change` propios en el Custom Element).

## Slots

<!--@include: ../partials/input/slots.md-->

## Métodos expuestos

<!--@include: ../partials/input/metodos-vanilla.md-->
