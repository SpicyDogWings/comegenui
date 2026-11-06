<script setup lang="ts">
import YearSlider from "@/components/controls/YearSlider.vue";
</script>

<template>
  <YearSlider color="neutral" disabled />
  <!-- min/max deshabilitan los chevrons en los bordes -->
  <YearSlider color="primary" :min="2024" :max="2026" />
</template>
