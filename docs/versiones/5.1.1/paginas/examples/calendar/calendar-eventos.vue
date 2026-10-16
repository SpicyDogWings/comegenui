<script setup lang="ts">
// Refleja el ejemplo "Eventos (puntos)": `events` se pasa como propiedad JS
// (no atributo). `model-value` abre el mes con puntos para que se vean.
const events = [
  { date: "2026-08-03", color: "primary" },
  { date: "2026-08-07", color: "success" },
  { date: "2026-08-11", color: "warning" },
  { date: "2026-08-15", color: "danger" },
  { date: "2026-08-11", color: "primary" },
];
</script>

<template>
  <VanillaDemo :use="['CuCalendar']">
    <cu-calendar model-value="2026-08-11" :events="events"></cu-calendar>
  </VanillaDemo>
</template>
