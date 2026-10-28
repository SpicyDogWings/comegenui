<script setup lang="ts">
import { ref } from "vue";
import MonthSlider from "@/components/controls/MonthSlider.vue";
import Button from "@/components/buttons/Button.vue";

const slider = ref<any>(null);
const log = ref("(usá los botones)");

function fmt(value: Date): string {
  return `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, "0")}`;
}

function getValue() {
  log.value = `getValue() → ${fmt(slider.value?.getValue())}`;
}
</script>

<template>
  <div class="cu-demo-controls">
    <Button size="sm" variant="outlined" @click="slider?.prevMonth()">prevMonth()</Button>
    <Button size="sm" variant="outlined" @click="slider?.nextMonth()">nextMonth()</Button>
    <Button size="sm" variant="outlined" @click="slider?.prevYear()">prevYear()</Button>
    <Button size="sm" variant="outlined" @click="slider?.nextYear()">nextYear()</Button>
    <Button size="sm" variant="outlined" @click="slider?.goToMonth('2026-03-15')">
      goToMonth()
    </Button>
    <Button size="sm" variant="outlined" @click="getValue">getValue()</Button>
    <Button size="sm" variant="outlined" @click="slider?.setValue('2026-12-01')">
      setValue()
    </Button>
  </div>
  <MonthSlider ref="slider" color="primary" />
  <p class="cu-demo-output">{{ log }}</p>
</template>
