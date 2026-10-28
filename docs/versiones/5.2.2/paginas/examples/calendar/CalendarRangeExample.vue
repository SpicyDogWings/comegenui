<script setup lang="ts">
import { ref } from "vue";
import Calendar from "@/components/controls/Calendar.vue";

const inicio = ref<Date | null>(null);
const fin = ref<Date | null>(null);

function fmt(value: Date | null): string {
  return value ? value.toISOString().slice(0, 10) : "—";
}
</script>

<template>
  <div class="cu-demo-controls">
    <Calendar
      v-model:range-start="inicio"
      v-model:range-end="fin"
      mode="range"
      color="primary"
    />
  </div>
  <p class="cu-demo-output">
    rangeStart: {{ fmt(inicio) }} · rangeEnd: {{ fmt(fin) }}
  </p>
</template>
