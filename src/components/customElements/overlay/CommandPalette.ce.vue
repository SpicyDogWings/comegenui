<script setup lang="ts">
import CommandPalette from "../../overlay/CommandPalette.vue";
import { initTokens } from "@/plugins/cu-tokens/css";

initTokens();

const props = defineProps({
  color: { type: String, default: "neutral" },
  placeholder: { type: String, default: "Buscar comandos…" },
});

const paletteRef = ref(null);

function open() {
  paletteRef.value?.open();
}
function close() {
  paletteRef.value?.close();
}

function ceEmit(event: string, payload: unknown) {
  const el = paletteRef.value?.$el;
  const host = el?.getRootNode()?.host || el;
  if (host) {
    host.dispatchEvent(
      new CustomEvent(event, {
        detail: payload,
        bubbles: true,
        composed: true,
      }),
    );
  }
}
</script>

<template>
  <CommandPalette
    ref="paletteRef"
    :color="props.color"
    :placeholder="props.placeholder"
    @select="(cmd) => ceEmit('select', cmd)"
    @close="ceEmit('close')"
  />
</template>
