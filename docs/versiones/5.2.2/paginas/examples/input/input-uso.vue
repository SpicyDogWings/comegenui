<script setup lang="ts">
// Refleja el ejemplo "Uso en HTML plano": tres inputs y el control por métodos
// (`set`/`get`/`focus`) del custom element.
import { ref } from "vue";

type CuInputElement = HTMLElement & {
  get?: () => string;
  set?: (value: string | number) => void;
  focus?: () => void;
};

const email = ref<CuInputElement | null>(null);
const salida = ref("(sin llamadas todavía)");

function setear() {
  email.value?.set?.("usuario@dominio.com");
  salida.value = "set('usuario@dominio.com')";
}

function leer() {
  salida.value = `get() → ${JSON.stringify(email.value?.get?.())}`;
}

function enfocar() {
  email.value?.focus?.();
  salida.value = "focus() → el input tomó foco";
}
</script>

<template>
  <VanillaDemo :use="['CuInput']">
    <cu-input placeholder="Nombre" color="primary" variant="outlined"></cu-input>
    <cu-input ref="email" type="email" placeholder="correo@ejemplo.com" variant="soft"></cu-input>
    <cu-input type="number" disabled model-value="42"></cu-input>
    <div class="cu-demo-controls">
      <button type="button" @click="setear">set()</button>
      <button type="button" @click="leer">get()</button>
      <button type="button" @click="enfocar">focus()</button>
    </div>
    <pre class="cu-demo-output">{{ salida }}</pre>
  </VanillaDemo>
</template>
