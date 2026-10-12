<script setup lang="ts">
// Refleja el ejemplo "Reset": `reset()` limpia el campo (hoy `start-value` no se
// aplica, por eso el valor inicial se setea con `model-value`).
import { ref } from "vue";

type CuInputElement = HTMLElement & { reset?: () => void };

const campo = ref<CuInputElement | null>(null);

function resetear() {
  campo.value?.reset?.();
}
</script>

<template>
  <VanillaDemo :use="['CuInput']">
    <!-- La ficha usa `value="Texto inicial"`; el atributo que aplica el valor es `model-value`. -->
    <cu-input ref="campo" start-value="Texto inicial" model-value="Texto inicial"></cu-input>
    <div class="cu-demo-controls">
      <button type="button" @click="resetear">Resetear</button>
    </div>
  </VanillaDemo>
</template>
