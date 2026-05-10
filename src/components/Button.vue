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
});

const bgClass = computed(() => getBgClasses(props.color, props.variant, props.hightContrast));
const fgClass = computed(() => getFgClasses(props.color, props.variant, props.hightContrast));
</script>

<template>
  <a
    v-if="props.to"
    :href="props.to"
    :target="props.target"
    :class="{
      'decoration-0': props.variant !== 'link',
      'visited:text-[var(--btn-fg)]': props.variant === 'link',
    }"
  >
    <button
      class="py-2 px-4 rounded-cu border-none text-[var(--btn-fg)] font-sans font-medium bg-[var(--btn-bg)] hover:cursor-pointer flex justify-center items-center gap-2 box-border"
      :class="{
        'hover:underline hover:decoration-solid hover:decoration-2': props.variant === 'link',
        'cursor-not-allowed opacity-70': props.disabled,
      }"
      :disabled="props.disabled"
    >
      <slot></slot>
    </button>
  </a>
  <button
    v-else
    class="py-2 px-4 rounded-cu border-none text-[var(--btn-fg)] font-sans font-medium bg-[var(--btn-bg)] hover:bg-[var(--btn-bg-hover)] active:bg-[var(--btn-bg-active)] hover:cursor-pointer flex justify-center items-center gap-2 box-border"
    :class="{
      'border-1 border-solid border-[var(--btn-bd)]': props.variant === 'outlined' || props.variant === 'subtle',
      'hover:underline hover:decoration-solid hover:decoration-2': props.variant === 'link',
      'cursor-not-allowed opacity-70': props.disabled,
    }"
    :style="{
      '--btn-fg': fgClass.main,
      '--btn-bg': bgClass.main,
      '--btn-bg-hover': bgClass.hover,
      '--btn-bg-active': bgClass.active,
      '--btn-bd': fgClass.border,
    }"
    :disabled="props.disabled"
  >
    <slot></slot>
  </button>
</template>

<style>
@unocss-placeholder;
</style>
