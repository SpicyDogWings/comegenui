<script setup lang="ts">
import Navbar from "@/components/navigation/Navbar.vue";

const items = [
  { label: "Inicio", path: "#inicio" },
  { label: "Usuarios", path: "#usuarios" },
  { label: "Reportes", path: "#reportes" },
  { label: "Ajustes", path: "#ajustes" },
];
</script>

<template>
  <!-- searchMode="scroll" no filtra: resalta y desplaza al primer match -->
  <Navbar :items="items" search search-mode="scroll" search-placeholder="Buscar y resaltar…" />
</template>
