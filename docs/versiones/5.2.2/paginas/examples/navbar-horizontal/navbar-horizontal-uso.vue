<script setup lang="ts">
// Refleja el ejemplo "Uso en HTML plano": `items` se asigna como propiedad JS (no es atributo).
const items = [
  { label: "Inicio", path: "#inicio" },
  {
    label: "Equipo",
    children: [
      { label: "Desarrollo", path: "#equipo-dev" },
      { label: "Diseño", path: "#equipo-diseno" },
    ],
  },
];
</script>

<template>
  <VanillaDemo :use="['CuNavbarHorizontal']">
    <cu-navbar-horizontal id="nav" :items.prop="items"></cu-navbar-horizontal>
  </VanillaDemo>
</template>
