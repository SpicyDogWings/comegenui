<script setup lang="ts">
// Refleja el ejemplo "Submenús": `children` despliega un panel y se puede anidar.
const items = [
  { label: "Inicio", path: "#inicio" },
  {
    label: "Equipo",
    children: [
      { label: "Desarrollo", path: "#equipo-dev" },
      {
        label: "Diseño",
        children: [
          { label: "Sistema", path: "#diseno-sistema" },
          { label: "Marca", path: "#diseno-marca" },
        ],
      },
    ],
  },
  { label: "Contacto", path: "#contacto" },
];
</script>

<template>
  <VanillaDemo :use="['CuNavbarHorizontal']">
    <cu-navbar-horizontal :items.prop="items"></cu-navbar-horizontal>
  </VanillaDemo>
</template>
