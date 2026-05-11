<script setup lang="ts">
import { computed } from "vue";
import Input from "./Input.vue";
import { colorMap } from "../../utils/palette";

const props = defineProps({
  modelValue: {
    type: String,
    required: false,
    default: "",
  },
  startValue: {
    type: String,
    required: false,
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
  type: {
    type: String,
    required: false,
    default: "text",
    validator: (value: string) =>
      ["text", "password", "email", "number", "tel", "url", "search"].includes(value),
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
  readOnly: {
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

const hexColor = computed(() => colorMap[props.color as keyof typeof colorMap] || props.color);
</script>

<template>
  <Input v-bind="{ ...props, color: hexColor }" />
</template>

<style>
@unocss-placeholder;
</style>
