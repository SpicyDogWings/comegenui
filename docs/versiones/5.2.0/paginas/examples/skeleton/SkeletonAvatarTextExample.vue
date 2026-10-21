<script setup lang="ts">
// Refleja el ejemplo "Forma": avatar circular + líneas de texto.
import Skeleton from "@/components/information/Skeleton.vue";
</script>

<template>
  <div style="display: flex; align-items: center; gap: 12px; width: 100%; max-width: 420px">
    <Skeleton shape="circle" />
    <div style="flex: 1; min-width: 0">
      <Skeleton shape="text" :lines="3" />
    </div>
  </div>
</template>
