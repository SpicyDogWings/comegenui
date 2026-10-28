<script setup lang="ts">
// Refleja el ejemplo "Colores": los 6 colores semánticos.
const colors = ["primary", "secondary", "neutral", "success", "warning", "danger"] as const;
</script>

<template>
  <VanillaDemo :use="['CuButton', 'CuTooltip']">
    <div class="cu-demo-controls">
      <cu-tooltip v-for="color in colors" :key="color" :text="color" :color="color">
        <cu-button variant="outlined">{{ color }}</cu-button>
      </cu-tooltip>
    </div>
  </VanillaDemo>
</template>
