<script setup lang="ts">
import { computed } from "vue";
import { getBgClasses, getFgClasses } from "../utils/palette";

const props = defineProps({
  color: {
    type: String,
    required: false,
    default: "#2c2c2c",
    validator: (value: string) =>
      /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/i.test(value),
  },
  hightContrast: {
    type: Boolean,
    required: false,
    default: false,
  },
  variant: {
    type: String,
    required: false,
    default: "solid",
    validator: (value: string) =>
      ["solid", "outlined", "soft", "subtle"].includes(value),
  },
});

const bgClass = computed(() =>
  getBgClasses(props.color, props.variant, props.hightContrast),
);
const fgClass = computed(() =>
  getFgClasses(props.color, props.variant, props.hightContrast),
);
</script>

<template>
  <span
    class="py-0.5 px-2 w-fit rounded-cu border-none font-sans font-medium font-size-3 flex justify-center items-center gap-2 box-border text-[var(--btn-fg)] bg-[var(--btn-bg)]"
    :class="{
      'bg-opacity-10': props.variant === 'soft',
      'bg-opacity-10 border-solid border-1': props.variant === 'subtle',
      'border-[var(--btn-bd)]': props.variant === 'subtle' || props.variant === 'outlined',
      'bg-transparent border-solid border-2': props.variant === 'outlined',
    }"
    :style="{
      '--btn-fg': fgClass.main,
      '--btn-bg': bgClass.main,
      '--btn-bg-hover': bgClass.hover,
      '--btn-bg-active': bgClass.active,
      '--btn-bd': fgClass.border,
    }"
  >
    <slot></slot>
  </span>
</template>

<style>
@unocss-placeholder;
</style>
