---
title: Loader
group: Información
---

<script setup lang="ts">
import LoaderColorsExample from "../../examples/loader/LoaderColorsExample.vue";
import LoaderAnimationsExample from "../../examples/loader/LoaderAnimationsExample.vue";
</script>

<!--@include: ../../../componentes/vue/loader.md-->

## Demos en vivo

### Colores

Barra de carga con los seis colores semánticos. El componente es
`position: absolute`, así que el contenedor del demo es `position: relative`.

<ClientOnly>
  <div class="cu-demo cu-demo--stack">
    <LoaderColorsExample />
  </div>
</ClientOnly>

### Animaciones

`loading` es un barrido infinito; `cooldown` se consume una vez en `delay` ms.

<ClientOnly>
  <div class="cu-demo cu-demo--stack">
    <LoaderAnimationsExample />
  </div>
</ClientOnly>
