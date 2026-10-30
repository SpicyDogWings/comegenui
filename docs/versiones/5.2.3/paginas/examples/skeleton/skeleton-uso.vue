<script setup lang="ts">
// Refleja el ejemplo "Uso en HTML plano": un bloque rect a ancho parcial y otro completo.
</script>

<template>
  <VanillaDemo :use="['CuSkeleton']">
    <div style="display: flex; flex-direction: column; gap: 12px; width: 100%; max-width: 420px">
      <cu-skeleton width="60%" height="2rem"></cu-skeleton>
      <cu-skeleton></cu-skeleton>
    </div>
  </VanillaDemo>
</template>
