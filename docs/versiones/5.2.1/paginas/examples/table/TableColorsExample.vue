<script setup lang="ts">
import { ref } from "vue";
import Table from "@/components/data/Table.vue";

const columns = ref([
  { key: "producto", label: "Producto" },
  { key: "stock", label: "Stock", align: "right" },
  { key: "precio", label: "Precio", align: "right" },
]);

const data = ref([
  { producto: "Teclado mecánico", stock: 24, precio: 89.9 },
  { producto: 'Monitor 27"', stock: 6, precio: 249.0 },
]);
</script>

<template>
  <Table :columns="columns" :data="data" color="primary" variant="solid" />
  <Table :columns="columns" :data="data" color="success" variant="outlined" />
  <Table :columns="columns" :data="data" color="warning" variant="subtle" />
</template>
