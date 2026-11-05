<script setup lang="ts">
import NavbarMenu from "@/components/navigation/NavbarMenu.vue";

const items = [
  {
    label: "Archivo",
    children: [
      { label: "Nuevo", path: "#nuevo" },
      {
        label: "Exportar",
        children: [
          { label: "PDF", path: "#pdf" },
          { label: "PNG", path: "#png" },
        ],
      },
    ],
  },
  { label: "Cerrar", path: "#cerrar" },
];
</script>

<template>
  <!-- Un item con children es un Dropdown anidado: el menú se abre en cascada -->
  <NavbarMenu :items="items" />
</template>
