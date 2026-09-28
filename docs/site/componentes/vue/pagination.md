---
title: Pagination
group: Controles
---

<script setup lang="ts">
import PaginationAppearanceExample from "../../examples/pagination/PaginationAppearanceExample.vue";
import PaginationModelExample from "../../examples/pagination/PaginationModelExample.vue";
import PaginationPageSizeExample from "../../examples/pagination/PaginationPageSizeExample.vue";
import PaginationFirstLastExample from "../../examples/pagination/PaginationFirstLastExample.vue";
import PaginationEventsExample from "../../examples/pagination/PaginationEventsExample.vue";
import PaginationStatesExample from "../../examples/pagination/PaginationStatesExample.vue";
</script>

<!--@include: ../../../componentes/vue/pagination.md-->

## Demos en vivo

### Apariencia

<ClientOnly>
  <div class="cu-demo">
    <PaginationAppearanceExample />
  </div>
</ClientOnly>

### Datos (v-model)

<ClientOnly>
  <div class="cu-demo">
    <PaginationModelExample />
  </div>
</ClientOnly>

### Tamaño de página

<ClientOnly>
  <div class="cu-demo">
    <PaginationPageSizeExample />
  </div>
</ClientOnly>

### Primera y última página

<ClientOnly>
  <div class="cu-demo">
    <PaginationFirstLastExample />
  </div>
</ClientOnly>

### Eventos

<ClientOnly>
  <div class="cu-demo">
    <PaginationEventsExample />
  </div>
</ClientOnly>

### Estados

<ClientOnly>
  <div class="cu-demo">
    <PaginationStatesExample />
  </div>
</ClientOnly>
