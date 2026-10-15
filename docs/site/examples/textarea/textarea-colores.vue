<script setup lang="ts">
// Refleja el ejemplo "Colores": los 6 nombres semánticos.
const colors = ["primary", "secondary", "neutral", "success", "warning", "danger"] as const;
</script>

<template>
  <VanillaDemo :use="['CuTextarea']">
    <div class="cu-demo-controls">
      <cu-textarea v-for="color in colors" :key="color" :color="color" :placeholder="color"></cu-textarea>
    </div>
  </VanillaDemo>
</template>
