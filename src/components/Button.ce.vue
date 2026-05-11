<script setup lang="ts">
import { computed } from "vue";
import Button from "./Button.vue";

const props = defineProps({
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
      ["solid", "outlined", "soft", "ghost", "subtle", "link"].includes(value),
  },
  to: {
    type: String,
    required: false,
  },
  target: {
    type: String,
    required: false,
    default: "_self",
    validator: (value: string) =>
      ["_self", "_blank", "_parent", "_top"].includes(value),
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

const colorMap: Record<string, string> = {
  primary: "#3b82f6",
  neutral: "#2c2c2c",
  success: "#22c55e",
  warning: "#f59e0b",
  danger: "#ef4444",
};

const hexColor = computed(() => colorMap[props.color] || props.color);
</script>

<template>
  <Button
    :color="hexColor"
    :variant="props.variant"
    :to="props.to"
    :target="props.target"
    :disabled="props.disabled"
    :hightContrast="props.hightContrast"
  >
    <slot></slot>
  </Button>
</template>

<style>
@unocss-placeholder;
</style>
