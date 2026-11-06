<script setup lang="ts">
// Refleja el ejemplo "Plantilla": `template` muestra el botón de descarga en csv o xlsx.
const columns = [
  { key: "nombre", label: "Nombre", required: true },
  { key: "dni", label: "DNI", type: "integer" },
  { key: "email", label: "Email", type: "email" },
];
</script>

<template>
  <VanillaDemo :use="['CuCellsImporter']">
    <div class="cu-demo-controls cu-demo-controls--stack">
      <cu-cells-importer
        color="primary"
        placeholder="Plantilla CSV"
        :columns.prop="columns"
        :template.prop="{ enabled: true, type: 'csv', filename: 'plantilla-alumnos' }"
      ></cu-cells-importer>
      <cu-cells-importer
        color="primary"
        placeholder="Plantilla XLSX"
        :columns.prop="columns"
        :template.prop="{ enabled: true, type: 'xlsx', filename: 'plantilla-alumnos' }"
      ></cu-cells-importer>
    </div>
  </VanillaDemo>
</template>
