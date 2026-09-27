---
title: Tooltip
group: Overlay
---

<script setup lang="ts">
import TooltipBasicExample from "../../examples/tooltip/TooltipBasicExample.vue";
import TooltipPositionsExample from "../../examples/tooltip/TooltipPositionsExample.vue";
import TooltipColorsExample from "../../examples/tooltip/TooltipColorsExample.vue";
import TooltipContentSlotExample from "../../examples/tooltip/TooltipContentSlotExample.vue";
import TooltipDelayDisabledExample from "../../examples/tooltip/TooltipDelayDisabledExample.vue";
</script>

<!--@include: ../../../componentes/vue/tooltip.md-->

## Demos en vivo

### Básico (text)

<ClientOnly>
  <div class="cu-demo">
    <TooltipBasicExample />
  </div>
</ClientOnly>

### Posiciones (position, align, offset)

<ClientOnly>
  <div class="cu-demo">
    <TooltipPositionsExample />
  </div>
</ClientOnly>

### Colores

<ClientOnly>
  <div class="cu-demo">
    <TooltipColorsExample />
  </div>
</ClientOnly>

### Slots (`default`, `content`)

<ClientOnly>
  <div class="cu-demo">
    <TooltipContentSlotExample />
  </div>
</ClientOnly>

### Delay y deshabilitado (delay, disabled)

<ClientOnly>
  <div class="cu-demo">
    <TooltipDelayDisabledExample />
  </div>
</ClientOnly>
