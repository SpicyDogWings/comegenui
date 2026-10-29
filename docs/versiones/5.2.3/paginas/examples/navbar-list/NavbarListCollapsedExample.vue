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
  <!-- collapsed: los submenús arrancan cerrados. trigger: click | hover. -->
  <NavbarList :items="items" collapsed trigger="click" />
  <NavbarList :items="items" trigger="hover" />
</template>
