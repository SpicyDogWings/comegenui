<script setup lang="ts">
// Refleja el ejemplo "Uso en HTML plano": el switch y el control por métodos
// (`set`/`get`/`reset`) del custom element.
import { ref } from "vue";

type CuSwitchElement = HTMLElement & {
  get?: () => boolean;
  set?: (value: boolean) => void;
  reset?: () => void;
};

const sw = ref<CuSwitchElement | null>(null);
const salida = ref("(sin llamadas todavía)");

function encender() {
  sw.value?.set?.(true);
  salida.value = `set(true) → get() = ${JSON.stringify(sw.value?.get?.())}`;
}

function apagar() {
  sw.value?.reset?.();
  salida.value = `reset() → get() = ${JSON.stringify(sw.value?.get?.())}`;
}

function leer() {
  salida.value = `get() → ${JSON.stringify(sw.value?.get?.())}`;
}
</script>

<template>
  <VanillaDemo :use="['CuSwitch']">
    <cu-switch ref="sw" color="primary" size="md"></cu-switch>
    <div class="cu-demo-controls">
      <button type="button" @click="encender">set(true)</button>
      <button type="button" @click="apagar">reset()</button>
      <button type="button" @click="leer">get()</button>
    </div>
    <pre class="cu-demo-output">{{ salida }}</pre>
  </VanillaDemo>
</template>
