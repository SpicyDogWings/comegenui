---
title: Switch
group: Formularios
---

<script setup lang="ts">
import SwitchBasicExample from "../../examples/switch/SwitchBasicExample.vue";
import SwitchColorsExample from "../../examples/switch/SwitchColorsExample.vue";
import SwitchSizesExample from "../../examples/switch/SwitchSizesExample.vue";
import SwitchStatesExample from "../../examples/switch/SwitchStatesExample.vue";
import SwitchSlotsExample from "../../examples/switch/SwitchSlotsExample.vue";
import SwitchImperativeExample from "../../examples/switch/SwitchImperativeExample.vue";
</script>

<!--@include: ../../../componentes/vue/switch.md-->

## Demos en vivo

### Básico (v-model) y evento change

<ClientOnly>
  <div class="cu-demo cu-demo--stack">
    <SwitchBasicExample />
  </div>
</ClientOnly>

### Colores

<ClientOnly>
  <div class="cu-demo">
    <SwitchColorsExample />
  </div>
</ClientOnly>

### Tamaños

<ClientOnly>
  <div class="cu-demo">
    <SwitchSizesExample />
  </div>
</ClientOnly>

### Estados (disabled)

<ClientOnly>
  <div class="cu-demo">
    <SwitchStatesExample />
  </div>
</ClientOnly>

### Slot default (etiqueta con marcado)

<ClientOnly>
  <div class="cu-demo">
    <SwitchSlotsExample />
  </div>
</ClientOnly>

### API imperativa (ref + métodos)

<ClientOnly>
  <div class="cu-demo cu-demo--stack">
    <SwitchImperativeExample />
  </div>
</ClientOnly>
