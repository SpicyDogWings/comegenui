<script setup lang="ts">
// Refleja el ejemplo "Variantes": outlined (default), soft, ghost y subtle.
const variants = ["outlined", "soft", "ghost", "subtle"] as const;

const columns = [
  { key: "nombre", label: "Nombre", required: true },
  { key: "email", label: "Email", type: "email" },
];
</script>

<template>
  <VanillaDemo :use="['CuCellsImporter']">
    <cu-cells-importer
      v-for="variant in variants"
      :key="variant"
      color="primary"
      :variant="variant"
      :placeholder="variant"
      :columns.prop="columns"
    ></cu-cells-importer>
  </VanillaDemo>
</template>
