<script setup lang="ts">
// Refleja el ejemplo "Eventos": `select` (el comando elegido) y `close`.
import { ref } from "vue";

type PaletteEl = HTMLElement & { open: () => void };
const palette = ref<PaletteEl | null>(null);
const eventos = ref<string[]>([]);

const commands = [
  { id: "uno", label: "Comando uno", action: () => {} },
  { id: "dos", label: "Comando dos", action: () => {} },
];

function onSelect(e: Event) {
  const cmd = (e as CustomEvent<{ label: string }>).detail;
  eventos.value = [...eventos.value.slice(-4), `select → ${cmd.label}`];
}
function onClose() {
  eventos.value = [...eventos.value.slice(-4), "close"];
}
</script>

<template>
  <VanillaDemo :use="['CuCommandPalette']">
    <button type="button" @click="palette?.open()">Abrir paleta</button>

    <cu-command-palette
      ref="palette"
      title="Eventos"
      :commands.prop="commands"
      @select="onSelect"
      @close="onClose"
    ></cu-command-palette>

    <pre class="cu-demo-output">{{ eventos.join("\n") || "(sin eventos todavía)" }}</pre>
  </VanillaDemo>
</template>
