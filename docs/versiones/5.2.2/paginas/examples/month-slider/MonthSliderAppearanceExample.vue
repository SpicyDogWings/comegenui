<script setup lang="ts">
import MonthSlider from "@/components/controls/MonthSlider.vue";

const colors = ["primary", "secondary", "neutral", "success", "warning", "danger"] as const;
const variants = ["solid", "outlined", "soft", "ghost", "subtle"] as const;
const monthFormats = ["MMMM", "MMM", "MM", "M"] as const;
</script>

<template>
  <!-- Colores: los 6 nombres semánticos -->
  <MonthSlider v-for="color in colors" :key="color" :color="color" variant="soft" />

  <!-- Variantes: las 5, con color primary -->
  <MonthSlider v-for="variant in variants" :key="variant" color="primary" :variant="variant" />

  <!-- monthFormat: MMMM (default), MMM, MM y M -->
  <div v-for="format in monthFormats" :key="format" class="cu-demo-controls">
    <code style="min-width: 150px">monthFormat="{{ format }}"</code>
    <MonthSlider color="primary" :month-format="format" />
  </div>

  <!-- yearFormat: el badge del año sólo aparece cuando el mes no es del año actual -->
  <div class="cu-demo-controls">
    <code style="min-width: 150px">yearFormat="yyyy"</code>
    <MonthSlider color="primary" model-value="2024-07-01" year-format="yyyy" />
  </div>
  <div class="cu-demo-controls">
    <code style="min-width: 150px">yearFormat="yy"</code>
    <MonthSlider color="primary" model-value="2024-07-01" year-format="yy" />
  </div>

  <!-- locale: nombres de mes en otro idioma -->
  <div class="cu-demo-controls">
    <code style="min-width: 150px">locale="en"</code>
    <MonthSlider color="primary" locale="en" />
  </div>
</template>
