<script setup lang="ts">
import { computed } from "vue";
import Badge from "./Badge.vue";

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
      ["solid", "outlined", "soft", "ghost", "subtle"].includes(value),
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
  <Badge v-bind="{ ...props, color: hexColor }">
    <slot></slot>
  </Badge>
</template>

<style>
@unocss-placeholder;
</style>
