<script setup lang="ts">
import CellsImporter from "@/components/form/CellsImporter.vue";

const columns = [
  { key: "nombre", label: "Nombre", type: "string", required: true },
];
</script>

<template>
  <CellsImporter :columns="columns" color="primary" placeholder="Habilitado" />
  <CellsImporter :columns="columns" color="danger" variant="soft" disabled placeholder="disabled" />
  <CellsImporter :columns="columns" read-only placeholder="readOnly" />
</template>
