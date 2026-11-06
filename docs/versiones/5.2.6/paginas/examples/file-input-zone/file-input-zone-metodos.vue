<script setup lang="ts">
// Refleja el ejemplo "Interacción": el evento `update:modelValue` y los cinco
// métodos (get, set, reset, focus, trigger).
import { onMounted, ref } from "vue";

type ZoneEl = HTMLElement & {
  get: () => File | File[] | null;
  set: (files: File | File[] | null) => void;
  reset: () => void;
  focus: () => void;
  trigger: () => void;
};

const zona = ref<HTMLElement | null>(null);
const salida = ref("(sin llamadas todavía)");

function el(): ZoneEl | null {
  return zona.value as unknown as ZoneEl | null;
}

function leer() {
  const v = el()?.get();
  const nombre = Array.isArray(v) ? v.map((f) => f.name).join(", ") : v?.name ?? "null";
  salida.value = `get() → ${nombre}`;
}
function setear() {
  el()?.set([
    new File(["uno"], "a.txt", { type: "text/plain" }),
    new File(["dos"], "b.txt", { type: "text/plain" }),
  ]);
  leer();
}
function limpiar() {
  el()?.reset();
  leer();
}
function enfocar() {
  el()?.focus();
  salida.value = "focus() → la zona tomó foco";
}
function abrir() {
  salida.value = "trigger() → abre el selector nativo";
  el()?.trigger();
}

onMounted(async () => {
  await customElements.whenDefined("cu-file-input-zone");
  zona.value?.addEventListener("update:modelValue", (e) => {
    const files = (e as CustomEvent<File | File[] | null>).detail;
    salida.value = Array.isArray(files)
      ? `update:modelValue → ${files.map((f) => f.name).join(", ")}`
      : `update:modelValue → ${files?.name ?? "null"}`;
  });
});
</script>

<template>
  <VanillaDemo :use="['CuFileInputZone']">
    <cu-file-input-zone ref="zona" multiple placeholder="Archivos por API"></cu-file-input-zone>
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
