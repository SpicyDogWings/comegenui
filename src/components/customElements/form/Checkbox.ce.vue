<script setup lang="ts">
import { ref, getCurrentInstance, type PropType } from "vue";
import Checkbox from "../../form/Checkbox.vue";
import { initTokens } from "@/plugins/cu-tokens/css";

initTokens();

const props = defineProps({
  /** Estado del checkbox (controlado) */
  modelValue: { type: Boolean, default: false },
  /** Color semántico: `primary`, `neutral`, `success`, `warning`, `danger` */
  color: {
    type: String as PropType<'primary' | 'secondary' | 'neutral' | 'success' | 'warning' | 'danger'>,
    default: "neutral",
  },
  /** Tamaño del checkbox: `sm`, `md` */
  size: { type: String, default: "md" },
  /** Estado deshabilitado */
  disabled: Boolean,
  /** Texto visible junto al checkbox */
  label: String,
});

const checkboxRef = ref<InstanceType<typeof Checkbox> | null>(null);

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

function get() { return checkboxRef.value?.get() ?? false; }
function set(val: boolean) { checkboxRef.value?.set(val); }
function reset() { checkboxRef.value?.reset(); }
function focus() { checkboxRef.value?.focus(); }

defineExpose({ get, set, reset, focus });
</script>

<template>
  <Checkbox
    ref="checkboxRef"
    :modelValue="props.modelValue"
    :color="props.color"
    :size="props.size"
    :disabled="props.disabled"
    :label="props.label"
    @update:modelValue="ceEmit('update:modelValue', $event)"
    @change="ceEmit('change', $event)"
  />
</template>

<style>
@unocss-placeholder;
</style>
