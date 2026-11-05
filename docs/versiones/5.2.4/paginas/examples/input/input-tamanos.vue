<script setup lang="ts">
// Refleja el ejemplo "Tamaños".
const sizes = ["sm", "md", "lg"] as const;
</script>

<template>
  <VanillaDemo :use="['CuInput']">
    <cu-input
      v-for="size in sizes"
      :key="size"
      :size="size"
      :placeholder="size === 'md' ? 'md (default)' : size"
    ></cu-input>
  </VanillaDemo>
</template>
