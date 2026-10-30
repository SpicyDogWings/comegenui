---
title: Blockquote
group: Markdown
---

<script setup lang="ts">
import BlockquoteColorsExample from "../../examples/blockquote/BlockquoteColorsExample.vue";
import BlockquoteHtmlExample from "../../examples/blockquote/BlockquoteHtmlExample.vue";
</script>

<!--@include: ../../../componentes/vue/blockquote.md-->

## Demos en vivo

### Colores

El borde izquierdo usa el color semántico de `color`.

<ClientOnly>
  <div class="cu-demo cu-demo--stack">
    <BlockquoteColorsExample />
  </div>
</ClientOnly>

### `html` vs slot

`html` renderiza el string tal cual y tiene prioridad; sin `html` se usa el
slot `default`.

<ClientOnly>
  <div class="cu-demo cu-demo--stack">
    <BlockquoteHtmlExample />
  </div>
</ClientOnly>
