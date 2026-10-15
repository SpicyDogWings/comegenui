<script setup lang="ts">
// Refleja el ejemplo "Colores": los 6 nombres semánticos.
const colors = ["primary", "secondary", "neutral", "success", "warning", "danger"] as const;

const columns = [
  { key: "nombre", label: "Nombre", required: true },
  { key: "email", label: "Email", type: "email" },
];
</script>

<template>
  <VanillaDemo :use="['CuCellsImporter']">
    <cu-cells-importer
      v-for="color in colors"
      :key="color"
      :color="color"
      :placeholder="color"
      :columns.prop="columns"
    ></cu-cells-importer>
  </VanillaDemo>
</template>
