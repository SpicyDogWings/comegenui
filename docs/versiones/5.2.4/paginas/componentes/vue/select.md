---
title: Select
group: Formularios
---

<script setup lang="ts">
import SelectBasicExample from "../../examples/select/SelectBasicExample.vue";
import SelectSearchExample from "../../examples/select/SelectSearchExample.vue";
import SelectAppearanceExample from "../../examples/select/SelectAppearanceExample.vue";
import SelectPositionExample from "../../examples/select/SelectPositionExample.vue";
import SelectStatesExample from "../../examples/select/SelectStatesExample.vue";
import SelectImperativeExample from "../../examples/select/SelectImperativeExample.vue";
</script>

<!--@include: ../../../componentes/vue/select.md-->

## Demos en vivo

### Básico (v-model, options) y eventos

<ClientOnly>
  <div class="cu-demo cu-demo--stack">
    <SelectBasicExample />
  </div>
</ClientOnly>

### Búsqueda, carga y cooldown

<ClientOnly>
  <div class="cu-demo cu-demo--stack">
    <SelectSearchExample />
  </div>
</ClientOnly>

### Apariencia (color, variant, textAlign, placeholderWrap)

<ClientOnly>
  <div class="cu-demo cu-demo--stack">
    <SelectAppearanceExample />
  </div>
</ClientOnly>

### Posición del panel (position, align, fixed)

<ClientOnly>
  <div class="cu-demo cu-demo--stack">
    <SelectPositionExample />
  </div>
</ClientOnly>

### Estado disabled y evento blur

<ClientOnly>
  <div class="cu-demo cu-demo--stack">
    <SelectStatesExample />
  </div>
</ClientOnly>

### API imperativa (ref + métodos)

<ClientOnly>
  <div class="cu-demo cu-demo--stack">
    <SelectImperativeExample />
  </div>
</ClientOnly>
