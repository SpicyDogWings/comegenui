<script setup lang="ts">
// Refleja el ejemplo "Colores": los 6 nombres semánticos.
const colors = ["primary", "secondary", "neutral", "success", "warning", "danger"] as const;
</script>

<template>
  <VanillaDemo :use="['CuAuthorCard']">
    <div class="cu-demo-controls">
      <cu-author-card
        v-for="color in colors"
        :key="color"
        name="Ana Pérez"
        role="Rol del autor"
        :color="color"
      ></cu-author-card>
    </div>
  </VanillaDemo>
</template>
