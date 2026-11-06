<script setup lang="ts">
// Refleja el ejemplo "Colores": los 6 nombres semánticos, marcados.
const colors = ["primary", "secondary", "neutral", "success", "warning", "danger"] as const;
</script>

<template>
  <VanillaDemo :use="['CuCheckbox']">
    <div class="cu-demo-controls">
      <cu-checkbox
        v-for="color in colors"
        :key="color"
        :color="color"
        :label="color"
        :model-value="true"
      ></cu-checkbox>
    </div>
  </VanillaDemo>
</template>
