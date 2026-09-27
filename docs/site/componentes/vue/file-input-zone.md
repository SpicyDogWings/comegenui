---
title: FileInputZone
group: Formularios
---

<script setup lang="ts">
import FileInputZoneBasicExample from "../../examples/file-input-zone/FileInputZoneBasicExample.vue";
import FileInputZoneMultipleExample from "../../examples/file-input-zone/FileInputZoneMultipleExample.vue";
import FileInputZoneDirectoryExample from "../../examples/file-input-zone/FileInputZoneDirectoryExample.vue";
import FileInputZoneStatesExample from "../../examples/file-input-zone/FileInputZoneStatesExample.vue";
import FileInputZoneMaxSizeExample from "../../examples/file-input-zone/FileInputZoneMaxSizeExample.vue";
import FileInputZoneImperativeExample from "../../examples/file-input-zone/FileInputZoneImperativeExample.vue";
</script>

<!--@include: ../../../componentes/vue/file-input-zone.md-->

## Demos en vivo

### Básico (v-model, accept, placeholder)

<ClientOnly>
  <div class="cu-demo cu-demo--stack">
    <FileInputZoneBasicExample />
  </div>
</ClientOnly>

### Múltiple y altura máxima (multiple, maxHeight)

<ClientOnly>
  <div class="cu-demo cu-demo--stack">
    <FileInputZoneMultipleExample />
  </div>
</ClientOnly>

### Directorio (directory, directoryDeep)

<ClientOnly>
  <div class="cu-demo cu-demo--stack">
    <FileInputZoneDirectoryExample />
  </div>
</ClientOnly>

### Color y estados (color, disabled, readOnly)

<ClientOnly>
  <div class="cu-demo cu-demo--stack">
    <FileInputZoneStatesExample />
  </div>
</ClientOnly>

### Límite de tamaño (maxSize)

<ClientOnly>
  <div class="cu-demo cu-demo--stack">
    <FileInputZoneMaxSizeExample />
  </div>
</ClientOnly>

### API imperativa (ref + métodos)

<ClientOnly>
  <div class="cu-demo cu-demo--stack">
    <FileInputZoneImperativeExample />
  </div>
</ClientOnly>
