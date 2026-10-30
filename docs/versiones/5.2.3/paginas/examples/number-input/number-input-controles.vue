<script setup lang="ts">
// Refleja el ejemplo "Controles": con y sin botones − / +.
import { ref, watch } from "vue";

const sinControles = ref<HTMLElement | null>(null);

watch(sinControles, (el) => {
  if (el) (el as HTMLElement & { showControls?: boolean }).showControls = false;
});
</script>

<template>
  <VanillaDemo :use="['CuNumberInput']">
    <cu-number-input placeholder="con controles"></cu-number-input>
    <cu-number-input ref="sinControles" placeholder="sin controles"></cu-number-input>
  </VanillaDemo>
</template>
