[← Volver](../README.md)

# `<cu-tooltip>`

Tooltip que aparece al hacer hover sobre el elemento que contiene, con color, posición, alineación,
offset y delay configurables, y contenido simple o enriquecido por slot.

## Uso en HTML plano

```html
<script src="dist-libs/umd-core/CuTooltip.umd.js"></script>

<cu-tooltip text="Guardar cambios" color="primary">
  <cu-button color="primary" variant="soft">Guardar</cu-button>
</cu-tooltip>
```

<!-- demo:tooltip-uso -->

## Colores

`color` tiñe el fondo del tooltip; el texto se pinta con el color de superficie del tema.

```html
<cu-tooltip text="primary" color="primary"><cu-button variant="outlined">primary</cu-button></cu-tooltip>
<cu-tooltip text="secondary" color="secondary"><cu-button variant="outlined">secondary</cu-button></cu-tooltip>
<cu-tooltip text="neutral" color="neutral"><cu-button variant="outlined">neutral</cu-button></cu-tooltip>
<cu-tooltip text="success" color="success"><cu-button variant="outlined">success</cu-button></cu-tooltip>
<cu-tooltip text="warning" color="warning"><cu-button variant="outlined">warning</cu-button></cu-tooltip>
<cu-tooltip text="danger" color="danger"><cu-button variant="outlined">danger</cu-button></cu-tooltip>
```

<!-- demo:tooltip-colores -->

## Posición

`position` elige el lado (arriba, abajo, izquierda o derecha), `align` la alineación respecto al
elemento y `offset` la separación en px.

```html
<cu-tooltip text="Arriba" position="top" align="center" offset="6">
  <cu-button variant="outlined">top</cu-button>
</cu-tooltip>
<cu-tooltip text="Abajo" position="bottom" align="center">
  <cu-button variant="outlined">bottom</cu-button>
</cu-tooltip>
<cu-tooltip text="Izquierda" position="left" align="start">
  <cu-button variant="outlined">left</cu-button>
</cu-tooltip>
<cu-tooltip text="Derecha" position="right" align="end">
  <cu-button variant="outlined">right</cu-button>
</cu-tooltip>
```

<!-- demo:tooltip-posicion -->

## Contenido enriquecido

Sin `text` (o además de él) podés pasar HTML por el slot `content`, que tiene prioridad.

```html
<cu-tooltip position="right" align="start" delay="300">
  <span>Elemento con tooltip rico</span>
  <span slot="content">
    <strong>Más contexto</strong> con HTML
  </span>
</cu-tooltip>
```

<!-- demo:tooltip-contenido -->

## Delay y deshabilitado

`delay` es el tiempo en ms antes de mostrarlo al hacer hover (default `200`); `disabled` lo apaga.
El tooltip es puramente visual: mostrarse u ocultarse **nunca mueve el foco**.

```html
<cu-tooltip text="Aparece casi al instante" delay="0">
  <cu-button>delay 0</cu-button>
</cu-tooltip>
<cu-tooltip text="Aparece tras 1 segundo" delay="1000">
  <cu-button>delay 1000</cu-button>
</cu-tooltip>
<cu-tooltip text="No deberías verme" disabled>
  <cu-button variant="ghost">disabled</cu-button>
</cu-tooltip>
```

<!-- demo:tooltip-delay-disabled -->

## Atributos

<!--@include: ../partials/tooltip/props-vanilla.md-->

## Eventos

<!--@include: ../partials/tooltip/eventos.md-->

## Slots

<!--@include: ../partials/tooltip/slots.md-->

## Métodos expuestos

<!--@include: ../partials/tooltip/metodos.md-->
