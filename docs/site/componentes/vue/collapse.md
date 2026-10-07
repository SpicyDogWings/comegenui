---
title: Collapse
group: Overlay
---

<script setup lang="ts">
import CollapseBasicExample from "../../examples/collapse/CollapseBasicExample.vue";
import CollapseColorsExample from "../../examples/collapse/CollapseColorsExample.vue";
import CollapseDisabledExample from "../../examples/collapse/CollapseDisabledExample.vue";
import CollapseIconExample from "../../examples/collapse/CollapseIconExample.vue";
import CollapseEventsExample from "../../examples/collapse/CollapseEventsExample.vue";
import CollapseImperativeExample from "../../examples/collapse/CollapseImperativeExample.vue";
import CollapseNestedExample from "../../examples/collapse/CollapseNestedExample.vue";
</script>

<!--@include: ../../../componentes/vue/collapse.md-->

## Demos en vivo

### Básico (label, defaultOpen)

<ClientOnly>
  <div class="cu-demo cu-demo--stack">
    <CollapseBasicExample />
  </div>
</ClientOnly>

### Colores

<ClientOnly>
  <div class="cu-demo cu-demo--stack">
    <CollapseColorsExample />
  </div>
</ClientOnly>

### Deshabilitado (trigger inerte, `open()`/`toggle()` no-op)

<ClientOnly>
  <div class="cu-demo cu-demo--stack">
    <CollapseDisabledExample />
  </div>
</ClientOnly>

### Icono (icon)

<ClientOnly>
  <div class="cu-demo cu-demo--stack">
    <CollapseIconExample />
  </div>
</ClientOnly>

### Eventos (`toggle`)

<ClientOnly>
  <div class="cu-demo cu-demo--stack">
    <CollapseEventsExample />
  </div>
</ClientOnly>

### API imperativa (`open`, `close`, `toggle`, `isOpen`)

<ClientOnly>
  <div class="cu-demo cu-demo--stack">
    <CollapseImperativeExample />
  </div>
</ClientOnly>

### Slots (contenido anidado)

<ClientOnly>
  <div class="cu-demo cu-demo--stack">
    <CollapseNestedExample />
  </div>
</ClientOnly>
