<script setup lang="ts">
import { ref } from "vue";
import Calendar from "@/components/controls/Calendar.vue";

const fecha = ref<Date | null>(null);

function fmt(value: Date | null): string {
  return value ? value.toISOString().slice(0, 10) : "—";
}
</script>

<template>
  <div class="cu-demo-controls">
    <Calendar v-model="fecha" color="primary" />
  </div>
  <p class="cu-demo-output">modelValue: {{ fmt(fecha) }}</p>
</template>
