<script setup lang="ts">
import { ref, getCurrentInstance, type PropType } from "vue";
import FileInputZone from "../../form/FileInputZone.vue";
import { initTokens } from "@/plugins/cu-tokens/css";

initTokens();

const props = defineProps({
  modelValue: { type: Object as PropType<File | File[] | null>, default: null },
  color: {
    type: String as PropType<'primary' | 'secondary' | 'neutral' | 'success' | 'warning' | 'danger'>,
    default: "neutral",
  },
  placeholder: { type: String, default: "Selecciona un archivo o arrastra aquí" },
  disabled: Boolean,
  readOnly: Boolean,
  accept: String,
  multiple: Boolean,
  maxSize: Number,
  directory: Boolean,
  directoryDeep: { type: Number, default: 0 },
  maxHeight: { type: String, default: "" },
});

const zoneRef = ref<InstanceType<typeof FileInputZone> | null>(null);

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

function get() { return zoneRef.value?.get() ?? null; }
function set(val: File | File[] | null) { zoneRef.value?.set(val); }
function reset() { zoneRef.value?.reset(); }
function focus() { zoneRef.value?.focus(); }
function trigger() { zoneRef.value?.trigger(); }

defineExpose({ get, set, reset, focus, trigger });
</script>

<template>
  <FileInputZone
    ref="zoneRef"
    :modelValue="props.modelValue"
    :color="props.color"
    :placeholder="props.placeholder"
    :disabled="props.disabled"
    :readOnly="props.readOnly"
    :accept="props.accept"
    :multiple="props.multiple"
    :maxSize="props.maxSize"
    :directory="props.directory"
    :directoryDeep="props.directoryDeep"
    :maxHeight="props.maxHeight"
    @update:modelValue="ceEmit('update:modelValue', $event)"
  />
</template>

<style>
@unocss-placeholder;
</style>
