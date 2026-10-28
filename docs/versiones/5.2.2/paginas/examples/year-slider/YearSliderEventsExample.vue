<script setup lang="ts">
import { ref } from "vue";
import YearSlider from "@/components/controls/YearSlider.vue";

const anio = ref<number | null>(2026);
const log = ref("(usá los chevrons)");

function onUpdate(value: number) {
  anio.value = value;
  log.value = `update:modelValue → ${value}`;
}

function onChange(value: number) {
  log.value = `change → ${value}`;
}
</script>

<template>
  <div class="cu-demo-controls">
    <YearSlider
      :model-value="anio"
      color="primary"
      @update:model-value="onUpdate"
      @change="onChange"
    />
  </div>
  <p class="cu-demo-output">{{ log }}</p>
</template>
