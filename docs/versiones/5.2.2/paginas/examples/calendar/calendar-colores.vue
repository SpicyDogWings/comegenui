<script setup lang="ts">
// Refleja el ejemplo "Colores": los 6 nombres semánticos del día seleccionado.
const colors = ["primary", "secondary", "neutral", "success", "warning", "danger"] as const;
</script>

<template>
  <VanillaDemo :use="['CuCalendar']">
    <cu-calendar
      v-for="color in colors"
      :key="color"
      :color="color"
      model-value="2026-08-11"
    ></cu-calendar>
  </VanillaDemo>
</template>
