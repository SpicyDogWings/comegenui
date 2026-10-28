<script setup lang="ts">
import { ref } from "vue";
import AdvancedTable from "@/components/data/AdvancedTable.vue";

const columns = ref([
  { key: "producto", label: "Producto" },
  { key: "stock", label: "Stock", align: "right" },
  { key: "precio", label: "Precio", align: "right" },
]);

const data = ref([
  { producto: "Teclado mecánico", stock: 24, precio: 89.9 },
  { producto: 'Monitor 27"', stock: 6, precio: 249.0 },
  { producto: "Mouse inalámbrico", stock: 41, precio: 34.5 },
]);
</script>

<template>
  <AdvancedTable :columns="columns" :data="data" color="primary" variant="solid" :pagination="false" />
  <AdvancedTable :columns="columns" :data="data" color="success" variant="outlined" :pagination="false" />
  <AdvancedTable :columns="columns" :data="data" color="warning" variant="subtle" :pagination="false" />
</template>
