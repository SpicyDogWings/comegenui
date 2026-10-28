<script setup lang="ts">
import NavbarList from "@/components/navigation/NavbarList.vue";

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
  <NavbarList :items="items" />
</template>
