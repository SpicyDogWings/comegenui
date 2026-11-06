<script setup lang="ts">
// Refleja el ejemplo "Animación": pulse vs wave vs none, con la misma forma.
import Skeleton from "@/components/information/Skeleton.vue";
</script>

<template>
  <div style="display: flex; flex-wrap: wrap; gap: 12px; width: 100%">
    <div
      v-for="animation in ['pulse', 'wave', 'none'] as const"
      :key="animation"
      style="display: flex; flex: 1 1 120px; flex-direction: column; gap: 6px; min-width: 0"
    >
      <Skeleton :animation="animation" height="2.5rem" />
      <span style="color: var(--cu-color-neutral); font-size: var(--cu-font-size-xs)">{{ animation }}</span>
    </div>
  </div>
</template>
