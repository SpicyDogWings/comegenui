<script setup lang="ts">
import { computed, ref } from "vue";
import Switch from "./Switch.vue";
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
  size: {
    type: String,
    required: false,
    default: "md",
    validator: (value: string) => ["sm", "md"].includes(value),
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

const switchRef = ref<InstanceType<typeof Switch> | null>(null);

defineExpose({
  get: () => switchRef.value?.get(),
  set: (value: boolean) => switchRef.value?.set(value),
  reset: () => switchRef.value?.reset(),
  focus: () => switchRef.value?.focus(),
});
</script>

<template>
  <Switch
    ref="switchRef"
    v-bind="{ ...props, color: hexColor }"
  />
</template>

<style>
@unocss-placeholder;
</style>
