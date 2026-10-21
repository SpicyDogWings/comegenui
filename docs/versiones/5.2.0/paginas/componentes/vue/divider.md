---
title: Divider
group: Información
---

<script setup lang="ts">
import DividerBasicExample from "../../examples/divider/DividerBasicExample.vue";
import DividerOrientationExample from "../../examples/divider/DividerOrientationExample.vue";
import DividerContentExample from "../../examples/divider/DividerContentExample.vue";
import DividerVariantsExample from "../../examples/divider/DividerVariantsExample.vue";
import DividerColorsExample from "../../examples/divider/DividerColorsExample.vue";
</script>

<!--@include: ../../../componentes/vue/divider.md-->

## Demos en vivo

### Básico (`label` y línea lisa)

<ClientOnly>
  <div class="cu-demo cu-demo--stack">
    <DividerBasicExample />
  </div>
</ClientOnly>

### Orientación (horizontal y vertical en una fila)

<ClientOnly>
  <div class="cu-demo cu-demo--stack">
    <DividerOrientationExample />
  </div>
</ClientOnly>

### Label y contenido (slot) con prioridad sobre `label`

<ClientOnly>
  <div class="cu-demo cu-demo--stack">
    <DividerContentExample />
  </div>
</ClientOnly>

### Variantes (`solid`, `dashed`, `dotted`)

<ClientOnly>
  <div class="cu-demo cu-demo--stack">
    <DividerVariantsExample />
  </div>
</ClientOnly>

### Colores (los seis nombres semánticos)

<ClientOnly>
  <div class="cu-demo cu-demo--stack">
    <DividerColorsExample />
  </div>
</ClientOnly>
