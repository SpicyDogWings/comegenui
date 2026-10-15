[← Volver](../README.md)

# `<cu-textarea>`

Área de texto multilínea con color, variante, cantidad de filas, redimensionado opcional, estados
(`disabled` / `readonly`) y métodos `get` / `set` / `reset` / `focus` expuestos en el custom element.

## Uso en HTML plano

```html
<script src="dist-libs/umd-core/CuTextarea.umd.js"></script>

<cu-textarea placeholder="Escribe aquí..." rows="5" color="primary" variant="outlined"></cu-textarea>
<cu-textarea no-resize variant="soft" id="comentarios"></cu-textarea>

<script>
  const ta = document.getElementById('comentarios');
  ta.set('Texto predefinido');
  console.log(ta.get());
</script>
```

<!-- demo:textarea-uso -->

## Colores

`color` es un nombre semántico: tiñe el fondo (o el borde, según la variante) con los tokens del tema.

```html
<cu-textarea placeholder="primary" color="primary"></cu-textarea>
<cu-textarea placeholder="secondary" color="secondary"></cu-textarea>
<cu-textarea placeholder="neutral" color="neutral"></cu-textarea>
<cu-textarea placeholder="success" color="success"></cu-textarea>
<cu-textarea placeholder="warning" color="warning"></cu-textarea>
<cu-textarea placeholder="danger" color="danger"></cu-textarea>
```

<!-- demo:textarea-colores -->

## Variantes

`variant` decide el aspecto: `outlined` (transparente con borde), `soft` (fondo tenue y **default**),
`ghost` (transparente) y `subtle` (tenue con borde).

```html
<cu-textarea placeholder="outlined" variant="outlined" color="success"></cu-textarea>
<cu-textarea placeholder="soft" variant="soft" color="primary"></cu-textarea>
<cu-textarea placeholder="ghost" variant="ghost" color="warning"></cu-textarea>
<cu-textarea placeholder="subtle" variant="subtle" color="danger"></cu-textarea>
```

<!-- demo:textarea-variantes -->

## Filas

El atributo `rows` fija cuántas filas visibles tiene el textarea (por defecto `3`).

```html
<cu-textarea placeholder="2 filas" rows="2"></cu-textarea>
<cu-textarea placeholder="3 filas (default)" rows="3"></cu-textarea>
<cu-textarea placeholder="6 filas" rows="6"></cu-textarea>
```

<!-- demo:textarea-filas -->

## Sin redimensionar

`no-resize` saca el handle de redimensionado (por defecto el usuario puede estirarlo en vertical).

```html
<cu-textarea no-resize placeholder="Tamaño fijo" rows="4"></cu-textarea>
```

<!-- demo:textarea-no-resize -->

## Estados

`disabled` bloquea la interacción y atenúa el campo; `read-only` deja seleccionable el contenido pero
no editarlo.

```html
<cu-textarea model-value="Deshabilitado" disabled></cu-textarea>
<cu-textarea model-value="Solo lectura" read-only></cu-textarea>
<cu-textarea placeholder="Habilitado"></cu-textarea>
```

<!-- demo:textarea-estados -->

## Métodos

El elemento expone `get()`, `set(valor)`, `reset()` y `focus()`.

```html
<cu-textarea id="notas" model-value="Plantilla inicial"></cu-textarea>

<button onclick="document.getElementById('notas').focus()">focus()</button>
<button onclick="document.getElementById('notas').reset()">reset()</button>
```

<!-- demo:textarea-reset -->

> `start-value` se acepta como atributo, pero hoy `reset()` **limpia** el campo: no lo restaura.

## Cambios

`update:modelValue` se emite en cada tecleo, con el texto nuevo en `e.detail`.

```html
<cu-textarea id="bio" placeholder="Biografía"></cu-textarea>

<script>
  document.getElementById('bio').addEventListener('update:modelValue', (e) => {
    console.log('Bio:', e.detail);
  });
</script>
```

<!-- demo:textarea-cambios -->

## Atributos

<!--@include: ../partials/textarea/props-vanilla.md-->

> **Atributos en HTML:** `readOnly` → `read-only`, `noResize` → `no-resize`.

## Eventos

<!--@include: ../partials/textarea/eventos.md-->

> Los eventos nativos del DOM (`input`, `change`, `focus`, `blur`) **burbujean automáticamente** al host desde el Shadow DOM. No se re-emiten como eventos custom.

## Slots

<!--@include: ../partials/textarea/slots.md-->

## Métodos expuestos

<!--@include: ../partials/textarea/metodos-vanilla.md-->
