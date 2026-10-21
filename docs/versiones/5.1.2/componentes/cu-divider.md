[← Volver](../README.md)

# `<cu-divider>`

Separador de una línea, horizontal o vertical, que puede llevar un texto (`label`) o contenido
rico (slot) en el medio: la línea se corta y el contenido queda centrado. Sin label ni slot es una
línea lisa a todo el ancho (horizontal) o a todo el alto (vertical).

## Uso en HTML plano

```html
<script src="dist-libs/umd-core/CuDivider.umd.js"></script>

<cu-divider></cu-divider>
<cu-divider label="Sección"></cu-divider>
```

<!-- demo:divider-uso -->

En Vue, importá `Divider` de `@/components/information/Divider.vue` (ver
[ficha Vue](/componentes/vue/divider)).

## Orientación

`orientation` acepta `horizontal` (**default**) o `vertical`. En horizontal la línea ocupa el
ancho del contenedor; en vertical toma el alto: usalo dentro de una fila (flex/grid) para separar
columnas, y estirá el contenedor (`align-items: stretch` o un alto fijo) para que se vea.

```html
<cu-divider orientation="horizontal"></cu-divider>

<div style="display: flex; align-items: stretch; gap: 12px; height: 96px">
  <span>Izquierda</span>
  <cu-divider orientation="vertical"></cu-divider>
  <span>Derecha</span>
</div>
```

<!-- demo:divider-orientacion -->

## Label y contenido (slot)

`label` es el texto que va **sobre** la línea: se corta en dos tramos y el texto queda centrado.
En el custom element se escribe como atributo; el slot `default` lo reemplaza con contenido rico
(`<strong>`, un ícono, un `<cu-badge>`) y **tiene prioridad** sobre `label`. En vertical el
contenido también se centra, pero la línea se corta arriba y abajo.

```html
<cu-divider label="O sección"></cu-divider>

<cu-divider>
  <cu-badge color="primary" variant="soft">Nuevo</cu-badge>
</cu-divider>
```

<!-- demo:divider-label -->

## Variantes

`variant` es el estilo del trazo: `solid` (**default**), `dashed` y `dotted`.

```html
<cu-divider variant="solid" label="solid"></cu-divider>
<cu-divider variant="dashed" label="dashed"></cu-divider>
<cu-divider variant="dotted" label="dotted"></cu-divider>
```

<!-- demo:divider-variantes -->

## Colores

`color` es un nombre semántico, no un hex: el trazo sale de `--cu-color-{color}-subtle-border` del
tema activo, así que el mismo nombre se ve distinto en cada tema.

```html
<cu-divider color="primary" label="primary"></cu-divider>
<cu-divider color="secondary" label="secondary"></cu-divider>
<cu-divider color="neutral" label="neutral"></cu-divider>
<cu-divider color="success" label="success"></cu-divider>
<cu-divider color="warning" label="warning"></cu-divider>
<cu-divider color="danger" label="danger"></cu-divider>
```

<!-- demo:divider-colores -->

## Accesibilidad

- Horizontal **sin** label ni slot: es un `<hr>`, el separador nativo (sin `role` declarado).
- Horizontal **con** label o slot: `role="separator"`; las dos líneas son decorativas
  (`aria-hidden="true"`) y el texto del medio es el contenido real.
- Vertical: `role="separator"` + `aria-orientation="vertical"`.

## Atributos

<!--@include: ../partials/divider/props.md-->

## Eventos

<!--@include: ../partials/divider/eventos.md-->

## Slots

<!--@include: ../partials/divider/slots.md-->

## Métodos expuestos

<!--@include: ../partials/divider/metodos.md-->
