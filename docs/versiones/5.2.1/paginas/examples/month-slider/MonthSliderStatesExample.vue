<script setup lang="ts">
import MonthSlider from "@/components/controls/MonthSlider.vue";
</script>

<template>
  <MonthSlider color="neutral" disabled />
  <!-- Los chevrons se deshabilitan en los bordes de min/max -->
  <MonthSlider color="primary" min="2026-06-01" max="2026-09-01" />
  <!-- Sin saltos de año: sólo navegación de mes -->
  <MonthSlider color="primary" :year-navigation="false" />
</template>
