<script setup lang="ts">
import { ref } from "vue";
import Modal from "@/components/overlay/Modal.vue";

const modalRef = ref<InstanceType<typeof Modal> | null>(null);
const salida = ref("");

function open() {
  modalRef.value?.open();
  salida.value = "open()";
}
function close() {
  modalRef.value?.close();
  salida.value = "close()";
}
function toggle() {
  modalRef.value?.toggle();
  salida.value = "toggle()";
}
function isOpen() {
  salida.value = `isOpen() → ${modalRef.value?.isOpen()}`;
}
</script>

<template>
  <Modal ref="modalRef" title="Control programático">
    <p>Este modal se maneja desde la ref, sin estado externo.</p>
  </Modal>

  <div class="cu-demo-controls">
    <button type="button" @click="open">open()</button>
    <button type="button" @click="close">close()</button>
    <button type="button" @click="toggle">toggle()</button>
    <button type="button" @click="isOpen">isOpen()</button>
  </div>
  <pre class="cu-demo-output">{{ salida }}</pre>
</template>
