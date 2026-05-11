<script setup lang="ts">
import { computed } from "vue";
import Alert from "./Alert.vue";
import { colorMap } from "../utils/palette";

const props = defineProps({
  close: {
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
    default: "soft",
    validator: (value: string) =>
      ["solid", "outlined", "soft", "subtle"].includes(value),
  },
  title: {
    type: String,
    required: false,
  },
  show: {
    type: Boolean,
    required: false,
    default: true,
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
  <Alert
    v-bind="{ ...props, color: hexColor }"
  >
    <template #icon>
      <slot name="icon"></slot>
    </template>
    <slot></slot>
  </Alert>
</template>

<style>
@unocss-placeholder;
</style>
