<script setup lang="ts">
// Refleja "Card completa": media + título + tres líneas + acciones, con el tamaño real.
</script>

<template>
  <VanillaDemo :use="['CuSkeleton']">
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
      <cu-skeleton height="140px" radius="lg"></cu-skeleton>
      <div style="display: flex; flex-direction: column; gap: 10px; margin-top: 12px">
        <cu-skeleton shape="text" width="65%" height="1.25rem"></cu-skeleton>
        <cu-skeleton shape="text" lines="3"></cu-skeleton>
      </div>
      <div style="display: flex; gap: 8px; margin-top: 16px">
        <cu-skeleton width="96px" height="2rem"></cu-skeleton>
        <cu-skeleton width="96px" height="2rem"></cu-skeleton>
      </div>
    </div>
  </VanillaDemo>
</template>
