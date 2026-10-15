<script setup lang="ts">
// Refleja el ejemplo "Activo": `active-path` resalta el item (y el padre, si el activo
// está dentro de un submenú).
const items = [
  { label: "Inicio", path: "#inicio" },
  {
    label: "Equipo",
    children: [
      { label: "Desarrollo", path: "#equipo-dev" },
      { label: "Diseño", path: "#equipo-diseno" },
    ],
  },
  { label: "Contacto", path: "#contacto" },
];
</script>

<template>
  <VanillaDemo :use="['CuNavbarHorizontal']">
    <cu-navbar-horizontal active-path="#equipo-dev" :items.prop="items"></cu-navbar-horizontal>
    <cu-navbar-horizontal active-path="#contacto" :items.prop="items"></cu-navbar-horizontal>
  </VanillaDemo>
</template>
