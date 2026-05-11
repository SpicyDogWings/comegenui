<script setup lang="ts">
import { computed } from "vue";
import Checkbox from "./Checkbox.vue";
import { colorMap } from "../../utils/palette";

const props = defineProps({
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

const hexColor = computed(() => colorMap[props.color as keyof typeof colorMap] || props.color);
</script>

<template>
  <Checkbox v-bind="{ ...props, color: hexColor }" />
</template>

<style>
@unocss-placeholder;
</style>
