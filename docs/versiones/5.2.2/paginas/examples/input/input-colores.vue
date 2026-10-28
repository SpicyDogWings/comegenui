<script setup lang="ts">
// Refleja el ejemplo "Colores": los 6 nombres semánticos con la variante `soft`.
const colors = ["primary", "secondary", "neutral", "success", "warning", "danger"] as const;
</script>

<template>
  <VanillaDemo :use="['CuInput']">
    <cu-input v-for="color in colors" :key="color" :color="color" :placeholder="color"></cu-input>
  </VanillaDemo>
</template>
