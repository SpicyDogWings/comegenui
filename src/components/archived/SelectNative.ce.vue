<script setup lang="ts">
import { computed, ref } from "vue";
import Select from "./SelectNative.vue";
import { getColorMap } from "../../utils/palette";
import { getHostTheme } from "../../utils/getHostTheme";
import { isValidTheme } from "../../config/theme";

interface SelectOption {
  value: string;
  label: string;
}

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
  options: {
    type: Array as () => SelectOption[],
    required: false,
    default: () => [],
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
  placeholder: {
    type: String,
    required: false,
  },
  disabled: {
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

const selectRef = ref<InstanceType<typeof Select> | null>(null);

defineExpose({
  get: () => selectRef.value?.get(),
  set: (value: string) => selectRef.value?.set(value),
  reset: () => selectRef.value?.reset(),
  focus: () => selectRef.value?.focus(),
});
</script>

<template>
  <Select
    ref="selectRef"
    v-bind="{ ...props, color: hexColor }"
  />
</template>

<style>
@unocss-placeholder;
</style>
