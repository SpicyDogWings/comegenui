<script setup lang="ts">
import { ref } from "vue";
import Checkbox from "@/components/form/Checkbox.vue";

const cb = ref<InstanceType<typeof Checkbox> | null>(null);
const salida = ref("(sin llamadas todavía)");

function leer() {
  salida.value = `get() → ${cb.value?.get()}`;
}

function marcar() {
  cb.value?.set(true);
  leer();
}

function desmarcar() {
  cb.value?.reset();
  leer();
}

function enfocar() {
  cb.value?.focus();
  salida.value = "focus() → el checkbox tomó foco";
}
</script>

<template>
  <Checkbox ref="cb" label="API imperativa" />
  <div class="cu-demo-controls">
    <button type="button" @click="leer">get()</button>
    <button type="button" @click="marcar">set(true)</button>
    <button type="button" @click="desmarcar">reset()</button>
    <button type="button" @click="enfocar">focus()</button>
  </div>
  <pre class="cu-demo-output">{{ salida }}</pre>
</template>
