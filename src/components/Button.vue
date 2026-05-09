<script setup lang="ts">
import { computed } from "vue";

const props = defineProps({
  color: {
    type: String,
    required: false,
    default: "#2c2c2c",
    validator: (value: string) => /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/i.test(value),
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

const buttonClasses = computed(() => [
  {
    "cursor-not-allowed opacity-70 pointer-events-none": props.disabled,
  },
  {
    "bg-transparent border-solid border-2": props.variant === "outlined",
  },
  {
    "bg-transparent": props.variant === "ghost",
  },
  {
    "bg-transparent hover:underline hover:decoration-solid hover:decoration-2": props.variant === "link",
  },
  {
    "bg-opacity-10 border-solid border-1 hover:bg-opacity-20 active:bg-opacity-30": props.variant === "subtle",
  },

]);
</script>

<template>
  <a
    v-if="props.to && !props.disabled"
    :href="props.to"
    :target="props.target"
    :class="[props.variant === 'link' ? '' : 'decoration-0']"
  >
    <button
      class="py-2 px-4 rounded-cu border-none font-sans font-medium hover:cursor-pointer flex justify-center items-center gap-2"
      :class="buttonClasses"
      :disabled="props.disabled"
    >
      <slot></slot>
    </button>
  </a>
  <a
    v-else-if="props.to && props.disabled"
    :href="props.to"
    :target="props.target"
    class="pointer-events-none"
  >
    <button
      class="py-2 px-4 rounded-cu border-none font-sans font-medium hover:cursor-pointer flex justify-center items-center gap-2 box-border"
      :class="buttonClasses"
      disabled
    >
      <slot></slot>
    </button>
  </a>
  <button
    v-else
    class="py-2 px-4 rounded-cu border-none font-sans font-medium hover:cursor-pointer flex justify-center items-center gap-2 box-border"
    :class="buttonClasses"
    :disabled="props.disabled"
  >
    <slot></slot>
  </button>
</template>

<style>
@unocss-placeholder;
</style>
