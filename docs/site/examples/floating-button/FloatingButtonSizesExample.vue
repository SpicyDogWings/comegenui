<script setup lang="ts">
import FloatingButton from "@/components/buttons/FloatingButton.vue";
</script>

<template>
  <div style="position: relative; height: 120px; width: 100%">
    <FloatingButton size="sm" color="success" style="position: absolute; bottom: 16px; right: calc(16px + 64px)">sm</FloatingButton>
    <FloatingButton style="position: absolute; bottom: 16px; right: 16px">md</FloatingButton>
  </div>
</template>
