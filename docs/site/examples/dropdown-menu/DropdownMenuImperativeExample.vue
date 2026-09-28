<script setup lang="ts">
import { ref } from "vue";
import DropdownMenu from "@/components/controls/DropdownMenu.vue";

const menuRef = ref<InstanceType<typeof DropdownMenu> | null>(null);
const salida = ref("");
const items = [{ label: "Opción" }];

function open() {
  menuRef.value?.open();
  salida.value = "open()";
}
function close() {
  menuRef.value?.close();
  salida.value = "close()";
}
function toggle() {
  menuRef.value?.toggle();
  salida.value = "toggle()";
}
function isOpen() {
  salida.value = `isOpen() → ${menuRef.value?.isOpen()}`;
}
</script>

<template>
  <DropdownMenu ref="menuRef" label="Control programático" color="primary" variant="soft" :items="items" />

  <div class="cu-demo-controls">
    <button type="button" @click="open">open()</button>
    <button type="button" @click="close">close()</button>
    <button type="button" @click="toggle">toggle()</button>
    <button type="button" @click="isOpen">isOpen()</button>
  </div>
  <pre class="cu-demo-output">{{ salida }}</pre>
</template>
