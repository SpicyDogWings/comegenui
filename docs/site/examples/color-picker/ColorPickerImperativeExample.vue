<script setup lang="ts">
import { ref } from "vue";
import ColorPicker from "@/components/form/ColorPicker.vue";

const cp = ref<InstanceType<typeof ColorPicker> | null>(null);
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
  <ColorPicker ref="cp" :model-value="'#3b82f6'" />
  <div class="cu-demo-controls">
    <button type="button" @click="leer">get()</button>
    <button type="button" @click="setear">set('#ff8800')</button>
    <button type="button" @click="limpiar">reset()</button>
    <button type="button" @click="enfocar">focus()</button>
  </div>
  <pre class="cu-demo-output">{{ salida }}</pre>
</template>
