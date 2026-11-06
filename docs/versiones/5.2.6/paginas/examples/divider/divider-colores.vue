<script setup lang="ts">
// Refleja el ejemplo "Colores": los seis nombres semánticos.
const colors = ["primary", "secondary", "neutral", "success", "warning", "danger"] as const;
</script>

<template>
  <VanillaDemo :use="['CuDivider']">
    <cu-divider v-for="color in colors" :key="color" :color="color" :label="color"></cu-divider>
  </VanillaDemo>
</template>
