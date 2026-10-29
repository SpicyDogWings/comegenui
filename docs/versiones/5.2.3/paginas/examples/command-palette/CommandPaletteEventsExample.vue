<script setup lang="ts">
import { ref } from "vue";
import Button from "@/components/buttons/Button.vue";
import CommandPalette from "@/components/overlay/CommandPalette.vue";

const palette = ref<InstanceType<typeof CommandPalette> | null>(null);
const eventos = ref<string[]>(["Sin eventos todavía."]);

const commands = [
  { id: "uno", label: "Comando uno", action: () => {} },
  { id: "dos", label: "Comando dos", action: () => {} },
];

function log(texto: string) {
  eventos.value = [...eventos.value, texto];
}
</script>

<template>
  <Button color="primary" @click="palette?.open()">Abrir paleta</Button>

  <CommandPalette
    ref="palette"
    title="Eventos"
    :commands="commands"
    @select="(cmd) => log(`@select → ${cmd.label}`)"
    @close="log('@close')"
  />

  <pre class="cu-demo-output">{{ eventos.join("\n") }}</pre>
</template>
