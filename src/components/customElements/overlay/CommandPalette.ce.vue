<script setup lang="ts">
import CommandPalette from "../../overlay/CommandPalette.vue";
import { initTokens } from "@/plugins/cu-tokens/css";

initTokens();

const props = defineProps({
  color: { type: String, default: "neutral" },
  title: { type: String, default: "" },
  placeholder: { type: String, default: "Buscar comandos…" },
  size: { type: String, default: "auto" },
  height: { type: String, default: "auto" },
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
    :title="props.title"
    :placeholder="props.placeholder"
    :size="props.size"
    :height="props.height"
    @select="(cmd) => ceEmit('select', cmd)"
    @close="ceEmit('close')"
  />
</template>
