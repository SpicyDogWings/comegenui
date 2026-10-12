<script setup lang="ts">
// Refleja el ejemplo "Modo compacto y responsive": `items` va como array.
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
  <VanillaDemo :use="['CuNavbar']">
    <cu-navbar id="nav2" compact trigger="hover" :items.prop="items"></cu-navbar>
    <cu-navbar
      id="nav3"
      responsive
      responsive-mode="side"
      side-over-position="right"
      :items.prop="items"
    ></cu-navbar>
  </VanillaDemo>
</template>
