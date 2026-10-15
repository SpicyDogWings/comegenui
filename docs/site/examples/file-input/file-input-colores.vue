<script setup lang="ts">
// Refleja el ejemplo "Colores": los 6 nombres semánticos, con variant outlined.
const colors = ["primary", "secondary", "neutral", "success", "warning", "danger"] as const;
</script>

<template>
  <VanillaDemo :use="['CuFileInput']">
    <div class="cu-demo-controls">
      <cu-file-input
        v-for="color in colors"
        :key="color"
        :color="color"
        variant="outlined"
        :placeholder="color"
      />
    </div>
  </VanillaDemo>
</template>
