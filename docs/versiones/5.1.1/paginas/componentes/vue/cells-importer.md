---
title: CellsImporter
group: Formularios
---

<script setup lang="ts">
import CellsImporterBasicExample from "../../examples/cells-importer/CellsImporterBasicExample.vue";
import CellsImporterZoneExample from "../../examples/cells-importer/CellsImporterZoneExample.vue";
import CellsImporterParseOptionsExample from "../../examples/cells-importer/CellsImporterParseOptionsExample.vue";
import CellsImporterStatesExample from "../../examples/cells-importer/CellsImporterStatesExample.vue";
import CellsImporterTemplateExample from "../../examples/cells-importer/CellsImporterTemplateExample.vue";
</script>

<!--@include: ../../../componentes/vue/cells-importer.md-->

## Demos en vivo

### Básico (columns, set + eventos parse/error/change)

<ClientOnly>
  <div class="cu-demo cu-demo--stack">
    <CellsImporterBasicExample />
  </div>
</ClientOnly>

### Zona de arrastre (inputType, formats, maxSize)

<ClientOnly>
  <div class="cu-demo cu-demo--stack">
    <CellsImporterZoneExample />
  </div>
</ClientOnly>

### Opciones de parseo (delimiter, hasHeader, strict, sheet)

<ClientOnly>
  <div class="cu-demo cu-demo--stack">
    <CellsImporterParseOptionsExample />
  </div>
</ClientOnly>

### Color y estados (color, variant, disabled, readOnly)

<ClientOnly>
  <div class="cu-demo cu-demo--stack">
    <CellsImporterStatesExample />
  </div>
</ClientOnly>

### Plantilla y API imperativa (template, downloadTemplate)

<ClientOnly>
  <div class="cu-demo cu-demo--stack">
    <CellsImporterTemplateExample />
  </div>
</ClientOnly>
