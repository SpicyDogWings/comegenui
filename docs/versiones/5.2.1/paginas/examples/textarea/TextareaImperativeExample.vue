<script setup lang="ts">
import { ref } from "vue";
import Textarea from "@/components/form/Textarea.vue";

const ta = ref<InstanceType<typeof Textarea> | null>(null);
const salida = ref("(sin llamadas todavía)");

function leer() {
  salida.value = `get() → ${JSON.stringify(ta.value?.get())}`;
}

function setear() {
  ta.value?.set("Texto por API");
  leer();
}

function limpiar() {
  ta.value?.reset();
  leer();
}

function enfocar() {
  ta.value?.focus();
  salida.value = "focus() → el textarea tomó foco";
}
</script>

<template>
  <Textarea ref="ta" placeholder="Texto por API" />
  <div class="cu-demo-controls">
    <button type="button" @click="leer">get()</button>
    <button type="button" @click="setear">set()</button>
    <button type="button" @click="limpiar">reset()</button>
    <button type="button" @click="enfocar">focus()</button>
  </div>
  <pre class="cu-demo-output">{{ salida }}</pre>
</template>
