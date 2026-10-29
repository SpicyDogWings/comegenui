<script setup lang="ts">
// Refleja el ejemplo "Uso en HTML plano": dos textareas y el control por métodos
// (`set`/`get`) del custom element.
import { ref } from "vue";

type CuTextareaElement = HTMLElement & {
  get?: () => string;
  set?: (value: string | number) => void;
};

const comentarios = ref<CuTextareaElement | null>(null);
const salida = ref("(sin llamadas todavía)");

function setear() {
  comentarios.value?.set?.("Texto predefinido");
  salida.value = "set('Texto predefinido')";
}

function leer() {
  salida.value = `get() → ${JSON.stringify(comentarios.value?.get?.())}`;
}
</script>

<template>
  <VanillaDemo :use="['CuTextarea']">
    <cu-textarea placeholder="Escribe aquí..." rows="5" color="primary" variant="outlined"></cu-textarea>
    <cu-textarea ref="comentarios" no-resize variant="soft"></cu-textarea>
    <div class="cu-demo-controls">
      <button type="button" @click="setear">set()</button>
      <button type="button" @click="leer">get()</button>
    </div>
    <pre class="cu-demo-output">{{ salida }}</pre>
  </VanillaDemo>
</template>
