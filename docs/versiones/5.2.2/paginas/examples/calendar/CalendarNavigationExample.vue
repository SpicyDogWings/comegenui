<script setup lang="ts">
import { ref } from "vue";
import Calendar from "@/components/controls/Calendar.vue";

const mes = ref<Date | null>(new Date(2026, 8, 1));

function fmt(value: Date | null): string {
  return value ? value.toISOString().slice(0, 10) : "—";
}
</script>

<template>
  <div class="cu-demo-controls">
    <!-- viewMonth controlado: navegar emite update:viewMonth -->
    <Calendar
      v-model:view-month="mes"
      color="primary"
      year-navigation
      month-format="MMM"
      year-format="yy"
      locale="es"
      :week-start="0"
    />
  </div>
  <p class="cu-demo-output">viewMonth: {{ fmt(mes) }}</p>
</template>
