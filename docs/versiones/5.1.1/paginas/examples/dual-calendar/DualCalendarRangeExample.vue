<script setup lang="ts">
import { ref } from "vue";
import DualCalendar from "@/components/controls/DualCalendar.vue";

const inicio = ref<Date | null>(new Date(2026, 8, 5));
const fin = ref<Date | null>(new Date(2026, 8, 20));

function fmt(value: Date | null): string {
  return value ? value.toISOString().slice(0, 10) : "—";
}
</script>

<template>
  <div class="cu-demo-controls">
    <DualCalendar
      v-model:start-date="inicio"
      v-model:end-date="fin"
      color="primary"
    />
  </div>
  <p class="cu-demo-output">
    startDate: {{ fmt(inicio) }} · endDate: {{ fmt(fin) }}
  </p>
</template>
