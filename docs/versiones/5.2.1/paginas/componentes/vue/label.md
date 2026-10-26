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

Al hacer click en el label, el control del slot **se enfoca y se activa** (el `input` interno del
`Checkbox`/`Switch` cambia de estado una sola vez), igual que un `<label>` nativo. No hace falta
`for`.

<ClientOnly>
  <div class="cu-demo cu-demo--stack">
    <LabelControlsExample />
  </div>
</ClientOnly>
