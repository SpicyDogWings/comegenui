<script setup lang="ts">
// Refleja el ejemplo "Variantes": outlined, soft (default), ghost y subtle del trigger.
const variants = ["outlined", "soft", "ghost", "subtle"] as const;
</script>

<template>
  <VanillaDemo :use="['CuDatePicker']">
    <cu-date-picker
      v-for="variant in variants"
      :key="variant"
      :variant="variant"
      :label="variant"
      color="primary"
      model-value="2026-08-11"
    ></cu-date-picker>
  </VanillaDemo>
</template>
