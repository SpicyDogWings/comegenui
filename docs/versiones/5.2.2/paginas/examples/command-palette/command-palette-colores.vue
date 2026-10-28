<script setup lang="ts">
// Refleja el ejemplo "Colores": los 6 nombres semánticos del modal.
import { ref } from "vue";

type PaletteEl = HTMLElement & { open: () => void };

const colors = ["primary", "secondary", "neutral", "success", "warning", "danger"] as const;
const palettes = ref<Record<string, PaletteEl | null>>({});

const commands = [
  { id: "guardar", label: "Guardar", shortcut: "⌘S", action: () => {} },
  { id: "buscar", label: "Buscar", shortcut: "⌘K", action: () => {} },
  { id: "salir", label: "Salir", action: () => {} },
];
</script>

<template>
  <VanillaDemo :use="['CuCommandPalette']">
    <div class="cu-demo-controls">
      <button v-for="color in colors" :key="color" type="button" @click="palettes[color]?.open()">
        {{ color }}
      </button>
    </div>

    <cu-command-palette
      v-for="color in colors"
      :key="color"
      :ref="(el) => { palettes[color] = el as PaletteEl | null }"
      :title="color"
      :color="color"
      :commands.prop="commands"
    ></cu-command-palette>
  </VanillaDemo>
</template>
