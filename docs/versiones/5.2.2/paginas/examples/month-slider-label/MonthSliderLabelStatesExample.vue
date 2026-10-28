<script setup lang="ts">
import MonthSliderLabel from "@/components/controls/month-slider/MonthSliderLabel.vue";
</script>

<template>
  <MonthSliderLabel label="Deshabilitado" year="2026" color="neutral" disabled />
  <!-- Sin drag: queda como texto (role group, sin pointer events de navegación) -->
  <MonthSliderLabel label="Sin drag" year="2026" color="primary" :draggable="false" />
  <!-- En los bordes no navega hacia el lado bloqueado -->
  <MonthSliderLabel
    label="Borde"
    year="2026"
    color="primary"
    :can-navigate-prev="false"
    :can-navigate-next="false"
  />
</template>
