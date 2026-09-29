---
title: Checkbox
group: Formularios
---

<script setup lang="ts">
import CheckboxBasicExample from "../../examples/checkbox/CheckboxBasicExample.vue";
import CheckboxColorsExample from "../../examples/checkbox/CheckboxColorsExample.vue";
import CheckboxSizesExample from "../../examples/checkbox/CheckboxSizesExample.vue";
import CheckboxStatesExample from "../../examples/checkbox/CheckboxStatesExample.vue";
import CheckboxImperativeExample from "../../examples/checkbox/CheckboxImperativeExample.vue";
</script>

<!--@include: ../../../componentes/vue/checkbox.md-->

## Demos en vivo

### Básico (v-model) y evento change

<ClientOnly>
  <div class="cu-demo cu-demo--stack">
    <CheckboxBasicExample />
  </div>
</ClientOnly>

### Colores

<ClientOnly>
  <div class="cu-demo">
    <CheckboxColorsExample />
  </div>
</ClientOnly>

### Tamaños

<ClientOnly>
  <div class="cu-demo">
    <CheckboxSizesExample />
  </div>
</ClientOnly>

### Estados (disabled)

<ClientOnly>
  <div class="cu-demo">
    <CheckboxStatesExample />
  </div>
</ClientOnly>

### API imperativa (ref + métodos)

<ClientOnly>
  <div class="cu-demo cu-demo--stack">
    <CheckboxImperativeExample />
  </div>
</ClientOnly>
