---
title: InlineRenderer
group: Markdown
---

<script setup lang="ts">
import InlineRendererExample from "../../examples/inline-renderer/InlineRendererExample.vue";
import InlineRendererTokensExample from "../../examples/inline-renderer/InlineRendererTokensExample.vue";
</script>

<!--@include: ../../../componentes/vue/inline-renderer.md-->

## Demos en vivo

### Tokens desde marked

<ClientOnly>
  <div class="cu-demo cu-demo--stack">
    <InlineRendererExample />
  </div>
</ClientOnly>

### Tokens manuales (todos los tipos)

Recibe los tokens inline de marked y los renderiza: texto, `strong`, `em`,
`codespan`, `del`, `link`, `image`, `br` y `escape`.

<ClientOnly>
  <div class="cu-demo cu-demo--stack">
    <InlineRendererTokensExample />
  </div>
</ClientOnly>