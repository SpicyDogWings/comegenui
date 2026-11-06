<script setup lang="ts">
import { ref } from "vue";
import YearSlider from "@/components/controls/YearSlider.vue";
import Button from "@/components/buttons/Button.vue";

const slider = ref<any>(null);
const log = ref("(usá los botones)");

function getValue() {
  log.value = `getValue() → ${slider.value?.getValue()}`;
}

function goToYear() {
  slider.value?.goToYear(2020);
  log.value = "goToYear(2020)";
}

function setValue() {
  slider.value?.setValue("2026");
  log.value = "setValue('2026')";
}
</script>

<template>
  <div class="cu-demo-controls">
    <Button size="sm" variant="outlined" @click="slider?.prevYear()">prevYear()</Button>
    <Button size="sm" variant="outlined" @click="slider?.nextYear()">nextYear()</Button>
    <Button size="sm" variant="outlined" @click="goToYear">goToYear()</Button>
    <Button size="sm" variant="outlined" @click="getValue">getValue()</Button>
    <Button size="sm" variant="outlined" @click="setValue">setValue()</Button>
  </div>
  <YearSlider ref="slider" color="primary" />
  <p class="cu-demo-output">{{ log }}</p>
</template>
