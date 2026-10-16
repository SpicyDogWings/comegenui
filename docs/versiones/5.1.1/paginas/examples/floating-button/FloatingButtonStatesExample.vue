<script setup lang="ts">
import FloatingButton from "@/components/buttons/FloatingButton.vue";
</script>

<template>
  <div style="position: relative; height: 150px; width: 100%">
    <FloatingButton variant="outlined" color="primary" size="sm" style="position: absolute; bottom: 16px; right: 16px">A</FloatingButton>
    <FloatingButton variant="soft" color="neutral" size="sm" disabled style="position: absolute; bottom: 16px; right: calc(16px + 56px)">B</FloatingButton>
    <FloatingButton variant="solid" color="neutral" size="sm" loading style="position: absolute; bottom: 16px; right: calc(16px + 112px)">C</FloatingButton>
  </div>
</template>
