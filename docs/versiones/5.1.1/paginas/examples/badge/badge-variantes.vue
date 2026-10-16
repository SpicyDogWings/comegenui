<script setup lang="ts">
// Refleja el ejemplo "Variantes visuales": las 5 variantes con color primary.
const variants = ["solid", "outlined", "soft", "ghost", "subtle"] as const;
</script>

<template>
  <VanillaDemo :use="['CuBadge']">
    <div class="cu-demo-controls">
      <cu-badge v-for="variant in variants" :key="variant" color="primary" :variant="variant">
        {{ variant }}
      </cu-badge>
    </div>
  </VanillaDemo>
</template>
