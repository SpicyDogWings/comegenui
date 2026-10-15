<script setup lang="ts">
// Refleja el ejemplo "Compacta y alto máximo": `compact` y `table-max-height`.
const columns = [
  { key: "id", label: "ID", width: "64px" },
  { key: "producto", label: "Producto" },
  { key: "categoria", label: "Categoría" },
  { key: "stock", label: "Stock", align: "right" },
];

const data = Array.from({ length: 12 }, (_, i) => ({
  id: i + 1,
  producto: `Producto ${String(i + 1).padStart(2, "0")}`,
  categoria: ["Periféricos", "Pantallas", "Audio", "Video"][i % 4],
  stock: (i + 1) * 3,
}));
</script>

<template>
  <VanillaDemo :use="['CuTable']">
    <!-- compact: menos padding en las celdas -->
    <cu-table compact :columns="columns" :data="data"></cu-table>
    <!-- table-max-height: scroll interno con header sticky -->
    <cu-table table-max-height="220px" :columns="columns" :data="data"></cu-table>
  </VanillaDemo>
</template>
