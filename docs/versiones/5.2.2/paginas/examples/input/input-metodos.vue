<script setup lang="ts">
// Refleja el ejemplo "Métodos": `set`/`get`/`reset`/`focus` del custom element.
import { ref } from "vue";

type CuInputElement = HTMLElement & {
  get?: () => string;
  set?: (value: string | number) => void;
  reset?: () => void;
  focus?: () => void;
};

const campo = ref<CuInputElement | null>(null);
const salida = ref("(sin llamadas todavía)");

function setear() {
  campo.value?.set?.("Valor por API");
  salida.value = "set('Valor por API')";
}

function leer() {
  salida.value = `get() → ${JSON.stringify(campo.value?.get?.())}`;
}

function resetear() {
  campo.value?.reset?.();
  salida.value = "reset() → el campo quedó vacío";
}

function enfocar() {
  campo.value?.focus?.();
  salida.value = "focus() → el input tomó foco";
}
</script>

<template>
  <VanillaDemo :use="['CuInput']">
    <cu-input ref="campo" placeholder="Valor por API"></cu-input>
    <div class="cu-demo-controls">
      <button type="button" @click="setear">set()</button>
      <button type="button" @click="leer">get()</button>
      <button type="button" @click="resetear">reset()</button>
      <button type="button" @click="enfocar">focus()</button>
    </div>
    <pre class="cu-demo-output">{{ salida }}</pre>
  </VanillaDemo>
</template>
