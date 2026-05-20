<script setup lang="ts">
import { computed, ref } from "vue";
import Textarea from "./Textarea.vue";
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
    default: "none",
    validator: (value: string) => ["outlined", "soft", "ghost", "subtle", "none"].includes(value),
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
  rows: {
    type: Number,
    required: false,
    default: 3,
  },
  noResize: {
    type: Boolean,
    required: false,
    default: false,
  },
});

const hexColor = computed(() => colorMap[props.color as keyof typeof colorMap] || props.color);
const textareaRef = ref<InstanceType<typeof Textarea> | null>(null);

defineExpose({
  get: () => textareaRef.value?.get(),
  set: (value: string | number) => textareaRef.value?.set(value),
  reset: () => textareaRef.value?.reset(),
  focus: () => textareaRef.value?.focus(),
});
</script>

<template>
  <Textarea ref="textareaRef" v-bind="{ ...props, color: hexColor }" />
</template>

<style>
@unocss-placeholder;
</style>
