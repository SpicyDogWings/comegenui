---
title: Autocomplete
group: Formularios
---

<script setup lang="ts">
import AutocompleteBasicExample from "../../examples/autocomplete/AutocompleteBasicExample.vue";
import AutocompleteAppearanceExample from "../../examples/autocomplete/AutocompleteAppearanceExample.vue";
import AutocompleteStatesExample from "../../examples/autocomplete/AutocompleteStatesExample.vue";
import AutocompletePositionExample from "../../examples/autocomplete/AutocompletePositionExample.vue";
import AutocompleteImperativeExample from "../../examples/autocomplete/AutocompleteImperativeExample.vue";
</script>

<!--@include: ../../../componentes/vue/autocomplete.md-->

## Demos en vivo

### Básico (v-model, items) y eventos select/blur

<ClientOnly>
  <div class="cu-demo cu-demo--stack">
    <AutocompleteBasicExample />
  </div>
</ClientOnly>

### Apariencia (color, variant, type)

<ClientOnly>
  <div class="cu-demo cu-demo--stack">
    <AutocompleteAppearanceExample />
  </div>
</ClientOnly>

### Estados (disabled y readOnly)

<ClientOnly>
  <div class="cu-demo cu-demo--stack">
    <AutocompleteStatesExample />
  </div>
</ClientOnly>

### Posición del panel (position, align, fixed)

<ClientOnly>
  <div class="cu-demo cu-demo--stack">
    <AutocompletePositionExample />
  </div>
</ClientOnly>

### API imperativa (ref + métodos)

<ClientOnly>
  <div class="cu-demo cu-demo--stack">
    <AutocompleteImperativeExample />
  </div>
</ClientOnly>
