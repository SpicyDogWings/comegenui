<script setup lang="ts">
import Badge from "./components/Badge.vue";
import BadgeCe from "./components/Badge.ce.vue";
const color = "#59B292";
</script>

<template>
  <div class="min-h-screen flex flex-col items-center justify-center gap-4">
    <div class="flex gap-2">
      <Badge variant="solid" :color="color">Badge</Badge>
      <Badge variant="outlined" :color="color">Badge</Badge>
      <Badge variant="soft" :color="color">Badge</Badge>
      <Badge :color="color">Badge</Badge>
    </div>
    <div class="flex gap-2">
      <BadgeCe variant="solid" color="primary">Primary</BadgeCe>
      <BadgeCe variant="outlined" color="success">Success</BadgeCe>
      <BadgeCe variant="soft" color="warning">Warning</BadgeCe>
      <BadgeCe color="danger">Danger</BadgeCe>
      <BadgeCe variant="subtle" color="neutral">Neutral</BadgeCe>
    </div>
  </div>
</template>

<style>
@unocss-placeholder;
</style>
