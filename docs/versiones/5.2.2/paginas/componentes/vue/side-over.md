---
title: SideOver
group: Overlay
---

<script setup lang="ts">
import SideOverBasicExample from "../../examples/side-over/SideOverBasicExample.vue";
import SideOverSizesExample from "../../examples/side-over/SideOverSizesExample.vue";
import SideOverPositionsExample from "../../examples/side-over/SideOverPositionsExample.vue";
import SideOverFullscreenExample from "../../examples/side-over/SideOverFullscreenExample.vue";
import SideOverPersistentExample from "../../examples/side-over/SideOverPersistentExample.vue";
import SideOverEventsExample from "../../examples/side-over/SideOverEventsExample.vue";
import SideOverZIndexExample from "../../examples/side-over/SideOverZIndexExample.vue";
</script>

<!--@include: ../../../componentes/vue/side-over.md-->

## Demos en vivo

### Básico (v-model)

<ClientOnly>
  <div class="cu-demo">
    <SideOverBasicExample />
  </div>
</ClientOnly>

### Tamaños (size)

<ClientOnly>
  <div class="cu-demo">
    <SideOverSizesExample />
  </div>
</ClientOnly>

### Posiciones (position)

<ClientOnly>
  <div class="cu-demo">
    <SideOverPositionsExample />
  </div>
</ClientOnly>

### Fullscreen

<ClientOnly>
  <div class="cu-demo">
    <SideOverFullscreenExample />
  </div>
</ClientOnly>

### Persistente

<ClientOnly>
  <div class="cu-demo">
    <SideOverPersistentExample />
  </div>
</ClientOnly>

### zIndex

<ClientOnly>
  <div class="cu-demo">
    <SideOverZIndexExample />
  </div>
</ClientOnly>

### Eventos (`update:modelValue`, `close`)

<ClientOnly>
  <div class="cu-demo cu-demo--stack">
    <SideOverEventsExample />
  </div>
</ClientOnly>
