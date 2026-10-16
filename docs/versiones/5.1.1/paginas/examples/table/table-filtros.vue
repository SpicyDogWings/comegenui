<script setup lang="ts">
// Refleja el ejemplo "Filtros por columna": `filters` se asigna como propiedad JS.
const columns = [
  { key: "nombre", label: "Nombre" },
  { key: "estado", label: "Estado" },
];

const data = [
  { nombre: "Juan Pérez", estado: "Activo" },
  { nombre: "María García", estado: "Inactivo" },
];

// Mostrar solo activos
const filters = { estado: "Activo" };
</script>

<template>
  <VanillaDemo :use="['CuTable']">
    <cu-table search-enabled pagination :columns="columns" :data="data" :filters="filters"></cu-table>
  </VanillaDemo>
</template>
