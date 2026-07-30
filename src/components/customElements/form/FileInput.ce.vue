<script setup lang="ts">
import { ref, getCurrentInstance, type PropType } from "vue";
import FileInput from "../../form/FileInput.vue";

const props = defineProps({
  modelValue: { type: Object as PropType<File | null>, default: null },
  color: {
    type: String as PropType<'primary' | 'secondary' | 'neutral' | 'success' | 'warning' | 'danger'>,
    default: "neutral",
  },
  variant: { type: String, default: "outlined" },
  placeholder: { type: String, default: "Seleccionar archivo" },
  disabled: Boolean,
  readOnly: Boolean,
  accept: String,
  maxSize: Number,
});

const fileInputRef = ref<InstanceType<typeof FileInput> | null>(null);

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

function get() { return fileInputRef.value?.get() ?? null; }
function set(val: File | null) { fileInputRef.value?.set(val); }
function reset() { fileInputRef.value?.reset(); }
function focus() { fileInputRef.value?.focus(); }
function trigger() { fileInputRef.value?.trigger(); }

defineExpose({ get, set, reset, focus, trigger });
</script>

<template>
  <FileInput
    ref="fileInputRef"
    :modelValue="props.modelValue"
    :color="props.color"
    :variant="props.variant"
    :placeholder="props.placeholder"
    :disabled="props.disabled"
    :readOnly="props.readOnly"
    :accept="props.accept"
    :maxSize="props.maxSize"
    @update:modelValue="ceEmit('update:modelValue', $event)"
  />
</template>

<style>
@unocss-placeholder;
</style>
