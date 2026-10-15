<script setup lang="ts">
import MonthSliderLabel from "@/components/controls/month-slider/MonthSliderLabel.vue";

const colors = ["primary", "secondary", "neutral", "success", "warning", "danger"] as const;
const variants = ["solid", "outlined", "soft", "ghost", "subtle"] as const;
</script>

<template>
  <!-- Colores: los 6 nombres semánticos -->
  <MonthSliderLabel
    v-for="color in colors"
    :key="color"
    :label="color"
    year="2024"
    :color="color"
    variant="soft"
  />

  <!-- Variantes: las 5, con color primary -->
  <MonthSliderLabel
    v-for="variant in variants"
    :key="variant"
    label="Septiembre"
    year="2024"
    color="primary"
    :variant="variant"
  />

  <!-- `year` es opcional: sin él no se muestra el badge del año -->
  <MonthSliderLabel label="Diciembre" color="neutral" variant="subtle" />
</template>
