<script setup lang="ts">
import { ref } from "vue";
import Input from "@/components/form/Input.vue";

const input = ref<InstanceType<typeof Input> | null>(null);
const salida = ref("(sin llamadas todavía)");

function leer() {
  salida.value = `get() → ${JSON.stringify(input.value?.get())}`;
}

function setear() {
  input.value?.set("Valor por API");
  leer();
}

function limpiar() {
  input.value?.reset();
  leer();
}

function enfocar() {
  input.value?.focus();
  salida.value = "focus() → el input tomó foco";
}
</script>

<template>
  <Input ref="input" placeholder="Valor por API" />
  <div class="cu-demo-controls">
    <button type="button" @click="leer">get()</button>
    <button type="button" @click="setear">set()</button>
    <button type="button" @click="limpiar">reset()</button>
    <button type="button" @click="enfocar">focus()</button>
  </div>
  <pre class="cu-demo-output">{{ salida }}</pre>
</template>
