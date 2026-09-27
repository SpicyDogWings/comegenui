<script setup lang="ts">
import NavbarList from "@/components/navigation/NavbarList.vue";

const activo = { label: "Usuarios", path: "#usuarios" };
const resaltado = { label: "Reportes", path: "#reportes" };

const items = [
  { label: "Inicio", path: "#inicio" },
  activo,
  resaltado,
  { label: "Ajustes", path: "#ajustes" },
];
</script>

<template>
  <!-- activePath: detecta el activo por ruta. activeItem/highlightTarget:
       marcan un item puntual de forma explícita. -->
  <NavbarList :items="items" active-path="#usuarios" :active-item="activo" :highlight-target="resaltado" />
</template>
