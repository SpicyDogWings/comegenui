<script setup lang="ts">
import { computed, ref, watch, getCurrentInstance } from "vue";
import Input from "./Input.vue";
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
    default: "ghost",
    validator: (value: string) =>
      ["outlined", "soft", "ghost", "subtle", "none"].includes(value),
  },
  type: {
    type: String,
    required: false,
    default: "text",
    validator: (value: string) =>
      ["text", "password", "email", "number", "tel", "url", "search"].includes(value),
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
const inputRef = ref<InstanceType<typeof Input> | null>(null);
const instance = getCurrentInstance();

watch(() => props.modelValue, (val) => {
  innerValue.value = val;
});

watch(() => inputRef.value?.get(), (val) => {
  if (val !== undefined && val !== null && val !== innerValue.value) {
    innerValue.value = val;
    ceEmit("update:modelValue", val);
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
  get: () => inputRef.value?.get(),
  set: (value: string | number) => inputRef.value?.set(value),
  reset: () => inputRef.value?.reset(),
  focus: () => inputRef.value?.focus(),
});
</script>

<template>
  <Input
    ref="inputRef"
    :color="hexColor"
    :variant="props.variant"
    :type="props.type"
    :placeholder="props.placeholder"
    :disabled="props.disabled"
    :read-only="props.readOnly"
    :hight-contrast="props.hightContrast"
    :start-value="props.startValue"
    :model-value="innerValue"
  />
</template>

<style>
@unocss-placeholder;
</style>
