<script setup lang="ts">
// Refleja el ejemplo "Uso en HTML plano": `items` va como array, con anclas.
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
    <cu-navbar-horizontal
      id="nav"
      trigger="hover"
      active-path="#equipo-dev"
      :items.prop="items"
    ></cu-navbar-horizontal>
  </VanillaDemo>
</template>
