<script setup lang="ts">
// Refleja el ejemplo "Uso en HTML plano": `commands` es obligatoria y se asigna
// como propiedad JS (por eso `:commands.prop`); sin ella la paleta abre vacía.
import { ref } from "vue";

type PaletteEl = HTMLElement & { open: () => void };
const palette = ref<PaletteEl | null>(null);

const commands = [
  { id: "guardar", label: "Guardar", shortcut: "⌘S", action: () => {} },
  { id: "buscar", label: "Buscar", shortcut: "⌘K", action: () => {} },
  { id: "salir", label: "Salir", action: () => {} },
];
</script>

<template>
  <VanillaDemo :use="['CuCommandPalette']">
    <button type="button" @click="palette?.open()">Abrir paleta</button>

    <cu-command-palette
      ref="palette"
      title="Comandos"
      color="primary"
      :commands.prop="commands"
    ></cu-command-palette>
  </VanillaDemo>
</template>
