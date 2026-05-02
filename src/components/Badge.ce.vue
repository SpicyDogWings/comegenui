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
      ["solid", "outlined", "soft", "ghost", "subtle"].includes(value),
  },
});

const badgeClasses = computed(() => [
  {
    "bg-primary text-primary-50":
      props.color === "primary" && props.variant === "solid",
  },
  {
    "bg-primary bg-opacity-10 text-primary":
      props.color === "primary" && props.variant === "soft",
  },
  {
    "bg-primary bg-opacity-10 text-primary border-solid border-1 border-primary-300":
      props.color === "primary" && props.variant === "subtle",
  },
  {
    "bg-transparent border-solid border-2 border-primary text-primary":
      props.color === "primary" && props.variant === "outlined",
  },
  {
    "bg-transparent text-primary hover:bg-primary hover:bg-opacity-10":
      props.color === "primary" && props.variant === "ghost",
  },
  {
    "bg-charcoal text-charcoal-50":
      props.color === "neutral" && props.variant === "solid",
  },
  {
    "bg-charcoal bg-opacity-10 text-charcoal-800":
      props.color === "neutral" && props.variant === "soft",
  },
  {
    "bg-charcoal bg-opacity-10 text-charcoal-800 border-solid border-1 border-charcoal-300":
      props.color === "neutral" && props.variant === "subtle",
  },
  {
    "bg-transparent border-solid border-2 border-charcoal-800 text-charcoal-800":
      props.color === "neutral" && props.variant === "outlined",
  },
  {
    "bg-transparent text-charcoal-800 hover:bg-charcoal hover:bg-opacity-10":
      props.color === "neutral" && props.variant === "ghost",
  },
  {
    "bg-success text-success-50":
      props.color === "success" && props.variant === "solid",
  },
  {
    "bg-success bg-opacity-10 text-success-600":
      props.color === "success" && props.variant === "soft",
  },
  {
    "bg-success bg-opacity-10 text-success-600 border-solid border-1 border-success-300":
      props.color === "success" && props.variant === "subtle",
  },
  {
    "bg-transparent border-solid border-2 border-success text-success":
      props.color === "success" && props.variant === "outlined",
  },
  {
    "bg-transparent text-success-600 hover:bg-success hover:bg-opacity-10":
      props.color === "success" && props.variant === "ghost",
  },
  {
    "bg-warning text-warning-50":
      props.color === "warning" && props.variant === "solid",
  },
  {
    "bg-warning bg-opacity-10 text-warning-500":
      props.color === "warning" && props.variant === "soft",
  },
  {
    "bg-warning bg-opacity-10 text-warning-500 border-solid border-1 border-warning-300":
      props.color === "warning" && props.variant === "subtle",
  },
  {
    "bg-transparent border-solid border-2 border-warning text-warning":
      props.color === "warning" && props.variant === "outlined",
  },
  {
    "bg-transparent text-warning-500 hover:bg-warning hover:bg-opacity-10":
      props.color === "warning" && props.variant === "ghost",
  },
  {
    "bg-danger text-danger-50":
      props.color === "danger" && props.variant === "solid",
  },
  {
    "bg-danger bg-opacity-10 text-danger":
      props.color === "danger" && props.variant === "soft",
  },
  {
    "bg-danger bg-opacity-10 text-danger border-solid border-1 border-danger-300":
      props.color === "danger" && props.variant === "subtle",
  },
  {
    "bg-transparent border-solid border-2 border-danger text-danger":
      props.color === "danger" && props.variant === "outlined",
  },
  {
    "bg-transparent text-danger hover:bg-danger hover:bg-opacity-10":
      props.color === "danger" && props.variant === "ghost",
  },
]);
</script>

<template>
  <span
    class="py-0.5 px-2 rounded-cu border-none font-sans font-medium font-size-3 flex justify-center items-center gap-2 box-border"
    :class="badgeClasses"
  >
    <slot></slot>
  </span>
</template>

<style>
@unocss-placeholder;
</style>
