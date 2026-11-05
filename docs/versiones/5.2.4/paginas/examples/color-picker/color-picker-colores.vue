<script setup lang="ts">
// Refleja el ejemplo "Colores": los 6 nombres semánticos (acento del borde/foco).
const colors = ["primary", "secondary", "neutral", "success", "warning", "danger"] as const;
</script>

<template>
  <VanillaDemo :use="['CuColorPicker']">
    <div class="cu-demo-controls">
      <span v-for="color in colors" :key="color">
        {{ color }}
        <cu-color-picker :color="color" model-value="#3b82f6"></cu-color-picker>
      </span>
    </div>
  </VanillaDemo>
</template>
