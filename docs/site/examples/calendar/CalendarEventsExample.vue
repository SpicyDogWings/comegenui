<script setup lang="ts">
import { ref } from "vue";
import Calendar from "@/components/controls/Calendar.vue";

interface Range {
  start: Date | null;
  end: Date | null;
}

const fecha = ref<Date | null>(null);
const log = ref("(tocá un día)");

function fmt(value: unknown): string {
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  if (value && typeof value === "object" && "start" in value) {
    const range = value as Range;
    const start = range.start ? range.start.toISOString().slice(0, 10) : "null";
    const end = range.end ? range.end.toISOString().slice(0, 10) : "null";
    return `{ ${start}, ${end} }`;
  }
  return String(value);
}

function onUpdateModelValue(value: Date) {
  fecha.value = value;
  log.value = `update:modelValue → ${fmt(value)}`;
}

function onChange(value: unknown) {
  log.value = `change → ${fmt(value)}`;
}

function onSelect(value: unknown) {
  log.value = `select → ${fmt(value)}`;
}
</script>

<template>
  <div class="cu-demo-controls">
    <Calendar
      :model-value="fecha"
      color="primary"
      @update:model-value="onUpdateModelValue"
      @change="onChange"
      @select="onSelect"
    />
  </div>
  <p class="cu-demo-output">{{ log }}</p>
</template>
