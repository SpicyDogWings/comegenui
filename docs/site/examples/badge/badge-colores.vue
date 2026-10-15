<script setup lang="ts">
// Refleja el ejemplo "Colores": los 6 nombres semánticos con la variante soft.
const colors = ["primary", "secondary", "neutral", "success", "warning", "danger"] as const;
</script>

<template>
  <VanillaDemo :use="['CuBadge']">
    <div class="cu-demo-controls">
      <cu-badge v-for="color in colors" :key="color" :color="color" variant="soft">
        {{ color }}
      </cu-badge>
    </div>
  </VanillaDemo>
</template>
