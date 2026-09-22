<script setup lang="ts">
import { type PropType } from "vue";
import Label from "../../form/Label.vue";

const props = defineProps({
  theme: {
    type: String,
    required: false,
    default: "",
  },
  for: {
    type: String,
    required: false,
    default: "",
  },
  label: {
    type: String,
    required: false,
    default: "",
  },
  color: {
    type: String as PropType<'primary' | 'secondary' | 'neutral' | 'success' | 'warning' | 'danger'>,
    required: false,
    default: "neutral",
  },
  hightContrast: {
    type: Boolean,
    required: false,
    default: false,
  },
});
</script>

<template>
  <Label
    :for="props.for"
    :label="props.label"
    :color="props.color"
    :hightContrast="props.hightContrast"
  >
    <slot></slot>
  </Label>
</template>

<style>
@unocss-placeholder;
</style>
