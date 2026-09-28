<script setup lang="ts">
import { ref } from "vue";
import AdvancedTable from "@/components/data/AdvancedTable.vue";

const columns = ref([
  { key: "id", label: "ID", width: "64px", align: "center" },
  { key: "producto", label: "Producto", sortable: "string" },
  { key: "categoria", label: "Categoría" },
  { key: "stock", label: "Stock", align: "right", sortable: "number" },
  { key: "precio", label: "Precio", align: "right", sortable: "number" },
]);

const data = ref([
  { id: 1, producto: "Teclado mecánico", categoria: "Periféricos", stock: 24, precio: 89.9 },
  { id: 2, producto: 'Monitor 27"', categoria: "Pantallas", stock: 6, precio: 249.0 },
  { id: 3, producto: "Mouse inalámbrico", categoria: "Periféricos", stock: 41, precio: 34.5 },
  { id: 4, producto: "Webcam HD", categoria: "Video", stock: 12, precio: 59.99 },
  { id: 5, producto: "Auriculares USB", categoria: "Audio", stock: 18, precio: 45.0 },
]);
</script>

<template>
  <AdvancedTable :columns="columns" :data="data" :pagination="false" />
</template>
