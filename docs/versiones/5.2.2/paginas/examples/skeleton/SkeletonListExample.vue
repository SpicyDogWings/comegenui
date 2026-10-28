<script setup lang="ts">
// Refleja "Líneas de texto": una lista de filas con avatar, dos líneas y un valor.
import Skeleton from "@/components/information/Skeleton.vue";
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 14px; width: 100%; max-width: 420px">
    <div
      v-for="row in 4"
      :key="row"
      style="display: flex; align-items: center; gap: 12px; min-width: 0"
    >
      <Skeleton shape="circle" width="32px" height="32px" />
      <div style="flex: 1; min-width: 0">
        <Skeleton shape="text" :lines="2" />
      </div>
      <Skeleton width="48px" height="1rem" />
    </div>
  </div>
</template>
