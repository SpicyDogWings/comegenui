<script setup lang="ts">
// Refleja el ejemplo "Tamaños": el tamaño alcanza campo, botones y select.
const sizes = ["sm", "md", "lg"] as const;
</script>

<template>
  <VanillaDemo :use="['CuNumberInput']">
    <cu-number-input
      v-for="size in sizes"
      :key="size"
      :size="size"
      :placeholder="size === 'md' ? 'md (default)' : size"
    ></cu-number-input>
  </VanillaDemo>
</template>
