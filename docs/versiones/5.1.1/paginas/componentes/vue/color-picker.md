---
title: ColorPicker
group: Formularios
---

<script setup lang="ts">
import ColorPickerBasicExample from "../../examples/color-picker/ColorPickerBasicExample.vue";
import ColorPickerColorExample from "../../examples/color-picker/ColorPickerColorExample.vue";
import ColorPickerImperativeExample from "../../examples/color-picker/ColorPickerImperativeExample.vue";
</script>

<!--@include: ../../../componentes/vue/color-picker.md-->

## Demos en vivo

### Básico (v-model) y evento change

<ClientOnly>
  <div class="cu-demo cu-demo--stack">
    <ColorPickerBasicExample />
  </div>
</ClientOnly>

### Color semántico y disabled

<ClientOnly>
  <div class="cu-demo cu-demo--stack">
    <ColorPickerColorExample />
  </div>
</ClientOnly>

### API imperativa (ref + métodos)

<ClientOnly>
  <div class="cu-demo cu-demo--stack">
    <ColorPickerImperativeExample />
  </div>
</ClientOnly>
