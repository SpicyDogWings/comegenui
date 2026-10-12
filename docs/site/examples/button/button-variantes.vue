<script setup lang="ts">
// Refleja el ejemplo "Variantes": las 6 variantes con color primary.
const variants = ["solid", "outlined", "soft", "ghost", "subtle", "link"] as const;
</script>

<template>
  <VanillaDemo :use="['CuButton']">
    <div class="cu-demo-controls">
      <cu-button v-for="variant in variants" :key="variant" color="primary" :variant="variant">
        {{ variant }}
      </cu-button>
    </div>
  </VanillaDemo>
</template>
