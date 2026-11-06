---
title: FileList
group: Información
---

<script setup lang="ts">
import FileListBasicExample from "../../examples/file-list/FileListBasicExample.vue";
import FileListSingleAndEmptyExample from "../../examples/file-list/FileListSingleAndEmptyExample.vue";
import FileListColorsExample from "../../examples/file-list/FileListColorsExample.vue";
import FileListDisabledExample from "../../examples/file-list/FileListDisabledExample.vue";
import FileListMaxHeightExample from "../../examples/file-list/FileListMaxHeightExample.vue";
</script>

<!--@include: ../../../componentes/vue/file-list.md-->

## Demos en vivo

### Básica (select y remove)

<ClientOnly>
  <div class="cu-demo cu-demo--stack">
    <FileListBasicExample />
  </div>
</ClientOnly>

### File suelto y null

<ClientOnly>
  <div class="cu-demo cu-demo--stack">
    <FileListSingleAndEmptyExample />
  </div>
</ClientOnly>

### Color

<ClientOnly>
  <div class="cu-demo cu-demo--stack">
    <FileListColorsExample />
  </div>
</ClientOnly>

### Deshabilitado

<ClientOnly>
  <div class="cu-demo cu-demo--stack">
    <FileListDisabledExample />
  </div>
</ClientOnly>

### Altura máxima

<ClientOnly>
  <div class="cu-demo cu-demo--stack">
    <FileListMaxHeightExample />
  </div>
</ClientOnly>