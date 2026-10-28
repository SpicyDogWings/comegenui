[← Volver](../README.md)

# `Divider`

Separador de una línea, horizontal o vertical, que puede llevar un texto (`label`) o contenido
rico (slot) en el medio: la línea se corta y el contenido queda centrado. Sin label ni slot es una
línea lisa a todo el ancho (horizontal) o a todo el alto (vertical).

## Uso en Vue

```vue
<script setup lang="ts">
import Divider from "@/components/information/Divider.vue";
</script>

<template>
  <Divider />
  <Divider label="Sección" />
</template>
```

En HTML plano, cargá el bundle `CuDivider` (ver [ficha vanilla](/componentes/cu-divider)).

## Orientación

`orientation` acepta `horizontal` (**default**) o `vertical`. En horizontal la línea ocupa el
ancho del contenedor; en vertical toma el alto: usalo dentro de una fila (flex/grid) para separar
columnas, y estirá el contenedor (`align-items: stretch` o un alto fijo) para que se vea.

```vue
<Divider orientation="horizontal" />

<div style="display: flex; align-items: stretch; gap: 12px; height: 96px">
  <span>Izquierda</span>
  <Divider orientation="vertical" />
  <span>Derecha</span>
</div>
```

## Label y contenido (slot)

`label` es el texto que va **sobre** la línea: se corta en dos tramos y el texto queda centrado.
El slot `default` lo reemplaza con contenido rico (`<strong>`, un ícono, un `Badge`) y **tiene
prioridad** sobre `label`. En vertical el contenido también se centra, pero la línea se corta
arriba y abajo.

```vue
<Divider label="O sección" />

<Divider>
  <Badge color="primary" variant="soft">Nuevo</Badge>
</Divider>
```

## Variantes

`variant` es el estilo del trazo: `solid` (**default**), `dashed` y `dotted`.

```vue
<Divider variant="solid" label="solid" />
<Divider variant="dashed" label="dashed" />
<Divider variant="dotted" label="dotted" />
```

## Colores

`color` es un nombre semántico, no un hex: el trazo sale de `--cu-color-{color}-subtle-border` del
tema activo, así que el mismo nombre se ve distinto en cada tema.

```vue
<Divider color="primary" label="primary" />
<Divider color="secondary" label="secondary" />
<Divider color="neutral" label="neutral" />
<Divider color="success" label="success" />
<Divider color="warning" label="warning" />
<Divider color="danger" label="danger" />
```

## Accesibilidad

- Horizontal **sin** label ni slot: es un `<hr>`, el separador nativo (sin `role` declarado).
- Horizontal **con** label o slot: `role="separator"`; las dos líneas son decorativas
  (`aria-hidden="true"`) y el texto del medio es el contenido real.
- Vertical: `role="separator"` + `aria-orientation="vertical"`.

El componente no emite eventos ni expone métodos: el estado es sólo visual.

## Props

<!--@include: ../../partials/divider/props.md-->

## Emits

<!--@include: ../../partials/divider/eventos.md-->

## Slots

<!--@include: ../../partials/divider/slots.md-->

## Expose

<!--@include: ../../partials/divider/metodos.md-->
