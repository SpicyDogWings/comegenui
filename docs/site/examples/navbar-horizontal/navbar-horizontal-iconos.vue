<script setup lang="ts">
// Refleja el ejemplo "Enlaces e iconos": `icon` es un string HTML (un SVG inline) y
// `path` define el enlace; un item sin `path` no navega (renderiza un <button>).
const casa =
  '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M9 22V12h6v10"/></svg>';

const items = [
  { label: "Inicio", path: "#inicio", icon: casa },
  { label: "Ajustes", path: "#ajustes" },
  { label: "Sólo texto" },
];
</script>

<template>
  <VanillaDemo :use="['CuNavbarHorizontal']">
    <cu-navbar-horizontal :items.prop="items"></cu-navbar-horizontal>
  </VanillaDemo>
</template>
