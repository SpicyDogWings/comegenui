<script setup lang="ts">
// Refleja el ejemplo "Tamaños".
const sizes = ["sm", "md", "lg"] as const;
</script>

<template>
  <VanillaDemo :use="['CuButton']">
    <div class="cu-demo-controls">
      <cu-button v-for="size in sizes" :key="size" :size="size">
        {{ size === "md" ? "Medio (default)" : size === "sm" ? "Chico" : "Grande" }}
      </cu-button>
    </div>
  </VanillaDemo>
</template>
