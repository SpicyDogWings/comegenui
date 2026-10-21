[← Volver](../README.md)

# `<cu-label>`

Label con color semántico. Al hacer clic —en el texto o en el espacio libre del label— enfoca el
primer control del slot o, si se define `for`, el elemento con ese id. Útil para agrupar
`<cu-input>`, `<cu-checkbox>`, etc. y ganar área clickeable. Si el control es un custom element, el
foco entra a su shadow root (el host no es focuseable).

## Uso en HTML plano

```html
<script src="dist-libs/umd-core/CuLabel.umd.js"></script>

<cu-label label="Correo electrónico" color="primary">
  <cu-input type="email" placeholder="correo@ejemplo.com"></cu-input>
</cu-label>
```

<!-- demo:label-declarativo -->

El texto va en el atributo `label` (modo declarativo) y el control, en el slot.

## Colores

`color` pinta el texto con el token del tema activo (`--cu-color-{color}`), así que el mismo
nombre se ve distinto en cada tema.

```html
<cu-label label="primary" color="primary"></cu-label>
<cu-label label="secondary" color="secondary"></cu-label>
<cu-label label="neutral" color="neutral"></cu-label>
<cu-label label="success" color="success"></cu-label>
<cu-label label="warning" color="warning"></cu-label>
<cu-label label="danger" color="danger"></cu-label>
```

<!-- demo:label-colores -->

> `hight-contrast` está declarado en el componente pero hoy **no cambia el render**: no tiene
> sección propia (tampoco hace falta, porque el color ya se lee del tema activo).

## Contenido (slot)

El slot acepta cualquier control: al hacer clic en el label (el texto o el espacio libre), el primer
control del slot recibe el foco, **sin activarlo** (el toggle de un checkbox/switch lo hace el propio
control al clickearse). Como el control puede ser un custom element, el foco va al control real de su
shadow root.

```html
<cu-label label="Acepto los términos">
  <cu-checkbox></cu-checkbox>
</cu-label>

<cu-label label="Suscripción">
  <cu-switch></cu-switch>
</cu-label>
```

<!-- demo:label-controles -->

## Enfocar con `for`

Con `for`, el foco va al elemento que tenga ese id, aunque esté fuera del label. El `<label>` lo
expone además como atributo (asociación nativa, útil para lectores de pantalla).

```html
<cu-label for="miInput" label="Nombre"></cu-label>
<input id="miInput" type="text" />
```

<!-- demo:label-for -->

## Atributos

<!--@include: ../partials/label/props-vanilla.md-->

## Eventos

<!--@include: ../partials/label/eventos-vanilla.md-->

> El `click` del DOM burbujea al host desde el shadow DOM.

## Slots

<!--@include: ../partials/label/slots.md-->

## Métodos expuestos

<!--@include: ../partials/label/metodos.md-->
