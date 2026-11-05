<script setup lang="ts">
import Navbar from "@/components/navigation/Navbar.vue";

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
  <Navbar :items="items" compact trigger="click" />
  <Navbar :items="items" compact trigger="hover" />
</template>
