<script setup lang="ts">
import { ref } from "vue";
import Button from "@/components/buttons/Button.vue";
import CommandPalette from "@/components/overlay/CommandPalette.vue";

const primary = ref<InstanceType<typeof CommandPalette> | null>(null);
const danger = ref<InstanceType<typeof CommandPalette> | null>(null);

const commands = [
  { id: "a", label: "Comando A", action: () => {} },
  { id: "b", label: "Comando B", action: () => {} },
];
</script>

<template>
  <Button color="primary" @click="primary?.open()">primary / size md</Button>
  <Button color="danger" @click="danger?.open()">danger / size sm</Button>

  <CommandPalette
    ref="primary"
    title="Paleta primary"
    placeholder="Escribí un comando…"
    color="primary"
    size="md"
    height="md"
    :commands="commands"
  />

  <CommandPalette
    ref="danger"
    title="Paleta danger"
    placeholder="Buscar…"
    color="danger"
    size="sm"
    :commands="commands"
  />
</template>
