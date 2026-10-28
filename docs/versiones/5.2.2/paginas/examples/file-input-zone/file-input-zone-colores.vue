<script setup lang="ts">
// Refleja el ejemplo "Colores": los 6 nombres semánticos de la zona.
const colors = ["primary", "secondary", "neutral", "success", "warning", "danger"] as const;
</script>

<template>
  <VanillaDemo :use="['CuFileInputZone']">
    <div class="cu-demo-controls">
      <cu-file-input-zone
        v-for="color in colors"
        :key="color"
        :color="color"
        :placeholder="color"
      />
    </div>
  </VanillaDemo>
</template>
