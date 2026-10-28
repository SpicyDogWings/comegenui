<script setup lang="ts">
// Refleja "Color y radio": los seis colores semánticos y los cinco radios.
import Skeleton from "@/components/information/Skeleton.vue";
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 16px; width: 100%">
    <div style="display: flex; flex-wrap: wrap; gap: 10px">
      <Skeleton
        v-for="color in ['primary', 'secondary', 'neutral', 'success', 'warning', 'danger'] as const"
        :key="color"
        :color="color"
        width="4rem"
      />
    </div>
    <div style="display: flex; flex-wrap: wrap; gap: 10px">
      <Skeleton
        v-for="radius in ['none', 'sm', 'md', 'lg', 'full'] as const"
        :key="radius"
        :radius="radius"
        width="4rem"
        height="2.5rem"
      />
    </div>
  </div>
</template>
