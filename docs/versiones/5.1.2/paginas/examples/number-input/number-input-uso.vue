<script setup lang="ts">
// Refleja el ejemplo "Uso en HTML plano": `steps` se asigna como propiedad JS y
// el valor se controla con `set()`/`increment()`/`get()`.
import { ref, watch } from "vue";

type CuNumberInputElement = HTMLElement & {
  steps?: number[];
  get?: () => number | null;
  set?: (value: number | null) => void;
  increment?: () => void;
};

const cantidad = ref<CuNumberInputElement | null>(null);
const salida = ref("(sin llamadas todavía)");

watch(cantidad, (el) => {
  if (el) el.steps = [1, 2, 5];
});

function setear() {
  cantidad.value?.set?.(4);
  salida.value = "set(4)";
}

function sumar() {
  cantidad.value?.increment?.();
  salida.value = `get() → ${cantidad.value?.get?.()}`;
}
</script>

<template>
  <VanillaDemo :use="['CuNumberInput']">
    <cu-number-input placeholder="Cantidad" color="primary" variant="outlined"></cu-number-input>
    <cu-number-input ref="cantidad" :min="1" :max="10" :step="2" show-step-select></cu-number-input>
    <div class="cu-demo-controls">
      <button type="button" @click="setear">set(4)</button>
      <button type="button" @click="sumar">increment() + get()</button>
    </div>
    <pre class="cu-demo-output">{{ salida }}</pre>
  </VanillaDemo>
</template>
