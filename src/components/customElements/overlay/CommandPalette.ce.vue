<script setup lang="ts">
import CommandPalette from "../../overlay/CommandPalette.vue";
import { initTokens } from "@/plugins/cu-tokens/css";
import type { PropType } from "vue";

initTokens();

const props = defineProps({
  /** Color semántico del modal: `primary`, `neutral`, `success`, `warning`, `danger` */
  color: { type: String as PropType<'primary' | 'secondary' | 'neutral' | 'success' | 'warning' | 'danger'>, default: "neutral" },
  /** Título del modal */
  title: { type: String, default: "" },
  /** Placeholder del input de búsqueda */
  placeholder: { type: String, default: "Buscar comandos…" },
  /** Ancho del modal: `auto`, `sm`, `md`, `lg`, `xl`, `full` */
  size: { type: String as PropType<'auto' | 'sm' | 'md' | 'lg' | 'xl' | 'full'>, default: "auto" },
  /** Alto del modal: `auto`, `sm`, `md`, `lg`, `xl`, `full` */
  height: { type: String as PropType<'auto' | 'sm' | 'md' | 'lg' | 'xl' | 'full'>, default: "auto" },
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
