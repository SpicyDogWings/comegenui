<script setup lang="ts">
// Refleja el ejemplo "Colores": los 6 nombres semánticos del trigger y del día seleccionado.
const colors = ["primary", "secondary", "neutral", "success", "warning", "danger"] as const;
</script>

<template>
  <VanillaDemo :use="['CuDatePicker']">
    <cu-date-picker
      v-for="color in colors"
      :key="color"
      :color="color"
      :label="color"
      model-value="2026-08-11"
    ></cu-date-picker>
  </VanillaDemo>
</template>
