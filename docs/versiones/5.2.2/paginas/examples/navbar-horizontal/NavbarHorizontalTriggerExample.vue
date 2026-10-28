<script setup lang="ts">
import NavbarHorizontal from "@/components/navigation/NavbarHorizontal.vue";

const items = [
  { label: "Producto", children: [{ label: "Features", path: "#features" }] },
  { label: "Recursos", children: [{ label: "Guías", path: "#guias" }] },
];
</script>

<template>
  <NavbarHorizontal :items="items" trigger="click" />
  <NavbarHorizontal :items="items" trigger="hover" />
</template>
