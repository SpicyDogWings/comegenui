<script setup lang="ts">
import { ref } from "vue";
import FileInput from "@/components/form/FileInput.vue";

const fi = ref<InstanceType<typeof FileInput> | null>(null);
const salida = ref("(sin llamadas todavía)");

function leer() {
  salida.value = `get() → ${fi.value?.get()?.name ?? "null"}`;
}

function setear() {
  fi.value?.set(new File(["contenido"], "por-api.txt", { type: "text/plain" }));
  leer();
}

function limpiar() {
  fi.value?.reset();
  leer();
}

function enfocar() {
  fi.value?.focus();
  salida.value = "focus() → el contenedor tomó foco";
}

function abrir() {
  salida.value = "trigger() → abre el selector nativo";
  fi.value?.trigger();
}
</script>

<template>
  <FileInput ref="fi" placeholder="Archivo por API" />
  <div class="cu-demo-controls">
    <button type="button" @click="leer">get()</button>
    <button type="button" @click="setear">set()</button>
    <button type="button" @click="limpiar">reset()</button>
    <button type="button" @click="enfocar">focus()</button>
    <button type="button" @click="abrir">trigger()</button>
  </div>
  <pre class="cu-demo-output">{{ salida }}</pre>
</template>
