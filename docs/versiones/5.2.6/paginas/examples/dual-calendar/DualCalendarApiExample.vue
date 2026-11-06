<script setup lang="ts">
import { ref } from "vue";
import DualCalendar from "@/components/controls/DualCalendar.vue";
import Button from "@/components/buttons/Button.vue";

const dual = ref<any>(null);
const log = ref("(usá los botones)");

function fmt(value: Date | null): string {
  return value ? value.toISOString().slice(0, 10) : "null";
}

function getStartDate() {
  log.value = `getStartDate() → ${fmt(dual.value?.getStartDate() ?? null)}`;
}

function getEndDate() {
  log.value = `getEndDate() → ${fmt(dual.value?.getEndDate() ?? null)}`;
}

function setRange() {
  dual.value?.setRange("2026-09-05", "2026-09-20");
  log.value = "setRange('2026-09-05', '2026-09-20')";
}

function clear() {
  dual.value?.clear();
  log.value = "clear()";
}
</script>

<template>
  <div class="cu-demo-controls">
    <Button size="sm" variant="outlined" @click="getStartDate">getStartDate()</Button>
    <Button size="sm" variant="outlined" @click="getEndDate">getEndDate()</Button>
    <Button size="sm" variant="outlined" @click="setRange">setRange()</Button>
    <Button size="sm" variant="outlined" @click="clear">clear()</Button>
  </div>
  <DualCalendar ref="dual" color="primary" />
  <p class="cu-demo-output">{{ log }}</p>
</template>
