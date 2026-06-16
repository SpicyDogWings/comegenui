<script setup lang="ts">
import { computed, ref } from "vue";
import Dropdown from "./Dropdown.vue";
import { getColorMap } from "../utils/palette";
import { getHostTheme } from "../utils/getHostTheme";
import { isValidTheme } from "../config/theme";

const props = defineProps({
  theme: {
    type: String,
    required: false,
    default: "",
    validator: isValidTheme,
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
      ["solid", "outlined", "soft", "ghost", "subtle"].includes(value),
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
  label: {
    type: String,
    required: false,
    default: "",
  },
  placement: {
    type: String,
    required: false,
    default: "bottom-start",
    validator: (value: string) =>
      ["bottom-start", "bottom-end", "top-start", "top-end"].includes(value),
  },
  offset: {
    type: Number,
    required: false,
    default: 4,
  },
});

const emit = defineEmits(["open", "close"]);

const effectiveTheme = computed(() => props.theme || getHostTheme());
const hexColor = computed(() => {
  const map = getColorMap(effectiveTheme.value as "light" | "dark");
  return map[props.color as keyof typeof map] || props.color;
});

const dropdownRef = ref<InstanceType<typeof Dropdown> | null>(null);

defineExpose({
  open: () => dropdownRef.value?.open(),
  close: () => dropdownRef.value?.close(),
  toggle: () => dropdownRef.value?.toggle(),
  get isOpen() { return dropdownRef.value?.isOpen || false },
});
</script>

<template>
  <Dropdown
    ref="dropdownRef"
    v-bind="{ ...props, color: hexColor }"
    @open="emit('open')"
    @close="emit('close')"
  >
    <template #toggle>
      <slot name="toggle"></slot>
    </template>
    <slot></slot>
  </Dropdown>
</template>

<style>
@unocss-placeholder;
</style>
