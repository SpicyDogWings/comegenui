---
title: Badge
group: Información
---

<script setup lang="ts">
import BadgeMatrixExample from "../../examples/badge/BadgeMatrixExample.vue";
import BadgeSlotExample from "../../examples/badge/BadgeSlotExample.vue";
import BadgeStatusExample from "../../examples/badge/BadgeStatusExample.vue";
</script>

<!--@include: ../../../componentes/vue/badge.md-->

## Demos en vivo

### Variantes y color

Matriz completa: una fila por variante con los seis colores semánticos.

<ClientOnly>
  <div class="cu-demo cu-demo--stack">
    <BadgeMatrixExample />
  </div>
</ClientOnly>

### Slot default

El único contenido es el slot `default`: texto, íconos SVG o ambos.

<ClientOnly>
  <div class="cu-demo">
    <BadgeSlotExample />
  </div>
</ClientOnly>

### Estados habituales

Combinaciones típicas para status y conteos.

<ClientOnly>
  <div class="cu-demo">
    <BadgeStatusExample />
  </div>
</ClientOnly>
