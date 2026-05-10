<script setup lang="ts">
import { computed } from "vue";
import { darken, lighten, getContrast, toHex } from "color2k";
import { getFgClass } from "../utils/palette";

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
  colorMode: {
    type: String,
    required: false,
    default: "light",
    validator: (value: string) => ["dark", "light"].includes(value),
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

const bgClass = computed(() => {
  const bgClass = {
    main: props.color,
    hover: "",
    active: "",
  };
  bgClass.hover = darken(props.color, 0.1);
  bgClass.active = darken(props.color, 0.2);
  if (getContrast(toHex(darken(props.color, 0.1)), bgClass.main) < 1)
    bgClass.hover = lighten(bgClass.main, 0.1);
  if (getContrast(toHex(darken(props.color, 0.2)), bgClass.main) < 2)
    bgClass.active = lighten(bgClass.main, 0.2);
  return bgClass;
});

const fgClass = computed(() => {
  return getFgClass(props.color, props.hightContrast);
});
</script>

<template>
  <a
    v-if="props.to"
    :href="props.to"
    :target="props.target"
    :class="[props.variant === 'link' ? '' : 'decoration-0']"
  >
    <button
      class="py-2 px-4 rounded-cu border-none text-[var(--btn-fg)] font-sans font-medium bg-[var(--btn-bg)] hover:cursor-pointer flex justify-center items-center gap-2 box-border"
      :disabled="props.disabled"
    >
      <slot></slot>
    </button>
  </a>
  <button
    v-else
    class="py-2 px-4 rounded-cu border-none text-[var(--btn-fg)] font-sans font-medium bg-[var(--btn-bg)] hover:cursor-pointer flex justify-center items-center gap-2 box-border"
    :class="{
      'hover:bg-[var(--btn-bg-hover)] active:bg-[var(--btn-bg-active)]': variant === 'solid'
    }"
    :style="{
      '--btn-fg': fgClass,
      '--btn-bg': bgClass.main,
      '--btn-bg-hover': bgClass.hover,
      '--btn-bg-active': bgClass.active,
    }"
    :disabled="props.disabled"
  >
    <slot></slot>
  </button>
</template>

<style>
@unocss-placeholder;
</style>
