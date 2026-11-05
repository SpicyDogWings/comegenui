<script setup lang="ts">
const columns = [
  { key: "nombre", label: "Nombre", type: "string", required: true },
];
</script>

<template>
  <!-- Refleja el ejemplo "Estados": `disabled` y `readonly`. -->
  <VanillaDemo :use="['CuCellsImporter']">
    <cu-cells-importer color="primary" placeholder="habilitado" :columns.prop="columns"></cu-cells-importer>
    <cu-cells-importer color="danger" variant="soft" disabled placeholder="disabled" :columns.prop="columns"></cu-cells-importer>
    <cu-cells-importer readonly placeholder="readonly" :columns.prop="columns"></cu-cells-importer>
  </VanillaDemo>
</template>
