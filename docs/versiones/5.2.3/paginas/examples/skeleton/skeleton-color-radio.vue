<script setup lang="ts">
// Refleja "Color y radio": los seis colores semánticos y los cinco radios.
const colors = ['primary', 'secondary', 'neutral', 'success', 'warning', 'danger'] as const;
const radii = ['none', 'sm', 'md', 'lg', 'full'] as const;
</script>

<template>
  <VanillaDemo :use="['CuSkeleton']">
    <div style="display: flex; flex-direction: column; gap: 16px; width: 100%">
      <div style="display: flex; flex-wrap: wrap; gap: 10px">
        <cu-skeleton v-for="color in colors" :key="color" :color="color" width="4rem"></cu-skeleton>
      </div>
      <div style="display: flex; flex-wrap: wrap; gap: 10px">
        <cu-skeleton
          v-for="radius in radii"
          :key="radius"
          :radius="radius"
          width="4rem"
          height="2.5rem"
        ></cu-skeleton>
      </div>
    </div>
  </VanillaDemo>
</template>
