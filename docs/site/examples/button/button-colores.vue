<script setup lang="ts">
// Refleja el ejemplo "Colores": los 6 nombres semánticos con la variante solid.
const colors = ["primary", "secondary", "neutral", "success", "warning", "danger"] as const;
</script>

<template>
  <VanillaDemo :use="['CuButton']">
    <div class="cu-demo-controls">
      <cu-button v-for="color in colors" :key="color" :color="color" variant="solid">
        {{ color }}
      </cu-button>
    </div>
  </VanillaDemo>
</template>
