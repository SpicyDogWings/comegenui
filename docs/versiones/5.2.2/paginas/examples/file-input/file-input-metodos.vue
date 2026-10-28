<script setup lang="ts">
// Refleja el ejemplo "Interacción": el evento `update:modelValue` y los cinco
// métodos (get, set, reset, focus, trigger).
import { onMounted, ref } from "vue";

type FiEl = HTMLElement & {
  get: () => File | null;
  set: (file: File | null) => void;
  reset: () => void;
  focus: () => void;
  trigger: () => void;
};

const input = ref<HTMLElement | null>(null);
const salida = ref("(sin llamadas todavía)");

function el(): FiEl | null {
  return input.value as unknown as FiEl | null;
}

function leer() {
  salida.value = `get() → ${el()?.get()?.name ?? "null"}`;
}
function setear() {
  el()?.set(new File(["contenido"], "por-api.txt", { type: "text/plain" }));
  leer();
}
function limpiar() {
  el()?.reset();
  leer();
}
function enfocar() {
  el()?.focus();
  salida.value = "focus() → el contenedor tomó foco";
}
function abrir() {
  salida.value = "trigger() → abre el selector nativo";
  el()?.trigger();
}

onMounted(async () => {
  await customElements.whenDefined("cu-file-input");
  input.value?.addEventListener("update:modelValue", (e) => {
    const file = (e as CustomEvent<File | null>).detail;
    salida.value = `update:modelValue → ${file?.name ?? "null"}`;
  });
});
</script>

<template>
  <VanillaDemo :use="['CuFileInput']">
    <cu-file-input ref="input" placeholder="Archivo por API"></cu-file-input>
    <div class="cu-demo-controls">
      <button type="button" @click="leer">get()</button>
      <button type="button" @click="setear">set()</button>
      <button type="button" @click="limpiar">reset()</button>
      <button type="button" @click="enfocar">focus()</button>
      <button type="button" @click="abrir">trigger()</button>
    </div>
    <pre class="cu-demo-output">{{ salida }}</pre>
  </VanillaDemo>
</template>
