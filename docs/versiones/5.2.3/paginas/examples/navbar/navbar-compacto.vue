<script setup lang="ts">
// Refleja el ejemplo "Modo compacto": `trigger` define cómo abren los submenús (flyout).
const items = [
  {
    label: "Usuarios",
    children: [
      { label: "Lista", path: "#usuarios-lista" },
      { label: "Roles", path: "#usuarios-roles" },
    ],
  },
  {
    label: "Reportes",
    children: [
      { label: "Ventas", path: "#reportes-ventas" },
      { label: "Stock", path: "#reportes-stock" },
    ],
  },
  { label: "Ajustes", path: "#ajustes" },
];
</script>

<template>
  <VanillaDemo :use="['CuNavbar']">
    <!-- trigger="click" (default) -->
    <cu-navbar compact trigger="click" :items.prop="items"></cu-navbar>
    <!-- trigger="hover" -->
    <cu-navbar compact trigger="hover" :items.prop="items"></cu-navbar>
  </VanillaDemo>
</template>
