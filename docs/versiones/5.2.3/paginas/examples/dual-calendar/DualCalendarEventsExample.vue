<script setup lang="ts">
import { ref } from "vue";
import DualCalendar from "@/components/controls/DualCalendar.vue";

interface Range {
  start: Date | null;
  end: Date | null;
}

const log = ref("(elegí inicio y fin)");

function fmt(value: Date | null): string {
  return value ? value.toISOString().slice(0, 10) : "null";
}

function onEvent(name: string, value: Range) {
  log.value = `${name} → { ${fmt(value.start)}, ${fmt(value.end)} }`;
}
</script>

<template>
  <div class="cu-demo-controls">
    <DualCalendar
      color="primary"
      @change="(value) => onEvent('change', value)"
      @select="(value) => onEvent('select', value)"
    />
  </div>
  <p class="cu-demo-output">{{ log }}</p>
</template>
