<script setup lang="ts">
import { computed, ref } from "vue";
import Checkbox from "./Checkbox.vue";
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
    type: Boolean,
    required: false,
    default: false,
  },
  checked: {
    type: Boolean,
    required: false,
    default: false,
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
  disabled: {
    type: Boolean,
    required: false,
    default: false,
  },
  label: {
    type: String,
    required: false,
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

const checkboxRef = ref<InstanceType<typeof Checkbox> | null>(null);

defineExpose({
  get: () => checkboxRef.value?.get(),
  set: (value: boolean) => checkboxRef.value?.set(value),
  reset: () => checkboxRef.value?.reset(),
  focus: () => checkboxRef.value?.focus(),
});
</script>

<template>
  <Checkbox ref="checkboxRef" v-bind="{ ...props, color: hexColor }" />
</template>

<style>
@unocss-placeholder;
</style>
