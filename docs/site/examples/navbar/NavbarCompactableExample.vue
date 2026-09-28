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
  <!-- compactable: agrega el botón nativo para alternar compacto.
       collapsed: los submenús arrancan cerrados. -->
  <Navbar :items="items" compactable collapsed trigger="click" />
</template>
