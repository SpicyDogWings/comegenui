<script setup lang="ts">
import { ref } from "vue";
import YearSlider from "@/components/controls/YearSlider.vue";

const anio = ref<number | null>(2026);
</script>

<template>
  <div class="cu-demo-controls">
    <YearSlider v-model="anio" color="primary" />
  </div>
  <p class="cu-demo-output">modelValue: {{ anio ?? "—" }}</p>
</template>
