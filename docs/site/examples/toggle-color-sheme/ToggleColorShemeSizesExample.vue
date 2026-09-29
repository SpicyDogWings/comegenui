<script setup lang="ts">
import ToggleColorSheme from "@/components/buttons/ToggleColorSheme.vue";

const sizes = [16, 24, 32, 40];
</script>

<template>
  <div class="cu-demo-controls">
    <ToggleColorSheme v-for="size in sizes" :key="size" variant="outlined" :size="size" />
  </div>
</template>
