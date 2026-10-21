---
title: Label
group: Formularios
---

<script setup lang="ts">
import LabelBasicExample from "../../examples/label/LabelBasicExample.vue";
import LabelColorExample from "../../examples/label/LabelColorExample.vue";
import LabelForExample from "../../examples/label/LabelForExample.vue";
import LabelControlsExample from "../../examples/label/LabelControlsExample.vue";
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

### Contenido (slot): Checkbox y Switch

Al hacer click en el label, el control del slot recibe el foco (el `input` interno del
`Checkbox`/`Switch`), sin activarlo: el toggle lo hace el control al clickearse.

<ClientOnly>
  <div class="cu-demo cu-demo--stack">
    <LabelControlsExample />
  </div>
</ClientOnly>
