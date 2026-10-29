<script setup lang="ts">
import Navbar from "@/components/navigation/Navbar.vue";

const destacado = { label: "Reportes", path: "#reportes" };

const items = [
  { label: "Inicio", path: "#inicio" },
  { label: "Usuarios", path: "#usuarios" },
  destacado,
  { label: "Ajustes", path: "#ajustes" },
];
</script>

<template>
  <!-- highlightItem resalta un item puntual; activePath marca el activo por ruta -->
  <Navbar :items="items" :highlight-item="destacado" active-path="#usuarios" />
</template>
