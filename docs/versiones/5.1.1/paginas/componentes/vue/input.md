---
title: Input
group: Formularios
---

<script setup lang="ts">
import InputTypesExample from "../../examples/input/InputTypesExample.vue";
import InputAppearanceExample from "../../examples/input/InputAppearanceExample.vue";
import InputSizesExample from "../../examples/input/InputSizesExample.vue";
import InputStatesExample from "../../examples/input/InputStatesExample.vue";
import InputModelExample from "../../examples/input/InputModelExample.vue";
import InputImperativeExample from "../../examples/input/InputImperativeExample.vue";
</script>

<!--@include: ../../../componentes/vue/input.md-->

## Demos en vivo

### Tipos

<ClientOnly>
  <div class="cu-demo cu-demo--stack">
    <InputTypesExample />
  </div>
</ClientOnly>

### Apariencia (color y variante)

<ClientOnly>
  <div class="cu-demo cu-demo--stack">
    <InputAppearanceExample />
  </div>
</ClientOnly>

### Tamaños

<ClientOnly>
  <div class="cu-demo cu-demo--stack">
    <InputSizesExample />
  </div>
</ClientOnly>

### Estados (disabled y readOnly)

<ClientOnly>
  <div class="cu-demo cu-demo--stack">
    <InputStatesExample />
  </div>
</ClientOnly>

### v-model y evento update:modelValue

<ClientOnly>
  <div class="cu-demo cu-demo--stack">
    <InputModelExample />
  </div>
</ClientOnly>

### API imperativa (ref + métodos)

<ClientOnly>
  <div class="cu-demo cu-demo--stack">
    <InputImperativeExample />
  </div>
</ClientOnly>
