<script setup lang="ts">
// Refleja el ejemplo "API imperativa": set / increment / decrement / get / reset.
import NumberInput from "@/components/form/NumberInput.vue";
import { ref, useTemplateRef } from "vue";

const valor = ref<number | null>(null);
const campo = useTemplateRef("campo");
const salida = ref("(sin llamadas todavía)");

function setear() {
  campo.value?.set(4);
  salida.value = `set(4) → get() = ${JSON.stringify(campo.value?.get())}`;
}

function incrementar() {
  campo.value?.increment();
  salida.value = `increment() → get() = ${JSON.stringify(campo.value?.get())}`;
}

function decrementar() {
  campo.value?.decrement();
  salida.value = `decrement() → get() = ${JSON.stringify(campo.value?.get())}`;
}

function resetear() {
  campo.value?.reset();
  salida.value = `reset() → get() = ${JSON.stringify(campo.value?.get())}`;
}

function enfocar() {
  campo.value?.focus();
  salida.value = "focus()";
}
</script>

<template>
  <NumberInput ref="campo" v-model="valor" :min="0" :max="10" />
  <div class="cu-demo-controls">
    <button type="button" @click="setear">set(4)</button>
    <button type="button" @click="incrementar">increment()</button>
    <button type="button" @click="decrementar">decrement()</button>
    <button type="button" @click="resetear">reset()</button>
    <button type="button" @click="enfocar">focus()</button>
  </div>
  <pre class="cu-demo-output">v-model → {{ JSON.stringify(valor) }}</pre>
  <pre class="cu-demo-output">{{ salida }}</pre>
</template>
