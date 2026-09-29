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
  <!-- responsive: muestra un botón hamburguesa que abre la nav en un SideOver.
       responsiveMode: auto | side | fullscreen. sideOverPosition: left/right/top/bottom. -->
  <Navbar
    :items="items"
    responsive
    responsive-mode="side"
    side-over-position="right"
    search
  />
</template>
