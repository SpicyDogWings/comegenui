<script setup lang="ts">
// Refleja el ejemplo "Tamaño y alto": `size` y `height` aceptan auto | sm | md | lg | xl | full.
import { ref } from "vue";

type PaletteEl = HTMLElement & { open: () => void };

const sizes = ["auto", "sm", "md", "lg", "xl", "full"] as const;
const palettes = ref<Record<string, PaletteEl | null>>({});

const commands = [
  { id: "uno", label: "Comando uno", action: () => {} },
  { id: "dos", label: "Comando dos", action: () => {} },
  { id: "tres", label: "Comando tres", action: () => {} },
];
</script>

<template>
  <VanillaDemo :use="['CuCommandPalette']">
    <div class="cu-demo-controls">
      <button v-for="size in sizes" :key="size" type="button" @click="palettes[size]?.open()">
        size / height = {{ size }}
      </button>
    </div>

    <cu-command-palette
      v-for="size in sizes"
      :key="size"
      :ref="(el) => { palettes[size] = el as PaletteEl | null }"
      :title="`size ${size}`"
      :size="size"
      :height="size"
      :commands.prop="commands"
    ></cu-command-palette>
  </VanillaDemo>
</template>
