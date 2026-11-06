<script setup lang="ts">
import DualCalendar from "@/components/controls/DualCalendar.vue";
</script>

<template>
  <DualCalendar
    color="primary"
    variant="outlined"
    grid
    border
    year-navigation
    month-format="MMM"
    year-format="yy"
    locale="es"
    :week-start="0"
  />
</template>
