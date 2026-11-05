<script setup lang="ts">
// Refleja el ejemplo "Métodos": `open`, `close`, `toggle` e `isOpen`.
import { ref } from "vue";

type ModalEl = HTMLElement & {
  open: () => void;
  close: () => void;
  toggle: () => void;
  isOpen: () => boolean;
};

const modal = ref<ModalEl | null>(null);
const salida = ref("");

function abrir() {
  modal.value?.open();
  salida.value = "open()";
}
function cerrar() {
  modal.value?.close();
  salida.value = "close()";
}
function alternar() {
  modal.value?.toggle();
  salida.value = "toggle()";
}
function leer() {
  salida.value = `isOpen() → ${modal.value?.isOpen()}`;
}
</script>

<template>
  <VanillaDemo :use="['CuModal']">
    <div class="cu-demo-controls">
      <button type="button" @click="abrir">open()</button>
      <button type="button" @click="cerrar">close()</button>
      <button type="button" @click="alternar">toggle()</button>
      <button type="button" @click="leer">isOpen()</button>
    </div>

    <cu-modal ref="modal" title="Control programático">
      <p>Este modal se maneja desde la ref, sin estado externo.</p>
    </cu-modal>

    <pre class="cu-demo-output">{{ salida }}</pre>
  </VanillaDemo>
</template>
