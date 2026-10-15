<script setup lang="ts">
// Refleja el ejemplo "Variantes": las 4 variantes con color `primary`.
const variants = ["outlined", "soft", "ghost", "subtle"] as const;
</script>

<template>
  <VanillaDemo :use="['CuInput']">
    <cu-input
      v-for="variant in variants"
      :key="variant"
      color="primary"
      :variant="variant"
      :placeholder="variant"
    ></cu-input>
  </VanillaDemo>
</template>
