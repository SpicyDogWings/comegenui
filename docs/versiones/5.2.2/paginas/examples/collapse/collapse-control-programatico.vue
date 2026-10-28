<script setup lang="ts">
// Refleja el ejemplo "Control programático": open()/close()/toggle()/isOpen() desde JS.
import { ref } from "vue";

type CuCollapseEl = HTMLElement & {
  open(): void;
  close(): void;
  toggle(): void;
  isOpen(): boolean;
};

const collapse = ref<CuCollapseEl | null>(null);
const salida = ref("");

function open() {
  collapse.value?.open();
  salida.value = "open()";
}
function close() {
  collapse.value?.close();
  salida.value = "close()";
}
function toggle() {
  collapse.value?.toggle();
  salida.value = "toggle()";
}
function isOpen() {
  salida.value = `isOpen() → ${collapse.value?.isOpen()}`;
}
</script>

<template>
  <VanillaDemo :use="['CuCollapse']">
    <cu-collapse ref="collapse" id="miCollapse" label="Programático">
      <p>Controlado desde JS con open()/close()/toggle().</p>
    </cu-collapse>
    <div class="cu-demo-controls">
      <button type="button" @click="open">open()</button>
      <button type="button" @click="close">close()</button>
      <button type="button" @click="toggle">toggle()</button>
      <button type="button" @click="isOpen">isOpen()</button>
    </div>
    <pre class="cu-demo-output">{{ salida }}</pre>
  </VanillaDemo>
</template>
