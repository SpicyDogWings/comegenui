<script setup lang="ts">
// Refleja el ejemplo "Posicionamiento": `position` + `align` (y `offset`).
</script>

<template>
  <VanillaDemo :use="['CuDropdownMenu']">
    <cu-dropdown-menu label="Arriba" position="top" align="end"></cu-dropdown-menu>
    <cu-dropdown-menu label="Alineado" position="bottom" align="end" offset="8"></cu-dropdown-menu>
  </VanillaDemo>
</template>
