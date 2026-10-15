<script setup lang="ts">
// Refleja el ejemplo "Tamaños": `size` se propaga al avatar interno.
const sizes = ["sm", "md", "lg"] as const;
</script>

<template>
  <VanillaDemo :use="['CuAuthorCard']">
    <div class="cu-demo-controls">
      <cu-author-card
        v-for="size in sizes"
        :key="size"
        name="Ana Pérez"
        role="Desarrolladora"
        color="primary"
        :size="size"
      ></cu-author-card>
    </div>
  </VanillaDemo>
</template>
