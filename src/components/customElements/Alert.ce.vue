<script setup lang="ts">
import { ref, getCurrentInstance, type PropType } from "vue";
import Alert from "../information/Alert.vue";

const props = defineProps({
  color: {
    type: String as PropType<'primary' | 'secondary' | 'neutral' | 'success' | 'warning' | 'danger'>,
    default: "neutral",
  },
  variant: {
    type: String,
    default: "soft",
  },
  title: String,
  close: Boolean,
  show: { type: Boolean, default: true },
});

const alertRef = ref<InstanceType<typeof Alert> | null>(null);

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

function open() { alertRef.value?.open(); }
function close() { alertRef.value?.close(); }
function toggle() { alertRef.value?.toggle(); }
function isOpen() { return alertRef.value?.isOpen() ?? false; }

defineExpose({ open, close, toggle, isOpen });
</script>

<template>
  <Alert
    ref="alertRef"
    :color="props.color"
    :variant="props.variant"
    :title="props.title"
    :close="props.close"
    :show="props.show"
    @close="ceEmit('close', $event)"
    @open="ceEmit('open', $event)"
    @update:show="ceEmit('update:show', $event)"
  >
    <template #icon>
      <slot name="icon"></slot>
    </template>
    <slot></slot>
  </Alert>
</template>

<style>
@unocss-placeholder;
</style>
