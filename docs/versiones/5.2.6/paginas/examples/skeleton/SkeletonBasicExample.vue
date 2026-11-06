<script setup lang="ts">
// Refleja el ejemplo "Uso en Vue": un bloque rect a ancho parcial y otro completo.
import Skeleton from "@/components/information/Skeleton.vue";
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 12px; width: 100%; max-width: 420px">
    <Skeleton width="60%" height="2rem" />
    <Skeleton />
  </div>
</template>
