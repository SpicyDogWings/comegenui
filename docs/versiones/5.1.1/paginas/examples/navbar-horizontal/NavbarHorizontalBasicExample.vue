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
  <NavbarHorizontal :items="items" />
</template>
