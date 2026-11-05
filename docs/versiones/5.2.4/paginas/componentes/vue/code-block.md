---
title: CodeBlock
group: Markdown
---

<script setup lang="ts">
import CodeBlockVariantsExample from "../../examples/code-block/CodeBlockVariantsExample.vue";
import CodeBlockLanguagesExample from "../../examples/code-block/CodeBlockLanguagesExample.vue";
</script>

<!--@include: ../../../componentes/vue/code-block.md-->

## Demos en vivo

### Variantes

`default`, `outlined` y `solid` comparten el resaltado pero cambian el fondo y
el borde.

<ClientOnly>
  <div class="cu-demo cu-demo--stack">
    <CodeBlockVariantsExample />
  </div>
</ClientOnly>

### Lenguajes y números de línea

`language` activa el resaltado (y muestra el badge); `lineNumbers` agrega la
gutter. El componente tiene alias para `js`, `ts`, `sh`, `py` y variantes de
`html`/`vue`/`sfc`.

<ClientOnly>
  <div class="cu-demo cu-demo--stack">
    <CodeBlockLanguagesExample />
  </div>
</ClientOnly>
