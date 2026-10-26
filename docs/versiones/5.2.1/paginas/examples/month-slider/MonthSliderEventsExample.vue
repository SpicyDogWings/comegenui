<script setup lang="ts">
import { ref } from "vue";
import MonthSlider from "@/components/controls/MonthSlider.vue";

const mes = ref<Date | null>(new Date(2026, 0, 1));
const log = ref("(usá los chevrons o arrastrá el label)");

function fmt(value: Date): string {
  return `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, "0")}`;
}

function onUpdate(value: Date) {
  mes.value = value;
  log.value = `update:modelValue → ${fmt(value)}`;
}

function onChange(value: Date) {
  log.value = `change → ${fmt(value)}`;
}
</script>

<template>
  <div class="cu-demo-controls">
    <MonthSlider
      :model-value="mes"
      color="primary"
      @update:model-value="onUpdate"
      @change="onChange"
    />
  </div>
  <p class="cu-demo-output">{{ log }}</p>
</template>
