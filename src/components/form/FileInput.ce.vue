<script setup lang="ts">
import { computed, ref, watch, getCurrentInstance } from "vue";
import FileInput from "./FileInput.vue";
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
    type: null as any,
    required: false,
    default: null,
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
    validator: (value: string) =>
      ["outlined", "soft", "ghost", "subtle", "none"].includes(value),
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
  accept: {
    type: String,
    required: false,
  },
  multiple: {
    type: Boolean,
    required: false,
    default: false,
  },
  maxSize: {
    type: Number,
    required: false,
  },
  directory: {
    type: Boolean,
    required: false,
    default: false,
  },
  maxDepth: {
    type: Number,
    required: false,
    default: 0,
  },
  hightContrast: {
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
const fileInputRef = ref<InstanceType<typeof FileInput> | null>(null);
const instance = getCurrentInstance();

watch(() => props.modelValue, (val) => {
  innerValue.value = val;
});

watch(() => fileInputRef.value?.get(), (val) => {
  if (val !== undefined && val !== innerValue.value) {
    innerValue.value = val;
    ceEmit("update:modelValue", val);
    ceEmit("file-change", val);
  }
});

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
  get: () => fileInputRef.value?.get(),
  set: (value: File | File[] | null) => fileInputRef.value?.set(value),
  reset: () => fileInputRef.value?.reset(),
  focus: () => fileInputRef.value?.focus(),
  trigger: () => fileInputRef.value?.trigger(),
});
</script>

<template>
  <FileInput
    ref="fileInputRef"
    :color="hexColor"
    :variant="props.variant"
    :placeholder="props.placeholder"
    :disabled="props.disabled"
    :read-only="props.readOnly"
    :accept="props.accept"
    :multiple="props.multiple"
    :max-size="props.maxSize"
    :directory="props.directory"
    :max-depth="props.maxDepth"
    :hight-contrast="props.hightContrast"
    :model-value="innerValue"
  />
</template>

<style>
@unocss-placeholder;
</style>
