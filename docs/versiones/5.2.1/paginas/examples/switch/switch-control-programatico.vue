<script setup lang="ts">
// Refleja el ejemplo "Control programático": `get`/`set`/`reset`/`focus` del custom element.
import { ref } from "vue";

type CuSwitchElement = HTMLElement & {
  get?: () => boolean;
  set?: (value: boolean) => void;
  reset?: () => void;
  focus?: () => void;
};

const sw = ref<CuSwitchElement | null>(null);
const salida = ref("(sin llamadas todavía)");

function leer() {
  salida.value = `get() → ${JSON.stringify(sw.value?.get?.())}`;
}

function prender() {
  sw.value?.set?.(true);
  leer();
}

function apagar() {
  sw.value?.reset?.();
  leer();
}

function enfocar() {
  sw.value?.focus?.();
  salida.value = "focus() → el switch tomó foco";
}
</script>

<template>
  <VanillaDemo :use="['CuSwitch']">
    <cu-switch ref="sw" color="primary" label="API imperativa"></cu-switch>
    <div class="cu-demo-controls">
      <button type="button" @click="leer">get()</button>
      <button type="button" @click="prender">set(true)</button>
      <button type="button" @click="apagar">reset()</button>
      <button type="button" @click="enfocar">focus()</button>
    </div>
    <pre class="cu-demo-output">{{ salida }}</pre>
  </VanillaDemo>
</template>
