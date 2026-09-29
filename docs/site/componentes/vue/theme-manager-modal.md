---
title: ThemeManagerModal
group: Theme
---

<script setup lang="ts">
import ThemeManagerModalExample from "../../examples/theme-manager-modal/ThemeManagerModalExample.vue";
</script>

<!--@include: ../../../componentes/vue/theme-manager-modal.md-->

## Demos en vivo

### API imperativa, props y eventos

Se abre con un `ref` (`.open()`, `.close()`), recibe `themeName` (editable vía
`v-model:theme-name`) y `cssOutput`, y emite los eventos de import/export del
tema. El panel de salida registra cada evento.

<ClientOnly>
  <div class="cu-demo cu-demo--stack">
    <ThemeManagerModalExample />
  </div>
</ClientOnly>
