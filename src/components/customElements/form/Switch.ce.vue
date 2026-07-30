<script setup lang="ts">
import { ref, getCurrentInstance, type PropType } from "vue";
import Switch from "../../form/Switch.vue";

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  color: {
    type: String as PropType<'primary' | 'secondary' | 'neutral' | 'success' | 'warning' | 'danger'>,
    default: "neutral",
  },
  size: { type: String, default: "md" },
  disabled: Boolean,
});

const switchRef = ref<InstanceType<typeof Switch> | null>(null);

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

function get() { return switchRef.value?.get() ?? false; }
function set(val: boolean) { switchRef.value?.set(val); }
function reset() { switchRef.value?.reset(); }
function focus() { switchRef.value?.focus(); }

defineExpose({ get, set, reset, focus });
</script>

<template>
  <Switch
    ref="switchRef"
    :modelValue="props.modelValue"
    :color="props.color"
    :size="props.size"
    :disabled="props.disabled"
    @update:modelValue="ceEmit('update:modelValue', $event)"
    @change="ceEmit('change', $event)"
  />
</template>

<style>
@unocss-placeholder;
</style>
