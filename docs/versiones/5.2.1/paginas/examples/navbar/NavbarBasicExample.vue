<script setup lang="ts">
import Navbar from "@/components/navigation/Navbar.vue";

const items = [
  { label: "Inicio", path: "#inicio" },
  {
    label: "Usuarios",
    children: [
      { label: "Lista", path: "#usuarios-lista" },
      { label: "Roles", path: "#usuarios-roles" },
    ],
  },
  { label: "Ajustes", path: "#ajustes" },
];
</script>

<template>
  <Navbar :items="items" active-path="#usuarios-lista" />
</template>
