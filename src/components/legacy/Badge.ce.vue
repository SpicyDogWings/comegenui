<script setup lang="ts">
import Badge from "./Badge.vue";
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
      ["primary", "secondary", "neutral", "success", "warning", "danger"].includes(value),
  },
  variant: {
    type: String,
    required: false,
    default: "soft",
    validator: (value: string) =>
      ["solid", "outlined", "soft", "subtle", "ghost"].includes(value),
  },
});
</script>

<template>
  <Badge
    :color="props.color"
    :variant="props.variant"
  >
    <slot></slot>
  </Badge>
</template>

<style>
@unocss-placeholder;
</style>
