<script setup lang="ts">
// Refleja el ejemplo "Colores": los 6 nombres semánticos con la variante soft.
const colors = ["primary", "secondary", "neutral", "success", "warning", "danger"] as const;

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
      v-for="color in colors"
      :key="color"
      :color="color"
      variant="soft"
      :columns="columns"
      :data="data"
    ></cu-table>
  </VanillaDemo>
</template>
