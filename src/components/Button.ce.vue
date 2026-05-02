<script setup lang="ts">
import { computed } from "vue";

const props = defineProps({
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
    "bg-primary text-primary-50 hover:bg-primary-600 active:bg-primary-700":
      props.color === "primary" && props.variant === "solid",
  },
  {
    "bg-primary bg-opacity-10 text-primary hover:bg-primary hover:bg-opacity-20 active:bg-primary active:bg-opacity-30":
      props.color === "primary" && props.variant === "soft",
  },
  {
    "bg-primary bg-opacity-10 text-primary border-solid border-1 border-primary-300 hover:bg-primary hover:bg-opacity-20 active:bg-primary active:bg-opacity-30":
      props.color === "primary" && props.variant === "subtle",
  },
  {
    "border-primary text-primary":
      props.color === "primary" && props.variant === "outlined",
  },
  {
    "text-primary hover:bg-primary hover:bg-opacity-10 active:bg-primary active:bg-opacity-20":
      props.color === "primary" && props.variant === "ghost",
  },
  {
    "text-primary":
      props.color === "primary" && props.variant === "link",
  },
  {
    "bg-charcoal text-charcoal-50 hover:bg-charcoal-900 active:bg-charcoal-950":
      props.color === "neutral" && props.variant === "solid",
  },
  {
    "bg-charcoal bg-opacity-20 text-charcoal-800 hover:bg-charcoal hover:bg-opacity-30 active:bg-charcoal active:bg-opacity-40":
      props.color === "neutral" && props.variant === "soft",
  },
  {
    "bg-charcoal bg-opacity-10 text-charcoal-800 border-solid border-1 border-charcoal-300 hover:bg-charcoal hover:bg-opacity-20 active:bg-charcoal active:bg-opacity-30":
      props.color === "neutral" && props.variant === "subtle",
  },
  {
    "border-charcoal-800 text-charcoal-800":
      props.color === "neutral" && props.variant === "outlined",
  },
  {
    "text-charcoal-800 hover:bg-charcoal hover:bg-opacity-20 active:bg-charcoal active:bg-opacity-30":
      props.color === "neutral" && props.variant === "ghost",
  },
  {
    "text-charcoal-800":
      props.color === "neutral" && props.variant === "link",
  },
  {
    "bg-success text-success-50 hover:bg-success-500 active:bg-success-600":
      props.color === "success" && props.variant === "solid",
  },
  {
    "bg-success bg-opacity-10 text-success-600 hover:bg-success hover:bg-opacity-20 active:bg-success active:bg-opacity-30":
      props.color === "success" && props.variant === "soft",
  },
  {
    "bg-success bg-opacity-10 text-success-600 border-solid border-1 border-success-300 hover:bg-success hover:bg-opacity-20 active:bg-success active:bg-opacity-30":
      props.color === "success" && props.variant === "subtle",
  },
  {
    "border-success text-success":
      props.color === "success" && props.variant === "outlined",
  },
  {
    "text-success-600 hover:bg-success hover:bg-opacity-10 active:bg-success active:bg-opacity-20":
      props.color === "success" && props.variant === "ghost",
  },
  {
    "text-success-600":
      props.color === "success" && props.variant === "link",
  },
  {
    "bg-warning text-warning-50 hover:bg-warning-400 active:bg-warning-500":
      props.color === "warning" && props.variant === "solid",
  },
  {
    "bg-warning bg-opacity-10 text-warning-500 hover:bg-warning hover:bg-opacity-20 active:bg-warning active:bg-opacity-30":
      props.color === "warning" && props.variant === "soft",
  },
  {
    "bg-warning bg-opacity-10 text-warning-500 border-solid border-1 border-warning-300 hover:bg-warning hover:bg-opacity-20 active:bg-warning active:bg-opacity-30":
      props.color === "warning" && props.variant === "subtle",
  },
  {
    "border-warning text-warning":
      props.color === "warning" && props.variant === "outlined",
  },
  {
    "text-warning-500 hover:bg-warning hover:bg-opacity-10 active:bg-warning active:bg-opacity-20":
      props.color === "warning" && props.variant === "ghost",
  },
  {
    "text-warning-500":
      props.color === "warning" && props.variant === "link",
  },
  {
    "bg-danger text-danger-50 hover:bg-danger-700 active:bg-danger-800":
      props.color === "danger" && props.variant === "solid",
  },
  {
    "bg-danger bg-opacity-10 text-danger hover:bg-danger hover:bg-opacity-20 active:bg-danger active:bg-opacity-30":
      props.color === "danger" && props.variant === "soft",
  },
  {
    "bg-danger bg-opacity-10 text-danger border-solid border-1 border-danger-300 hover:bg-danger hover:bg-opacity-20 active:bg-danger active:bg-opacity-30":
      props.color === "danger" && props.variant === "subtle",
  },
  {
    "border-danger text-danger":
      props.color === "danger" && props.variant === "outlined",
  },
  {
    "text-danger hover:bg-danger hover:bg-opacity-10 active:bg-danger active:bg-opacity-20":
      props.color === "danger" && props.variant === "ghost",
  },
  {
    "text-danger":
      props.color === "danger" && props.variant === "link",
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
