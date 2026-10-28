---
title: Textarea
group: Formularios
---

<script setup lang="ts">
import TextareaBasicExample from "../../examples/textarea/TextareaBasicExample.vue";
import TextareaAppearanceExample from "../../examples/textarea/TextareaAppearanceExample.vue";
import TextareaStatesExample from "../../examples/textarea/TextareaStatesExample.vue";
import TextareaImperativeExample from "../../examples/textarea/TextareaImperativeExample.vue";
</script>

<!--@include: ../../../componentes/vue/textarea.md-->

## Demos en vivo

### Básico (v-model, rows, no-resize) y evento update:modelValue

<ClientOnly>
  <div class="cu-demo cu-demo--stack">
    <TextareaBasicExample />
  </div>
</ClientOnly>

### Apariencia (color y variante)

<ClientOnly>
  <div class="cu-demo cu-demo--stack">
    <TextareaAppearanceExample />
  </div>
</ClientOnly>

### Estados (disabled y readOnly)

<ClientOnly>
  <div class="cu-demo cu-demo--stack">
    <TextareaStatesExample />
  </div>
</ClientOnly>

### API imperativa (ref + métodos)

<ClientOnly>
  <div class="cu-demo cu-demo--stack">
    <TextareaImperativeExample />
  </div>
</ClientOnly>
