<script setup lang="ts">
import { ref } from "vue";
import Button from "@/components/buttons/Button.vue";
import CommandPalette from "@/components/overlay/CommandPalette.vue";

const palette = ref<InstanceType<typeof CommandPalette> | null>(null);

const iconoSave =
  '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><path d="M17 21v-8H7v8M7 3v5h8"/></svg>';

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
  <Button color="primary" variant="soft" @click="palette?.open()">Abrir con comandos ricos</Button>

  <CommandPalette ref="palette" title="Comandos agrupados" :commands="commands" />
</template>
