<script setup lang="ts">
import { ref, getCurrentInstance } from "vue";
import ColorPicker from "../../form/ColorPicker.vue";

const props = defineProps({
  modelValue: { type: String, default: "#000000" },
  color: { type: String, default: "neutral" },
  disabled: { type: Boolean, default: false },
});

const pickerRef = ref<InstanceType<typeof ColorPicker> | null>(null);
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

function get() { return pickerRef.value?.get() ?? "#000000"; }
function set(val: string) { pickerRef.value?.set(val); }
function reset() { pickerRef.value?.reset(); }
function focus() { pickerRef.value?.focus(); }

defineExpose({ get, set, reset, focus });
</script>

<template>
  <ColorPicker
    ref="pickerRef"
    :model-value="props.modelValue"
    :color="props.color"
    :disabled="props.disabled"
    @update:modelValue="ceEmit('update:modelValue', $event)"
    @change="ceEmit('change', $event)"
  />
</template>

<style>
@unocss-placeholder;
</style>
