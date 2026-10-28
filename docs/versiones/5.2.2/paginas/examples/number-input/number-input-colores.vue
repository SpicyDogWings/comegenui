<script setup lang="ts">
// Refleja el ejemplo "Colores": los 6 nombres semánticos sobre el campo.
const colors = ["primary", "secondary", "neutral", "success", "warning", "danger"] as const;
</script>

<template>
  <VanillaDemo :use="['CuNumberInput']">
    <cu-number-input
      v-for="color in colors"
      :key="color"
      :color="color"
      :placeholder="color"
    ></cu-number-input>
  </VanillaDemo>
</template>
