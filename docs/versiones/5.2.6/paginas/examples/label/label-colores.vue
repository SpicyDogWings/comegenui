<script setup lang="ts">
// Refleja el ejemplo "Colores": los 6 nombres semánticos.
const colors = ["primary", "secondary", "neutral", "success", "warning", "danger"] as const;
</script>

<template>
  <VanillaDemo :use="['CuLabel']">
    <cu-label v-for="color in colors" :key="color" :label="color" :color="color"></cu-label>
  </VanillaDemo>
</template>
