---
title: Popover
group: Overlay
---

<script setup lang="ts">
import PopoverBasicExample from "../../examples/popover/PopoverBasicExample.vue";
import PopoverPositionsExample from "../../examples/popover/PopoverPositionsExample.vue";
import PopoverHoverExample from "../../examples/popover/PopoverHoverExample.vue";
import PopoverEventsExample from "../../examples/popover/PopoverEventsExample.vue";
import PopoverImperativeExample from "../../examples/popover/PopoverImperativeExample.vue";
import PopoverSlotsExample from "../../examples/popover/PopoverSlotsExample.vue";
import PopoverPanelExample from "../../examples/popover/PopoverPanelExample.vue";
import PopoverFixedExample from "../../examples/popover/PopoverFixedExample.vue";
</script>

<!--@include: ../../../componentes/vue/popover.md-->

## Demos en vivo

### Básico

<ClientOnly>
  <div class="cu-demo">
    <PopoverBasicExample />
  </div>
</ClientOnly>

### Posiciones (position, align, offset)

<ClientOnly>
  <div class="cu-demo">
    <PopoverPositionsExample />
  </div>
</ClientOnly>

### Hover (hover, hoverDelay)

<ClientOnly>
  <div class="cu-demo">
    <PopoverHoverExample />
  </div>
</ClientOnly>

### Eventos (`open`, `close`)

<ClientOnly>
  <div class="cu-demo cu-demo--stack">
    <PopoverEventsExample />
  </div>
</ClientOnly>

### API imperativa (`open`, `close`, `toggle`, `isOpen`)

<ClientOnly>
  <div class="cu-demo cu-demo--stack">
    <PopoverImperativeExample />
  </div>
</ClientOnly>

### Slots (`toggle`, `default`)

<ClientOnly>
  <div class="cu-demo">
    <PopoverSlotsExample />
  </div>
</ClientOnly>

### Fixed (position: fixed)

<ClientOnly>
  <div class="cu-demo">
    <PopoverFixedExample />
  </div>
</ClientOnly>

### Panel (role, panelWidth, panelClass)

<ClientOnly>
  <div class="cu-demo">
    <PopoverPanelExample />
  </div>
</ClientOnly>
