---
title: Autocomplete
group: Formularios
---

<script setup lang="ts">
import AutocompleteBasicExample from "../../examples/autocomplete/AutocompleteBasicExample.vue";
import AutocompleteAppearanceExample from "../../examples/autocomplete/AutocompleteAppearanceExample.vue";
import AutocompleteStatesExample from "../../examples/autocomplete/AutocompleteStatesExample.vue";
import AutocompletePositionExample from "../../examples/autocomplete/AutocompletePositionExample.vue";
import AutocompleteTextAlignExample from "../../examples/autocomplete/AutocompleteTextAlignExample.vue";
import AutocompleteImperativeExample from "../../examples/autocomplete/AutocompleteImperativeExample.vue";
import AutocompleteLoadingExample from "../../examples/autocomplete/AutocompleteLoadingExample.vue";
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

### Carga (`loading`)

Simula una búsqueda: el panel se abre con el spinner y, a los 2 segundos, aparecen los items.

<ClientOnly>
  <div class="cu-demo cu-demo--stack">
    <AutocompleteLoadingExample />
  </div>
</ClientOnly>

### Posición del panel (position, align, fixed)

<ClientOnly>
  <div class="cu-demo cu-demo--stack">
    <AutocompletePositionExample />
  </div>
</ClientOnly>

### Alineación del texto (`textAlign`: left, center, right)

Enfocá o escribí en cada campo: se alinean el texto del input y los items del panel.

<ClientOnly>
  <div class="cu-demo cu-demo--stack">
    <AutocompleteTextAlignExample />
  </div>
</ClientOnly>

### API imperativa (ref + métodos)

<ClientOnly>
  <div class="cu-demo cu-demo--stack">
    <AutocompleteImperativeExample />
  </div>
</ClientOnly>
