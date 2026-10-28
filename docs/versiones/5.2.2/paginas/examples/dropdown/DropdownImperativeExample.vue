<script setup lang="ts">
import { ref } from "vue";
import Dropdown from "@/components/overlay/Dropdown.vue";

const dropdownRef = ref<InstanceType<typeof Dropdown> | null>(null);
const seleccionado = ref("inicial");
const salida = ref("");

function open() {
  dropdownRef.value?.open();
  salida.value = "open()";
}
function close() {
  dropdownRef.value?.close();
  salida.value = "close()";
}
function toggle() {
  dropdownRef.value?.toggle();
  salida.value = "toggle()";
}
function get() {
  salida.value = `get() → "${dropdownRef.value?.get()}"`;
}
function set() {
  dropdownRef.value?.set("nuevo");
  salida.value = 'set("nuevo")';
}
function reset() {
  dropdownRef.value?.reset();
  salida.value = "reset()";
}
function isOpen() {
  salida.value = `isOpen() → ${dropdownRef.value?.isOpen()}`;
}
</script>

<template>
  <Dropdown ref="dropdownRef" v-model="seleccionado" label="Panel" color="primary" variant="soft">
    <p>Abierto/cerrado y valor controlados desde la ref.</p>
  </Dropdown>

  <div class="cu-demo-controls">
    <button type="button" @click="open">open()</button>
    <button type="button" @click="close">close()</button>
    <button type="button" @click="toggle">toggle()</button>
    <button type="button" @click="get">get()</button>
    <button type="button" @click="set">set("nuevo")</button>
    <button type="button" @click="reset">reset()</button>
    <button type="button" @click="isOpen">isOpen()</button>
  </div>
  <pre class="cu-demo-output">v-model: "{{ seleccionado }}"
{{ salida }}</pre>
</template>
