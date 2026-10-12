<script setup lang="ts">
// Refleja el ejemplo "Reset": `reset()` limpia el textarea (hoy `start-value` no se
// aplica, por eso el valor inicial se setea con `model-value`).
import { ref } from "vue";

type CuTextareaElement = HTMLElement & { reset?: () => void };

const notas = ref<CuTextareaElement | null>(null);

function restaurar() {
  notas.value?.reset?.();
}
</script>

<template>
  <VanillaDemo :use="['CuTextarea']">
    <cu-textarea ref="notas" start-value="Plantilla inicial" model-value="Plantilla inicial"></cu-textarea>
    <div class="cu-demo-controls">
      <button type="button" @click="restaurar">Restaurar plantilla</button>
    </div>
  </VanillaDemo>
</template>
