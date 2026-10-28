<script setup lang="ts">
import NavbarHorizontal from "@/components/navigation/NavbarHorizontal.vue";

const items = [
  { label: "Inicio", path: "#inicio" },
  {
    label: "Equipo",
    children: [
      { label: "Desarrollo", path: "#equipo-dev" },
      { label: "Diseño", path: "#equipo-diseno" },
    ],
  },
  { label: "Contacto", path: "#contacto" },
];
</script>

<template>
  <!-- activePath marca el item activo (y al padre, si está en un submenú) -->
  <NavbarHorizontal :items="items" active-path="#equipo-dev" />
</template>
