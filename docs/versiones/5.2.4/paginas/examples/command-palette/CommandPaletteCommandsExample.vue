<script setup lang="ts">
import { ref } from "vue";
import Button from "@/components/buttons/Button.vue";
import CommandPalette from "@/components/overlay/CommandPalette.vue";

const palette = ref<InstanceType<typeof CommandPalette> | null>(null);

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
  <Button color="primary" variant="soft" @click="palette?.open()">Abrir con comandos ricos</Button>

  <CommandPalette ref="palette" title="Comandos agrupados" :commands="commands" />
</template>
