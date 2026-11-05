<script setup lang="ts">
// Refleja el ejemplo "Comandos": item `{ id, label, action, description?, category?, badges?, icon?, shortcut? }`,
// agrupados por `category`.
import { ref } from "vue";

type PaletteEl = HTMLElement & { open: () => void };
const palette = ref<PaletteEl | null>(null);

// `icon` es texto corto (emoji/glifo): no se interpreta como HTML.
const iconoSave = "💾";

const commands = [
  {
    id: "guardar",
    label: "Guardar archivo",
    description: "Guarda el documento actual",
    category: "Archivo",
    badges: ["nuevo"],
    icon: iconoSave,
    shortcut: "⌘S",
    action: () => {},
  },
  {
    id: "exportar",
    label: "Exportar",
    description: "Exporta a PDF o PNG",
    category: "Archivo",
    shortcut: "⌘E",
    action: () => {},
  },
  {
    id: "buscar",
    label: "Buscar en el proyecto",
    description: "Búsqueda global",
    category: "Navegación",
    badges: ["global"],
    shortcut: "⌘K",
    action: () => {},
  },
  {
    id: "tema",
    label: "Cambiar tema",
    description: "Abre el Theme Builder",
    category: "Apariencia",
    action: () => {},
  },
];
</script>

<template>
  <VanillaDemo :use="['CuCommandPalette']">
    <button type="button" @click="palette?.open()">Abrir con comandos ricos</button>

    <cu-command-palette
      ref="palette"
      title="Comandos agrupados"
      :commands.prop="commands"
    ></cu-command-palette>
  </VanillaDemo>
</template>
