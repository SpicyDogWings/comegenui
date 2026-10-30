<script setup lang="ts">
import { ref } from "vue";
import Button from "@/components/buttons/Button.vue";
import CommandPalette from "@/components/overlay/CommandPalette.vue";

const palette = ref<InstanceType<typeof CommandPalette> | null>(null);
const ultimo = ref("Sin selección todavía.");

const commands = [
  { id: "guardar", label: "Guardar", shortcut: "⌘S", action: () => (ultimo.value = "guardar") },
  { id: "buscar", label: "Buscar", shortcut: "⌘K", action: () => (ultimo.value = "buscar") },
  { id: "salir", label: "Salir", action: () => (ultimo.value = "salir") },
];

function onSelect(cmd: { label: string }) {
  ultimo.value = `@select → ${cmd.label}`;
}
</script>

<template>
  <Button color="primary" variant="solid" @click="palette?.open()">Abrir paleta</Button>

  <CommandPalette
    ref="palette"
    title="Comandos"
    color="primary"
    :commands="commands"
    @select="onSelect"
  />

  <pre class="cu-demo-output">{{ ultimo }}</pre>
</template>
