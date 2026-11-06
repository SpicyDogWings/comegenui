<script setup lang="ts">
// Refleja "Colores": los seis colores semánticos.
const colors = ["primary", "secondary", "neutral", "success", "warning", "danger"] as const;
</script>

<template>
  <VanillaDemo :use="['CuLoader']">
    <div v-for="color in colors" :key="color" class="cu-demo-controls">
      <code style="min-width: 72px">{{ color }}</code>
      <div style="position: relative; flex: 1; height: 12px">
        <cu-loader :color="color"></cu-loader>
      </div>
    </div>
  </VanillaDemo>
</template>
