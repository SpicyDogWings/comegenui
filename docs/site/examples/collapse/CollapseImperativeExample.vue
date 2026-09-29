<script setup lang="ts">
import { ref } from "vue";
import Collapse from "@/components/overlay/Collapse.vue";

const collapseRef = ref<InstanceType<typeof Collapse> | null>(null);
const salida = ref("");

function open() {
  collapseRef.value?.open();
  salida.value = "open()";
}
function close() {
  collapseRef.value?.close();
  salida.value = "close()";
}
function toggle() {
  collapseRef.value?.toggle();
  salida.value = "toggle()";
}
function isOpen() {
  salida.value = `isOpen() → ${collapseRef.value?.isOpen()}`;
}
</script>

<template>
  <Collapse ref="collapseRef" label="Control programático" color="secondary">
    <p>Abierto y cerrado desde afuera con la ref del componente.</p>
  </Collapse>

  <div class="cu-demo-controls">
    <button type="button" @click="open">open()</button>
    <button type="button" @click="close">close()</button>
    <button type="button" @click="toggle">toggle()</button>
    <button type="button" @click="isOpen">isOpen()</button>
  </div>
  <pre class="cu-demo-output">{{ salida }}</pre>
</template>
