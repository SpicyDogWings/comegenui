<script setup lang="ts">
import { computed } from "vue";
import Badge from "./Badge.vue";
import { colorMap } from "../utils/palette";

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

const hexColor = computed(() => colorMap[props.color as keyof typeof colorMap] || props.color);
</script>

<template>
  <Badge v-bind="{ ...props, color: hexColor }">
    <slot></slot>
  </Badge>
</template>

<style>
@unocss-placeholder;
</style>
