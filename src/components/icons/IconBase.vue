<script setup lang="ts">
withDefaults(defineProps<{
  width?: number | string
  height?: number | string
}>(), {
  width: '1em',
  height: '1em',
})
</script>

<template>
  <svg xmlns="http://www.w3.org/2000/svg" :width="width" :height="height" viewBox="0 0 24 24">
    <slot />
  </svg>
</template>
