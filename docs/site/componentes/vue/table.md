---
title: Table
group: Datos
---

<script setup lang="ts">
import TableBasicExample from "../../examples/table/TableBasicExample.vue";
import TableColorsExample from "../../examples/table/TableColorsExample.vue";
import TableEmptyExample from "../../examples/table/TableEmptyExample.vue";
import TableRowDisabledExample from "../../examples/table/TableRowDisabledExample.vue";
import TableFooterExample from "../../examples/table/TableFooterExample.vue";
import TableCompactMaxHeightExample from "../../examples/table/TableCompactMaxHeightExample.vue";
import TableLoadingExample from "../../examples/table/TableLoadingExample.vue";
import TableHtmlCellsExample from "../../examples/table/TableHtmlCellsExample.vue";
import TableTemplateExample from "../../examples/table/TableTemplateExample.vue";
</script>

<!--@include: ../../../componentes/vue/table.md-->

## Demos en vivo

### Básica

<ClientOnly>
  <div class="cu-demo cu-demo--stack">
    <TableBasicExample />
  </div>
</ClientOnly>

### Color y variante

<ClientOnly>
  <div class="cu-demo cu-demo--stack">
    <TableColorsExample />
  </div>
</ClientOnly>

### Vacío (prop y slot)

<ClientOnly>
  <div class="cu-demo cu-demo--stack">
    <TableEmptyExample />
  </div>
</ClientOnly>

### Filas deshabilitadas

<ClientOnly>
  <div class="cu-demo cu-demo--stack">
    <TableRowDisabledExample />
  </div>
</ClientOnly>

### Footer (prop y slot)

<ClientOnly>
  <div class="cu-demo cu-demo--stack">
    <TableFooterExample />
  </div>
</ClientOnly>

### Compact y maxHeight

<ClientOnly>
  <div class="cu-demo cu-demo--stack">
    <TableCompactMaxHeightExample />
  </div>
</ClientOnly>

### Estado de carga

<ClientOnly>
  <div class="cu-demo cu-demo--stack">
    <TableLoadingExample />
  </div>
</ClientOnly>

### Celdas HTML

<ClientOnly>
  <div class="cu-demo cu-demo--stack">
    <TableHtmlCellsExample />
  </div>
</ClientOnly>

### Slot template (fila custom)

<ClientOnly>
  <div class="cu-demo cu-demo--stack">
    <TableTemplateExample />
  </div>
</ClientOnly>