<script setup lang="ts">
import Calendar from "@/components/controls/Calendar.vue";

const events = [
  { date: "2026-09-03", color: "primary" },
  { date: "2026-09-07", color: "success" },
  { date: "2026-09-11", color: "warning" },
  { date: "2026-09-15", color: "danger" },
  { date: "2026-09-15", color: "primary" },
];
</script>

<template>
  <!-- disabled: no se puede seleccionar ni navegar -->
  <Calendar color="neutral" disabled />
  <!-- min/max + fines de semana + un feriado deshabilitados -->
  <Calendar
    color="primary"
    min="2026-09-10"
    max="2026-09-30"
    :disabled-weekdays="[0, 6]"
    :disabled-dates="['2026-09-15']"
  />
  <!-- events: puntos bajo las fechas -->
  <Calendar color="primary" :events="events" />
</template>
