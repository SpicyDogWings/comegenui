<script setup lang="ts">
import { ref } from "vue";
import FileInputZone from "@/components/form/FileInputZone.vue";

const fz = ref<InstanceType<typeof FileInputZone> | null>(null);
const salida = ref("(sin llamadas todavía)");

function leer() {
  const v = fz.value?.get();
  const nombre = Array.isArray(v) ? v.map((f) => f.name).join(", ") : v?.name ?? "null";
  salida.value = `get() → ${nombre}`;
}

function setear() {
  fz.value?.set([
    new File(["uno"], "a.txt", { type: "text/plain" }),
    new File(["dos"], "b.txt", { type: "text/plain" }),
  ]);
  leer();
}

function limpiar() {
  fz.value?.reset();
  leer();
}

function enfocar() {
  fz.value?.focus();
  salida.value = "focus() → la zona tomó foco";
}

function abrir() {
  salida.value = "trigger() → abre el selector nativo";
  fz.value?.trigger();
}
</script>

<template>
  <FileInputZone ref="fz" multiple placeholder="Archivos por API" />
  <div class="cu-demo-controls">
    <button type="button" @click="leer">get()</button>
    <button type="button" @click="setear">set()</button>
    <button type="button" @click="limpiar">reset()</button>
    <button type="button" @click="enfocar">focus()</button>
    <button type="button" @click="abrir">trigger()</button>
  </div>
  <pre class="cu-demo-output">{{ salida }}</pre>
</template>
