<script setup lang="ts">
// Refleja el ejemplo "Control programático": `set`/`reset`/`focus`/`get`.
import { ref } from "vue";

type CuCheckboxElement = HTMLElement & {
  get?: () => boolean;
  set?: (value: boolean) => void;
  reset?: () => void;
  focus?: () => void;
};

const chk = ref<CuCheckboxElement | null>(null);
const salida = ref("(sin llamadas todavía)");

function leer() {
  salida.value = `get() → ${JSON.stringify(chk.value?.get?.())}`;
}

function setear(valor: boolean) {
  chk.value?.set?.(valor);
  leer();
}

function resetear() {
  chk.value?.reset?.();
  leer();
}

function enfocar() {
  chk.value?.focus?.();
  salida.value = "focus() → el checkbox tomó foco";
}
</script>

<template>
  <VanillaDemo :use="['CuCheckbox']">
    <cu-checkbox ref="chk" label="Acepto"></cu-checkbox>
    <div class="cu-demo-controls">
      <button type="button" @click="setear(true)">set(true)</button>
      <button type="button" @click="setear(false)">set(false)</button>
      <button type="button" @click="resetear">reset()</button>
      <button type="button" @click="enfocar">focus()</button>
      <button type="button" @click="leer">get()</button>
    </div>
    <pre class="cu-demo-output">{{ salida }}</pre>
  </VanillaDemo>
</template>
