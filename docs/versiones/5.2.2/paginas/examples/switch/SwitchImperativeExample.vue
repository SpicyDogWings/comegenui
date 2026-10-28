<script setup lang="ts">
import { ref } from "vue";
import Switch from "@/components/form/Switch.vue";

const sw = ref<InstanceType<typeof Switch> | null>(null);
const salida = ref("(sin llamadas todavía)");

function leer() {
  salida.value = `get() → ${sw.value?.get()}`;
}

function prender() {
  sw.value?.set(true);
  leer();
}

function apagar() {
  sw.value?.reset();
  leer();
}

function enfocar() {
  sw.value?.focus();
  salida.value = "focus() → el switch tomó foco";
}
</script>

<template>
  <Switch ref="sw" label="API imperativa" />
  <div class="cu-demo-controls">
    <button type="button" @click="leer">get()</button>
    <button type="button" @click="prender">set(true)</button>
    <button type="button" @click="apagar">reset()</button>
    <button type="button" @click="enfocar">focus()</button>
  </div>
  <pre class="cu-demo-output">{{ salida }}</pre>
</template>
