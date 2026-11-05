<script setup lang="ts">
// Refleja el ejemplo "Control programático": métodos open/close/toggle/isOpen y
// los eventos `open`/`close`.
import { ref } from "vue";

type MenuEl = HTMLElement & {
  open: () => void;
  close: () => void;
  toggle: () => void;
  isOpen: () => boolean;
};
const menu = ref<MenuEl | null>(null);
const salida = ref("");

const items = [{ label: "Editar" }, { label: "Duplicar" }, { label: "Eliminar", color: "danger" }];

function open() {
  menu.value?.open();
  salida.value = "open()";
}
function close() {
  menu.value?.close();
  salida.value = "close()";
}
function toggle() {
  menu.value?.toggle();
  salida.value = "toggle()";
}
function isOpen() {
  salida.value = `isOpen() → ${menu.value?.isOpen()}`;
}
function onOpen() {
  salida.value = "evento open";
}
function onClose() {
  salida.value = "evento close";
}
</script>

<template>
  <VanillaDemo :use="['CuDropdownMenu']">
    <cu-dropdown-menu
      ref="menu"
      label="Dropdown"
      :items.prop="items"
      @open="onOpen"
      @close="onClose"
    />

    <div class="cu-demo-controls">
      <button type="button" @click="open">open()</button>
      <button type="button" @click="close">close()</button>
      <button type="button" @click="toggle">toggle()</button>
      <button type="button" @click="isOpen">isOpen()</button>
    </div>
    <pre class="cu-demo-output">{{ salida }}</pre>
  </VanillaDemo>
</template>
