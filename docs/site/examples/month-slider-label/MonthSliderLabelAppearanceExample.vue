<script setup lang="ts">
import MonthSliderLabel from "@/components/controls/month-slider/MonthSliderLabel.vue";
</script>

<template>
  <MonthSliderLabel label="Septiembre" year="2026" color="primary" variant="soft" />
  <MonthSliderLabel label="Octubre" year="2026" color="success" variant="solid" />
  <MonthSliderLabel label="Noviembre" year="2026" color="warning" variant="outlined" />
  <MonthSliderLabel label="Diciembre" color="danger" variant="ghost" />
  <MonthSliderLabel label="2026" color="neutral" variant="subtle" />
</template>
