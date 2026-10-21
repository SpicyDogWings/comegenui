<script setup lang="ts">
// Refleja el ejemplo "Animación": pulse vs wave vs none, con la misma forma.
const animations = ['pulse', 'wave', 'none'] as const;
</script>

<template>
  <VanillaDemo :use="['CuSkeleton']">
    <div style="display: flex; flex-wrap: wrap; gap: 12px; width: 100%">
      <div
        v-for="animation in animations"
        :key="animation"
        style="display: flex; flex: 1 1 120px; flex-direction: column; gap: 6px; min-width: 0"
      >
        <cu-skeleton :animation="animation" height="2.5rem"></cu-skeleton>
        <span style="color: var(--cu-color-neutral); font-size: var(--cu-font-size-xs)">{{ animation }}</span>
      </div>
    </div>
  </VanillaDemo>
</template>
