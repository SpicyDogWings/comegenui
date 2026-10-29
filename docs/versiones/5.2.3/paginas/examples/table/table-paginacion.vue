<script setup lang="ts">
// Refleja el ejemplo "Paginación": `pagination`, `items-per-page`, `show-page-size`
// y `page-size-options`.
const columns = [
  { key: "nombre", label: "Nombre", sortable: "string" },
  { key: "email", label: "Correo" },
  { key: "rol", label: "Rol" },
];

const data = Array.from({ length: 12 }, (_, i) => ({
  nombre: `Persona ${String(i + 1).padStart(2, "0")}`,
  email: `persona${i + 1}@ejemplo.com`,
  rol: ["Admin", "Editor", "Visor"][i % 3],
}));

const pageSizeOptions = [5, 10, 20];
</script>

<template>
  <VanillaDemo :use="['CuTable']">
    <cu-table
      pagination
      items-per-page="5"
      show-page-size
      :pageSizeOptions.prop="pageSizeOptions"
      :columns="columns"
      :data="data"
    ></cu-table>
  </VanillaDemo>
</template>
