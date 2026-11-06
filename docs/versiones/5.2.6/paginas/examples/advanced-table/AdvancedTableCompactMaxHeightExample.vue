<script setup lang="ts">
import { ref } from "vue";
import AdvancedTable from "@/components/data/AdvancedTable.vue";

const columns = ref([
  { key: "id", label: "ID", width: "64px" },
  { key: "producto", label: "Producto" },
  { key: "categoria", label: "Categoría" },
  { key: "stock", label: "Stock", align: "right" },
]);

const data = ref(
  Array.from({ length: 12 }, (_, i) => ({
    id: i + 1,
    producto: `Producto ${String(i + 1).padStart(2, "0")}`,
    categoria: ["Periféricos", "Pantallas", "Audio", "Video"][i % 4],
    stock: (i + 1) * 3,
  })),
);
</script>

<template>
  <!-- compact: menos padding en celdas -->
  <AdvancedTable :columns="columns" :data="data" compact :pagination="false" />
  <!-- tableMaxHeight: scroll interno con header sticky -->
  <AdvancedTable :columns="columns" :data="data" table-max-height="220px" :pagination="false" />
</template>
