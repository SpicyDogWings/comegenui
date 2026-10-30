<script setup lang="ts">
// Refleja el ejemplo "Trigger": `click` (default) y `hover`.
const items = [
  { label: "Inicio", path: "#inicio" },
  {
    label: "Producto",
    children: [
      { label: "Features", path: "#features" },
      { label: "Precios", path: "#precios" },
    ],
  },
];
</script>

<template>
  <VanillaDemo :use="['CuNavbarHorizontal']">
    <cu-navbar-horizontal trigger="click" :items.prop="items"></cu-navbar-horizontal>
    <cu-navbar-horizontal trigger="hover" :items.prop="items"></cu-navbar-horizontal>
  </VanillaDemo>
</template>
