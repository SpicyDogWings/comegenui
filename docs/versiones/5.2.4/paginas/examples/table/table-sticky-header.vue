<script setup lang="ts">
// Refleja el ejemplo "Sticky header": mismo header con búsqueda; se agregan
// datos y `table-max-height` para ver el pegado al hacer scroll interno.
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
    <cu-table
      search-enabled
      search-placeholder="Buscar..."
      table-max-height="220px"
      style="width: 100%;"
      :columns="columns"
      :data="data"
    ></cu-table>
  </VanillaDemo>
</template>
