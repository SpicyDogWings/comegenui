<script setup lang="ts">
// Refleja el ejemplo "Paso": `step` fijo y `steps` custom por propiedad JS.
import { ref, watch } from "vue";

type CuNumberInputElement = HTMLElement & { steps?: number[] };

const pasos = ref<CuNumberInputElement | null>(null);

watch(pasos, (el) => {
  if (el) el.steps = [2, 4, 8];
});
</script>

<template>
  <VanillaDemo :use="['CuNumberInput']">
    <cu-number-input :step="1" placeholder="paso 1"></cu-number-input>
    <cu-number-input :step="5" placeholder="paso 5"></cu-number-input>
    <cu-number-input :step="10" show-step-select placeholder="paso 10 + select"></cu-number-input>
    <cu-number-input ref="pasos" show-step-select placeholder="steps custom"></cu-number-input>
  </VanillaDemo>
</template>
