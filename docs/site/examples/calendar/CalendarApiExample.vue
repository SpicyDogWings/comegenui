<script setup lang="ts">
import { ref } from "vue";
import Calendar from "@/components/controls/Calendar.vue";
import Button from "@/components/buttons/Button.vue";

const single = ref<any>(null);
const range = ref<any>(null);
const log = ref("(usá los botones)");

function fmt(value: Date | null): string {
  return value ? value.toISOString().slice(0, 10) : "null";
}

function getValue() {
  log.value = `getValue() → ${fmt(single.value?.getValue() ?? null)}`;
}

function setValue() {
  single.value?.setValue("2026-12-24");
  log.value = "setValue('2026-12-24')";
}

function goToMonth() {
  single.value?.goToMonth("2026-03-15");
  log.value = "goToMonth('2026-03-15')";
}

function getRange() {
  const r = range.value?.getRange() ?? { start: null, end: null };
  log.value = `getRange() → { ${fmt(r.start)}, ${fmt(r.end)} }`;
}

function setRange() {
  range.value?.setRange("2026-09-05", "2026-09-20");
  log.value = "setRange('2026-09-05', '2026-09-20')";
}

function clearRange() {
  range.value?.clear();
  log.value = "clear()";
}
</script>

<template>
  <!-- API imperativa en modo single -->
  <div class="cu-demo-controls">
    <Button size="sm" variant="outlined" @click="single?.prevMonth()">prevMonth()</Button>
    <Button size="sm" variant="outlined" @click="single?.nextMonth()">nextMonth()</Button>
    <Button size="sm" variant="outlined" @click="goToMonth">goToMonth()</Button>
    <Button size="sm" variant="outlined" @click="getValue">getValue()</Button>
    <Button size="sm" variant="outlined" @click="setValue">setValue()</Button>
  </div>
  <Calendar ref="single" color="primary" />

  <!-- API imperativa en modo range -->
  <div class="cu-demo-controls">
    <Button size="sm" variant="outlined" @click="getRange">getRange()</Button>
    <Button size="sm" variant="outlined" @click="setRange">setRange()</Button>
    <Button size="sm" variant="outlined" @click="clearRange">clear()</Button>
  </div>
  <Calendar ref="range" mode="range" color="primary" />

  <p class="cu-demo-output">{{ log }}</p>
</template>
