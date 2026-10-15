[← Volver](../README.md)

# `Tooltip`

Tooltip que aparece al hacer hover sobre el elemento que contiene, con color, posición, alineación,
offset y delay configurables, y contenido simple o enriquecido por slot.

## Uso en Vue

```vue
<script setup lang="ts">
import Tooltip from "@/components/overlay/Tooltip.vue";
import Button from "@/components/buttons/Button.vue";
</script>

<template>
  <Tooltip text="Guardar cambios" color="primary">
    <Button color="primary" variant="soft">Guardar</Button>
  </Tooltip>
</template>
```

## Colores

`color` tiñe el fondo del tooltip; el texto se pinta con el color de superficie del tema.

```vue
<Tooltip text="primary" color="primary"><Button variant="outlined">primary</Button></Tooltip>
<Tooltip text="secondary" color="secondary"><Button variant="outlined">secondary</Button></Tooltip>
<Tooltip text="neutral" color="neutral"><Button variant="outlined">neutral</Button></Tooltip>
<Tooltip text="success" color="success"><Button variant="outlined">success</Button></Tooltip>
<Tooltip text="warning" color="warning"><Button variant="outlined">warning</Button></Tooltip>
<Tooltip text="danger" color="danger"><Button variant="outlined">danger</Button></Tooltip>
```

## Posición

`position` elige el lado (arriba, abajo, izquierda o derecha), `align` la alineación respecto al
elemento y `offset` la separación en px.

```vue
<Tooltip text="Arriba" position="top" align="center" :offset="6">
  <Button variant="outlined">top</Button>
</Tooltip>
<Tooltip text="Abajo" position="bottom" align="center">
  <Button variant="outlined">bottom</Button>
</Tooltip>
<Tooltip text="Izquierda" position="left" align="start">
  <Button variant="outlined">left</Button>
</Tooltip>
<Tooltip text="Derecha" position="right" align="end">
  <Button variant="outlined">right</Button>
</Tooltip>
```

## Contenido enriquecido

Sin `text` (o además de él) podés pasar HTML por el slot `content`, que tiene prioridad.

```vue
<Tooltip position="right" align="start" :delay="300">
  <span>Elemento con tooltip rico</span>
  <template #content>
    <strong>Más contexto</strong> con HTML
  </template>
</Tooltip>
```

## Delay y deshabilitado

`delay` es el tiempo en ms antes de mostrarlo al hacer hover (default `200`); `disabled` lo apaga.

```vue
<Tooltip text="Aparece casi al instante" :delay="0">
  <Button>delay 0</Button>
</Tooltip>
<Tooltip text="Aparece tras 1 segundo" :delay="1000">
  <Button>delay 1000</Button>
</Tooltip>
<Tooltip text="No deberías verme" disabled>
  <Button variant="ghost">disabled</Button>
</Tooltip>
```

## Props

<!--@include: ../../partials/tooltip/props-vue.md-->

## Emits

<!--@include: ../../partials/tooltip/eventos.md-->

## Slots

<!--@include: ../../partials/tooltip/slots.md-->

## Expose

<!--@include: ../../partials/tooltip/metodos.md-->
