<script setup lang="ts">
import { ref } from "vue";
import MonthSlider from "@/components/controls/MonthSlider.vue";

const mes = ref<Date | null>(new Date(2026, 0, 1));

function fmt(value: Date | null): string {
  if (!value) return "—";
  return `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, "0")}`;
}
</script>

<template>
  <div class="cu-demo-controls">
    <MonthSlider v-model="mes" color="primary" />
  </div>
  <p class="cu-demo-output">modelValue: {{ fmt(mes) }}</p>
</template>
