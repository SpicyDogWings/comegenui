<script setup lang="ts">
import CommandPalette from "../../overlay/CommandPalette.vue";
import { initTokens } from "@/plugins/cu-tokens/css";
import { ref, type PropType } from "vue";

initTokens();

interface CommandItem {
  id: string;
  label: string;
  description?: string;
  category?: string;
  badges?: string[];
  icon?: string;
  shortcut?: string;
  action: () => void;
}

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
  /** Comandos disponibles: `{ id, label, action, description?, category?, badges?, icon?, shortcut? }[]`. Se asigna como propiedad JS */
  commands: { type: Array as PropType<CommandItem[]>, default: () => [] },
});

const paletteRef = ref<InstanceType<typeof CommandPalette> | null>(null);

defineExpose({
  open: () => paletteRef.value?.open(),
  close: () => paletteRef.value?.close(),
  run: (id: string) => paletteRef.value?.run(id),
  getCommands: () => paletteRef.value?.getCommands(),
  isOpen: () => paletteRef.value?.isOpen() ?? false,
});

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
    :commands="props.commands"
    @select="(cmd) => ceEmit('select', cmd)"
    @close="ceEmit('close')"
  />
</template>
