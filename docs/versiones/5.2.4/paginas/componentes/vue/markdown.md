---
title: Markdown
group: Markdown
---

<script setup lang="ts">
import MarkdownBasicExample from "../../examples/markdown/MarkdownBasicExample.vue";
import MarkdownParsedExample from "../../examples/markdown/MarkdownParsedExample.vue";
</script>

<!--@include: ../../../componentes/vue/markdown.md-->

## Demos en vivo

### Render

El contenido se pasa como texto dentro del slot `default` y se parsea al
montarse (títulos, listas, tablas, citas y bloques de código).

<ClientOnly>
  <div class="cu-demo cu-demo--stack">
    <MarkdownBasicExample />
  </div>
</ClientOnly>

### Evento `parsed` y `headingIds()`

`parsed` emite los ids de los encabezados y `headingIds()` los devuelve vía
`ref`. El contenido se parsea una sola vez, al montar: para actualizarlo hay que
remontar el componente.

<ClientOnly>
  <div class="cu-demo cu-demo--stack">
    <MarkdownParsedExample />
  </div>
</ClientOnly>
