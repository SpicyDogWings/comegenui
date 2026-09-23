<script setup lang="ts">
import { ref, getCurrentInstance, type PropType } from "vue";
import Collapse from "../../overlay/Collapse.vue";
import { initTokens } from "@/plugins/cu-tokens/css";

initTokens();

const props = defineProps({
  /** Texto del trigger */
  label: {
    type: String,
    required: true,
  },
  defaultOpen: {
    type: Boolean,
    default: false,
  },
  /** Color semántico del trigger: `primary`, `neutral`, `success`, `warning`, `danger` */
  color: {
    type: String as PropType<'primary' | 'secondary' | 'neutral' | 'success' | 'warning' | 'danger'>,
    default: "neutral",
  },
});

const collapseRef = ref<InstanceType<typeof Collapse> | null>(null);

const instance = getCurrentInstance();
function ceEmit(event: string, payload: unknown) {
  const el = instance?.vnode.el as HTMLElement | null;
  const host = el?.getRootNode()?.host || el;
  if (host) {
    host.dispatchEvent(new CustomEvent(event, {
      detail: payload,
      bubbles: true,
      composed: true,
    }));
  }
}

/** Abre el collapse */
function open() { collapseRef.value?.open(); }
/** Cierra el collapse */
function close() { collapseRef.value?.close(); }
/** Alterna el estado */
function toggle() { collapseRef.value?.toggle(); }
/** Devuelve el estado actual (`boolean`) */
function isOpen() { return collapseRef.value?.isOpen() ?? false; }

defineExpose({ open, close, toggle, isOpen });
</script>

<template>
  <Collapse
    ref="collapseRef"
    :label="props.label"
    :default-open="props.defaultOpen"
    :color="props.color"
    @toggle="ceEmit('toggle', $event)"
  >
    <!-- Contenido colapsable -->
    <slot></slot>
  </Collapse>
</template>

<style>
@unocss-placeholder;
</style>
