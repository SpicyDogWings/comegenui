<script setup lang="ts">
// Refleja el ejemplo "Activo": `active-path` marca qué item se ve como activo.
const items = [
  { label: "Inicio", path: "#inicio" },
  { label: "Usuarios", path: "#usuarios" },
  { label: "Ajustes", path: "#ajustes" },
];
</script>

<template>
  <VanillaDemo :use="['CuNavbar']">
    <cu-navbar active-path="#usuarios" :items.prop="items"></cu-navbar>
  </VanillaDemo>
</template>
