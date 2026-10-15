<script setup lang="ts">
// Refleja el ejemplo "Control programático": open/close/run/getCommands/isOpen.
import { ref } from "vue";

type PaletteEl = HTMLElement & {
  open: () => void;
  close: () => void;
  run: (id: string) => { label: string } | null;
  getCommands: () => unknown[];
  isOpen: () => boolean;
};

const palette = ref<PaletteEl | null>(null);
const salida = ref("(sin llamadas todavía)");

const commands = [
  { id: "guardar", label: "Guardar", action: () => {} },
  { id: "salir", label: "Salir", action: () => {} },
];

function open() {
  palette.value?.open();
  salida.value = "open()";
}
function close() {
  palette.value?.close();
  salida.value = "close()";
}
function run() {
  const cmd = palette.value?.run("guardar");
  salida.value = `run("guardar") → ${cmd?.label ?? "no encontrado"}`;
}
function getCommands() {
  salida.value = `getCommands() → ${palette.value?.getCommands().length} comandos`;
}
function isOpen() {
  salida.value = `isOpen() → ${palette.value?.isOpen()}`;
}
</script>

<template>
  <VanillaDemo :use="['CuCommandPalette']">
    <cu-command-palette ref="palette" title="API imperativa" :commands.prop="commands"></cu-command-palette>

    <div class="cu-demo-controls">
      <button type="button" @click="open">open()</button>
      <button type="button" @click="close">close()</button>
      <button type="button" @click="run">run("guardar")</button>
      <button type="button" @click="getCommands">getCommands()</button>
      <button type="button" @click="isOpen">isOpen()</button>
    </div>
    <pre class="cu-demo-output">{{ salida }}</pre>
  </VanillaDemo>
</template>
