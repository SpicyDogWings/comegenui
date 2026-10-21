<script setup lang="ts">
// Refleja el ejemplo "Orientación": horizontal a todo el ancho y dos verticales
// dentro de una fila con alto fijo (el vertical toma el alto del contenedor).
const texto = { display: "flex", alignItems: "center", color: "var(--cu-color-neutral)" };
</script>

<template>
  <VanillaDemo :use="['CuDivider']">
    <cu-divider orientation="horizontal"></cu-divider>

    <div style="display: flex; align-items: stretch; gap: 16px; height: 96px; padding: 0 8px">
      <span :style="texto">Izquierda</span>
      <cu-divider orientation="vertical"></cu-divider>
      <span :style="texto">Centro</span>
      <cu-divider orientation="vertical"></cu-divider>
      <span :style="texto">Derecha</span>
    </div>
  </VanillaDemo>
</template>
