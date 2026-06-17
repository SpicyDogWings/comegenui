<script setup lang="ts">
import { computed, ref, getCurrentInstance } from "vue";
import Textarea from "./Textarea.vue";
import { getColorMap } from "../../utils/palette";
import { getHostTheme } from "../../utils/getHostTheme";
import { isValidTheme } from "../../config/theme";

const props = defineProps({
  theme: {
    type: String,
    required: false,
    default: "",
    validator: isValidTheme,
  },
  modelValue: {
    type: String,
    required: false,
    default: "",
  },
  startValue: {
    type: String,
    required: false,
  },
  color: {
    type: String,
    required: false,
    default: "neutral",
    validator: (value: string) =>
      ["primary", "neutral", "success", "warning", "danger"].includes(value),
  },
  variant: {
    type: String,
    required: false,
    default: "none",
    validator: (value: string) => ["outlined", "soft", "ghost", "subtle", "none"].includes(value),
  },
  placeholder: {
    type: String,
    required: false,
  },
  disabled: {
    type: Boolean,
    required: false,
    default: false,
  },
  readOnly: {
    type: Boolean,
    required: false,
    default: false,
  },
  rows: {
    type: Number,
    required: false,
    default: 3,
  },
  noResize: {
    type: Boolean,
    required: false,
    default: false,
  },
});

const effectiveTheme = computed(() => props.theme || getHostTheme());
const hexColor = computed(() => {
  const map = getColorMap(effectiveTheme.value as "light" | "dark");
  return map[props.color as keyof typeof map] || props.color;
});

const innerValue = ref(props.modelValue);
const textareaRef = ref<InstanceType<typeof Textarea> | null>(null);
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

defineExpose({
  get: () => textareaRef.value?.get(),
  set: (value: string | number) => textareaRef.value?.set(value),
  reset: () => textareaRef.value?.reset(),
  focus: () => textareaRef.value?.focus(),
});
</script>

<template>
  <Textarea
    ref="textareaRef"
    :color="hexColor"
    :variant="props.variant"
    :placeholder="props.placeholder"
    :disabled="props.disabled"
    :read-only="props.readOnly"
    :rows="props.rows"
    :no-resize="props.noResize"
    :start-value="props.startValue"
    :model-value="innerValue"
    @update:model-value="(val: string) => { innerValue.value = val; ceEmit('update:modelValue', val); }"
  />
</template>

<style>
@unocss-placeholder;
</style>
