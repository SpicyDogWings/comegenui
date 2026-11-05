<script setup lang="ts">
import { ref } from "vue";
import CommandPalette from "@/components/overlay/CommandPalette.vue";

const paletteRef = ref<InstanceType<typeof CommandPalette> | null>(null);
const salida = ref("");

const commands = [
  { id: "guardar", label: "Guardar", action: () => {} },
  { id: "salir", label: "Salir", action: () => {} },
];

function open() {
  paletteRef.value?.open();
  salida.value = "open()";
}
function close() {
  paletteRef.value?.close();
  salida.value = "close()";
}
function run() {
  const cmd = paletteRef.value?.run("guardar");
  salida.value = `run("guardar") → ${cmd?.label ?? "no encontrado"}`;
}
function getCommands() {
  salida.value = `getCommands() → ${paletteRef.value?.getCommands().length} comandos`;
}
function isOpen() {
  salida.value = `isOpen() → ${paletteRef.value?.isOpen()}`;
}
</script>

<template>
  <CommandPalette ref="paletteRef" title="API imperativa" :commands="commands" />

  <div class="cu-demo-controls">
    <button type="button" @click="open">open()</button>
    <button type="button" @click="close">close()</button>
    <button type="button" @click="run">run("guardar")</button>
    <button type="button" @click="getCommands">getCommands()</button>
    <button type="button" @click="isOpen">isOpen()</button>
  </div>
  <pre class="cu-demo-output">{{ salida }}</pre>
</template>
