---
title: FileInput
group: Formularios
---

<script setup lang="ts">
import FileInputBasicExample from "../../examples/file-input/FileInputBasicExample.vue";
import FileInputAppearanceExample from "../../examples/file-input/FileInputAppearanceExample.vue";
import FileInputStatesExample from "../../examples/file-input/FileInputStatesExample.vue";
import FileInputMaxSizeExample from "../../examples/file-input/FileInputMaxSizeExample.vue";
import FileInputImperativeExample from "../../examples/file-input/FileInputImperativeExample.vue";
</script>

<!--@include: ../../../componentes/vue/file-input.md-->

## Demos en vivo

### Básico (v-model, accept) y evento update:modelValue

<ClientOnly>
  <div class="cu-demo cu-demo--stack">
    <FileInputBasicExample />
  </div>
</ClientOnly>

### Apariencia (color y variante)

<ClientOnly>
  <div class="cu-demo cu-demo--stack">
    <FileInputAppearanceExample />
  </div>
</ClientOnly>

### Estados (disabled y readOnly)

<ClientOnly>
  <div class="cu-demo cu-demo--stack">
    <FileInputStatesExample />
  </div>
</ClientOnly>

### Límite de tamaño (maxSize)

<ClientOnly>
  <div class="cu-demo cu-demo--stack">
    <FileInputMaxSizeExample />
  </div>
</ClientOnly>

### API imperativa (ref + métodos)

<ClientOnly>
  <div class="cu-demo cu-demo--stack">
    <FileInputImperativeExample />
  </div>
</ClientOnly>
