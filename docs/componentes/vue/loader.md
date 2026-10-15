[← Volver](../README.md)

# `Loader`

Barra de progreso indeterminada: un barrido infinito (`loading`) o un enfriamiento que se
consume una vez (`cooldown`). Es `position: absolute`, así que el contenedor necesita
`position: relative`.

## Uso en Vue

```vue
<script setup lang="ts">
import Loader from "@/components/information/Loader.vue";
</script>

<template>
  <div style="position: relative; height: 12px">
    <Loader />
  </div>
</template>
```

No es un custom element: no hay ficha vanilla ni bundle propio.

## Colores

`color` es un nombre semántico, no un hex: se resuelve con los tokens del tema activo
(`--cu-color-{color}`).

```vue
<script setup lang="ts">
import Loader from "@/components/information/Loader.vue";

const colors = ["primary", "secondary", "neutral", "success", "warning", "danger"] as const;
</script>

<template>
  <div v-for="color in colors" :key="color" style="position: relative; height: 12px">
    <Loader :color="color" />
  </div>
</template>
```

## Animaciones

`animation` acepta `loading` (barrido infinito, **default**) y `cooldown` (barra que se agota una
vez). `delay` sólo afecta a `cooldown`: son los milisegundos que tarda en vaciarse.

```vue
<script setup lang="ts">
import Loader from "@/components/information/Loader.vue";
</script>

<template>
  <div style="position: relative; height: 12px">
    <Loader animation="loading" color="primary" />
  </div>

  <div style="position: relative; height: 12px">
    <Loader animation="cooldown" :delay="3000" color="success" />
  </div>
</template>
```

> `cooldown` se agota una sola vez: para repetirlo hay que remontar el componente (cambiarle la
> `key`).

## Props

<!--@include: ../../partials/loader/props.md-->

## Emits

<!--@include: ../../partials/loader/eventos.md-->

## Slots

<!--@include: ../../partials/loader/slots.md-->

## Expose

<!--@include: ../../partials/loader/metodos.md-->
