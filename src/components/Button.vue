<script setup lang="ts">
import { computed } from "vue";
import { darken, lighten, getContrast, toHex, transparentize } from "color2k";
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
  let main = props.color;
  if (["ghost", "outlined"].includes(props.variant)) main = transparentize(props.color, 1);
  if (["soft", "subtle"].includes(props.variant)) main = transparentize(props.color, 0.8);
  let hover = darken(props.color, 0.1);
  let active = darken(props.color, 0.2);
  if (getContrast(toHex(darken(props.color, 0.1)), main) < 1)
    hover = lighten(main, 0.1);
  if (getContrast(toHex(darken(props.color, 0.2)), main) < 2)
    active = lighten(main, 0.1);
  if (getContrast(toHex(darken(props.color, 0.2)), main) < 2 && props.hightContrast)
    active = lighten(main, 0.2);
  if (["ghost", "outlined"].includes(props.variant)) hover = transparentize(props.color, 0.9);
  if (["ghost", "outlined"].includes(props.variant)) active = transparentize(props.color, 0.8);
  if (["soft", "subtle"].includes(props.variant)) hover = transparentize(props.color, 0.7);
  if (["soft", "subtle"].includes(props.variant)) active = transparentize(props.color, 0.6);
  return { main, hover, active };
});

const fgClass = computed(() => {
  let main = toHex(lighten(props.color, 0.6));
  let border = "";
  if (getContrast(main, props.color) < 3 && props.hightContrast) {
    main = toHex(darken(props.color, 0.7));
  } else if (getContrast(main, props.color) < 3) {
    main = toHex(darken(props.color, 0.5));
  }
  if (["ghost", "outlined"].includes(props.variant)) main = props.color;
  if (["soft", "subtle"].includes(props.variant)) main = props.color;
  if (["subtle"].includes(props.variant)) border = transparentize(props.color, 0.7);
  return { main, border };
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
    class="py-2 px-4 rounded-cu border-none text-[var(--btn-fg)] font-sans font-medium bg-[var(--btn-bg)] hover:bg-[var(--btn-bg-hover)] active:bg-[var(--btn-bg-active)] hover:cursor-pointer flex justify-center items-center gap-2 box-border"
    :class="{
      'border-1 border-solid border-[var(--btn-bd)]': props.variant === 'outlined' || props.variant === 'subtle',
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
