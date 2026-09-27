<script setup lang="ts">
import MonthSlider from "@/components/controls/MonthSlider.vue";
</script>

<template>
  <MonthSlider color="primary" variant="soft" />
  <MonthSlider color="success" variant="solid" />
  <MonthSlider color="warning" variant="outlined" />
  <MonthSlider color="danger" variant="ghost" />
  <MonthSlider
    color="neutral"
    variant="subtle"
    month-format="MMM"
    year-format="yy"
    locale="en"
  />
</template>
