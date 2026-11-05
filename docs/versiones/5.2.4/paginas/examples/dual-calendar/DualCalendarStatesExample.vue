<script setup lang="ts">
import DualCalendar from "@/components/controls/DualCalendar.vue";

const events = [
  { date: "2026-09-08", color: "primary" },
  { date: "2026-09-18", color: "danger" },
];
</script>

<template>
  <DualCalendar
    color="neutral"
    variant="soft"
    min="2026-09-01"
    max="2026-09-30"
    :disabled-weekdays="[0, 6]"
    :disabled-dates="['2026-09-15']"
    :events="events"
  />
  <DualCalendar color="neutral" disabled />
</template>
