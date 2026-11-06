---
title: Skeleton
group: Información
---

<script setup lang="ts">
import SkeletonBasicExample from "../../examples/skeleton/SkeletonBasicExample.vue";
import SkeletonAvatarTextExample from "../../examples/skeleton/SkeletonAvatarTextExample.vue";
import SkeletonCardExample from "../../examples/skeleton/SkeletonCardExample.vue";
import SkeletonAnimationsExample from "../../examples/skeleton/SkeletonAnimationsExample.vue";
import SkeletonListExample from "../../examples/skeleton/SkeletonListExample.vue";
import SkeletonColorRadiusExample from "../../examples/skeleton/SkeletonColorRadiusExample.vue";
</script>

<!--@include: ../../../componentes/vue/skeleton.md-->

## Demos en vivo

### Básico (bloque rect)

<ClientOnly>
  <div class="cu-demo cu-demo--stack">
    <SkeletonBasicExample />
  </div>
</ClientOnly>

### Forma (círculo + líneas de texto)

<ClientOnly>
  <div class="cu-demo cu-demo--stack">
    <SkeletonAvatarTextExample />
  </div>
</ClientOnly>

### Card completa (media + título + 3 líneas + acciones)

<ClientOnly>
  <div class="cu-demo cu-demo--stack">
    <SkeletonCardExample />
  </div>
</ClientOnly>

### Animación (`pulse`, `wave`, `none`)

<ClientOnly>
  <div class="cu-demo cu-demo--stack">
    <SkeletonAnimationsExample />
  </div>
</ClientOnly>

### Lista de filas (avatar + líneas + valor)

<ClientOnly>
  <div class="cu-demo cu-demo--stack">
    <SkeletonListExample />
  </div>
</ClientOnly>

### Color y radio (seis colores, cinco radios)

<ClientOnly>
  <div class="cu-demo cu-demo--stack">
    <SkeletonColorRadiusExample />
  </div>
</ClientOnly>
