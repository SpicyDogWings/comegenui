<script setup lang="ts">
import { ref, getCurrentInstance, type PropType } from "vue";
import Collapse from "../../overlay/Collapse.vue";
import { initTokens } from "@/plugins/cu-tokens/css";

initTokens();

const props = defineProps({
  label: {
    type: String,
    required: true,
  },
  defaultOpen: {
    type: Boolean,
    default: false,
  },
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

function open() { collapseRef.value?.open(); }
function close() { collapseRef.value?.close(); }
function toggle() { collapseRef.value?.toggle(); }
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
    <slot></slot>
  </Collapse>
</template>

<style>
@unocss-placeholder;
</style>
