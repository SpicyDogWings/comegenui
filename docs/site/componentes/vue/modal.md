---
title: Modal
group: Overlay
---

<script setup lang="ts">
import ModalBasicExample from "../../examples/modal/ModalBasicExample.vue";
import ModalSizesExample from "../../examples/modal/ModalSizesExample.vue";
import ModalColorsExample from "../../examples/modal/ModalColorsExample.vue";
import ModalPersistentExample from "../../examples/modal/ModalPersistentExample.vue";
import ModalEventsExample from "../../examples/modal/ModalEventsExample.vue";
import ModalImperativeExample from "../../examples/modal/ModalImperativeExample.vue";
import ModalSlotsExample from "../../examples/modal/ModalSlotsExample.vue";
</script>

<!--@include: ../../../componentes/vue/modal.md-->

## Demos en vivo

### Básico

<ClientOnly>
  <div class="cu-demo">
    <ModalBasicExample />
  </div>
</ClientOnly>

### Tamaños (size, height)

<ClientOnly>
  <div class="cu-demo">
    <ModalSizesExample />
  </div>
</ClientOnly>

### Colores

<ClientOnly>
  <div class="cu-demo">
    <ModalColorsExample />
  </div>
</ClientOnly>

### Persistente

<ClientOnly>
  <div class="cu-demo">
    <ModalPersistentExample />
  </div>
</ClientOnly>

### Eventos (`opened`, `close`, `closed`, `accept`, `cancel`)

<ClientOnly>
  <div class="cu-demo cu-demo--stack">
    <ModalEventsExample />
  </div>
</ClientOnly>

### API imperativa (`open`, `close`, `toggle`, `isOpen`)

<ClientOnly>
  <div class="cu-demo cu-demo--stack">
    <ModalImperativeExample />
  </div>
</ClientOnly>

### Slots (`icon`, `default`, `footer`)

<ClientOnly>
  <div class="cu-demo">
    <ModalSlotsExample />
  </div>
</ClientOnly>
