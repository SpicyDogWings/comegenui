<script setup lang="ts">
// Refleja "Card completa": media + título + tres líneas + acciones, con el tamaño real.
import Skeleton from "@/components/information/Skeleton.vue";
</script>

<template>
  <div
    style="
      width: 100%;
      max-width: 360px;
      padding: 16px;
      border: 1px solid var(--cu-border-color);
      border-radius: var(--cu-radius-lg);
      background-color: var(--cu-color-surface);
    "
  >
    <Skeleton height="140px" radius="lg" />
    <div style="display: flex; flex-direction: column; gap: 10px; margin-top: 12px">
      <Skeleton shape="text" width="65%" height="1.25rem" />
      <Skeleton shape="text" :lines="3" />
    </div>
    <div style="display: flex; gap: 8px; margin-top: 16px">
      <Skeleton width="96px" height="2rem" />
      <Skeleton width="96px" height="2rem" />
    </div>
  </div>
</template>
