<script setup lang="ts">
import { computed } from "vue";
import { darken, lighten, getContrast, toHex } from 'color2k';

const props = defineProps({
  color: {
    type: String,
    required: false,
    default: "#2c2c2c",
    validator: (value: string) => /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/i.test(value),
  },
  hightContrast: {
    type: Boolean,
    required: false,
    default: false
  },
  colorMode: {
    type: String,
    required: false,
    default: "light",
    validator: (value: string) =>
      ["dark", "light"].includes(value),
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
    validator: (value: string) => ["_self", "_blank", "_parent", "_top"].includes(value),
  },
  disabled: {
    type: Boolean,
    required: false,
    default: false,
  },
});

const fgClass = computed(() => {
  let fgColor = toHex(lighten(props.color, 0.6));
  if (getContrast(fgColor, props.color) < 3 && props.hightContrast) fgColor = toHex(darken(props.color, 0.5));
  return fgColor;
});
const fgColorValue = computed(() => toHex(lighten(props.color, 0.3)));
</script>

<template>
  <a
    v-if="props.to"
    :href="props.to"
    :target="props.target"
    :class="[props.variant === 'link' ? '' : 'decoration-0']"
  >
    <button
      class="py-2 px-4 rounded-cu border-none font-sans font-medium hover:cursor-pointer flex justify-center items-center gap-2"
      :disabled="props.disabled"
    >
      <slot></slot>
    </button>
  </a>
  <button
    v-else
    class="bg-[var(--btn-bg)] text-[var(--btn-fg)] py-2 px-4 rounded-cu border-none font-sans font-medium hover:cursor-pointer flex justify-center items-center gap-2 box-border"
      :style="{
        '--btn-bg': props.color,
        '--btn-fg': fgClass
      }"
    :disabled="props.disabled"
  >
    <slot></slot>
  </button>
</template>

<style>
@unocss-placeholder;
</style>
