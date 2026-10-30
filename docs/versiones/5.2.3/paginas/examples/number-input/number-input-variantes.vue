<script setup lang="ts">
// Refleja el ejemplo "Variantes": las 4 variantes del campo.
const variants = ["outlined", "soft", "ghost", "subtle"] as const;
</script>

<template>
  <VanillaDemo :use="['CuNumberInput']">
    <cu-number-input
      v-for="variant in variants"
      :key="variant"
      color="primary"
      :variant="variant"
      :placeholder="variant === 'soft' ? 'soft (default)' : variant"
    ></cu-number-input>
  </VanillaDemo>
</template>
