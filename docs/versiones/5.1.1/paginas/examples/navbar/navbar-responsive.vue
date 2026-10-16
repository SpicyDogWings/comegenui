<script setup lang="ts">
// Refleja el ejemplo "Responsive": en lugar de la nav inline aparece una hamburguesa que abre
// el menú en un SideOver.
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
    <!-- responsiveMode: auto (default) | side | fullscreen -->
    <cu-navbar responsive responsive-mode="auto" :items.prop="items"></cu-navbar>
    <cu-navbar responsive responsive-mode="side" :items.prop="items"></cu-navbar>
    <cu-navbar responsive responsive-mode="fullscreen" :items.prop="items"></cu-navbar>

    <!-- sideOverPosition: left (default) | right | top | bottom -->
    <cu-navbar
      responsive
      responsive-mode="side"
      side-over-position="left"
      :items.prop="items"
    ></cu-navbar>
    <cu-navbar
      responsive
      responsive-mode="side"
      side-over-position="right"
      :items.prop="items"
    ></cu-navbar>
    <cu-navbar
      responsive
      responsive-mode="side"
      side-over-position="top"
      :items.prop="items"
    ></cu-navbar>
    <cu-navbar
      responsive
      responsive-mode="side"
      side-over-position="bottom"
      :items.prop="items"
    ></cu-navbar>
  </VanillaDemo>
</template>
