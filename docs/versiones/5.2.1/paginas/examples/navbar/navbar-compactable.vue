<script setup lang="ts">
// Refleja el ejemplo "Compactable y colapsado": el botón nativo alterna el modo compacto y
// `collapsed` arranca con los submenús cerrados.
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
    <cu-navbar compactable collapsed trigger="click" :items.prop="items"></cu-navbar>
  </VanillaDemo>
</template>
