<script setup lang="ts">
// Refleja el ejemplo "Control programático": get()/set()/reset()/focus() sobre la ref.
import { ref } from "vue";

type ColorPickerEl = HTMLElement & {
  get: () => string;
  set: (val: string) => void;
  reset: () => void;
  focus: () => void;
};

const cp = ref<ColorPickerEl | null>(null);
const salida = ref("(sin llamadas todavía)");

function leer() {
  salida.value = `get() → ${JSON.stringify(cp.value?.get())}`;
}
function setear() {
  cp.value?.set("#ff8800");
  leer();
}
function limpiar() {
  cp.value?.reset();
  leer();
}
function enfocar() {
  cp.value?.focus();
  salida.value = "focus() → el input de texto tomó foco";
}
</script>

<template>
  <VanillaDemo :use="['CuColorPicker']">
    <cu-color-picker ref="cp" color="primary" model-value="#3b82f6"></cu-color-picker>
    <div class="cu-demo-controls">
      <button type="button" @click="leer">get()</button>
      <button type="button" @click="setear">set('#ff8800')</button>
      <button type="button" @click="limpiar">reset()</button>
      <button type="button" @click="enfocar">focus()</button>
    </div>
    <pre class="cu-demo-output">{{ salida }}</pre>
  </VanillaDemo>
</template>
