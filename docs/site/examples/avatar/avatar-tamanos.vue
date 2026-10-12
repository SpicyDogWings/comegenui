<script setup lang="ts">
// Refleja el ejemplo "Tamaños": sm, md y lg.
const sizes = ["sm", "md", "lg"] as const;
</script>

<template>
  <VanillaDemo :use="['CuAvatar']">
    <div class="cu-demo-controls">
      <cu-avatar v-for="size in sizes" :key="size" initials="A" :size="size"></cu-avatar>
    </div>
  </VanillaDemo>
</template>
