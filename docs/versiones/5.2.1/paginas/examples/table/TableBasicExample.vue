<script setup lang="ts">
import { ref } from "vue";
import Table from "@/components/data/Table.vue";

const columns = ref([
  { key: "id", label: "ID", width: "64px", align: "center" },
  { key: "producto", label: "Producto" },
  { key: "categoria", label: "Categoría" },
  { key: "stock", label: "Stock", align: "right" },
  { key: "precio", label: "Precio", align: "right" },
]);

const data = ref([
  { id: 1, producto: "Teclado mecánico", categoria: "Periféricos", stock: 24, precio: 89.9 },
  { id: 2, producto: 'Monitor 27"', categoria: "Pantallas", stock: 6, precio: 249.0 },
  { id: 3, producto: "Mouse inalámbrico", categoria: "Periféricos", stock: 41, precio: 34.5 },
  { id: 4, producto: "Webcam HD", categoria: "Video", stock: 12, precio: 59.99 },
]);
</script>

<template>
  <Table :columns="columns" :data="data" />
</template>
