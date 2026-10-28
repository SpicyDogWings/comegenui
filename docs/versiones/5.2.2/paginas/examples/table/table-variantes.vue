<script setup lang="ts">
// Refleja el ejemplo "Variantes": solid, outlined, soft (default), ghost y subtle.
const variants = ["solid", "outlined", "soft", "ghost", "subtle"] as const;

const columns = [
  { key: "producto", label: "Producto" },
  { key: "stock", label: "Stock", align: "right" },
];

const data = [
  { producto: "Teclado mecánico", stock: 24 },
  { producto: 'Monitor 27"', stock: 6 },
];
</script>

<template>
  <VanillaDemo :use="['CuTable']">
    <cu-table
      v-for="variant in variants"
      :key="variant"
      color="primary"
      :variant="variant"
      :columns="columns"
      :data="data"
    ></cu-table>
  </VanillaDemo>
</template>
