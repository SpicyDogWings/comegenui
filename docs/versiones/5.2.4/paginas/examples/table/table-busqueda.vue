<script setup lang="ts">
// Refleja el ejemplo "Búsqueda (como atributo HTML)": `search-fields` va como
// JSON válido en el atributo. Se agregan columnas y datos para poder verlo.
const columns = [
  { key: "nombre", label: "Nombre" },
  { key: "email", label: "Correo" },
];

const data = [
  { nombre: "Juan Pérez", email: "juan@ejemplo.com" },
  { nombre: "María García", email: "maria@ejemplo.com" },
];
</script>

<template>
  <VanillaDemo :use="['CuTable']">
    <cu-table
      search-enabled
      search-placeholder="Buscar..."
      search-fields='["nombre","email"]'
      :columns="columns"
      :data="data"
    ></cu-table>
  </VanillaDemo>
</template>
