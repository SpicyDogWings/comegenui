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

const modes = ["auto", "side", "fullscreen"] as const;
const positions = ["left", "right", "top", "bottom"] as const;
</script>

<template>
  <!-- responsiveMode: auto (default) | side | fullscreen -->
  <Navbar v-for="mode in modes" :key="mode" :items="items" responsive :responsive-mode="mode" />

  <!-- sideOverPosition: left (default) | right | top | bottom (con responsiveMode="side") -->
  <Navbar
    v-for="position in positions"
    :key="position"
    :items="items"
    responsive
    responsive-mode="side"
    :side-over-position="position"
  />
</template>
