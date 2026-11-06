<script setup lang="ts">
// Refleja el ejemplo "Forma": avatar circular + líneas de texto.
</script>

<template>
  <VanillaDemo :use="['CuSkeleton']">
    <div style="display: flex; align-items: center; gap: 12px; width: 100%; max-width: 420px">
      <cu-skeleton shape="circle"></cu-skeleton>
      <div style="flex: 1; min-width: 0">
        <cu-skeleton shape="text" lines="3"></cu-skeleton>
      </div>
    </div>
  </VanillaDemo>
</template>
