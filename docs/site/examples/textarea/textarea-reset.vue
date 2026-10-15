<script setup lang="ts">
// Refleja el ejemplo "Métodos": `focus()` y `reset()` (que limpia el campo; hoy
// `start-value` no se aplica, por eso el valor inicial se setea con `model-value`).
import { ref } from "vue";

type CuTextareaElement = HTMLElement & { reset?: () => void; focus?: () => void };

const notas = ref<CuTextareaElement | null>(null);
</script>

<template>
  <VanillaDemo :use="['CuTextarea']">
    <cu-textarea ref="notas" model-value="Plantilla inicial"></cu-textarea>
    <div class="cu-demo-controls">
      <button type="button" @click="notas?.focus?.()">focus()</button>
      <button type="button" @click="notas?.reset?.()">reset()</button>
    </div>
  </VanillaDemo>
</template>
