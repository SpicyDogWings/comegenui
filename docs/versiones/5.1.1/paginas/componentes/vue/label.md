---
title: Label
group: Formularios
---

<script setup lang="ts">
import LabelBasicExample from "../../examples/label/LabelBasicExample.vue";
import LabelColorExample from "../../examples/label/LabelColorExample.vue";
import LabelForExample from "../../examples/label/LabelForExample.vue";
</script>

<!--@include: ../../../componentes/vue/label.md-->

## Demos en vivo

### Básico (prop label + slot default)

<ClientOnly>
  <div class="cu-demo cu-demo--stack">
    <LabelBasicExample />
  </div>
</ClientOnly>

### Color y hightContrast

<ClientOnly>
  <div class="cu-demo cu-demo--stack">
    <LabelColorExample />
  </div>
</ClientOnly>

### `for` y evento click

<ClientOnly>
  <div class="cu-demo cu-demo--stack">
    <LabelForExample />
  </div>
</ClientOnly>
