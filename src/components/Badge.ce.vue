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
    "bg-opacity-10": props.variant === "soft",
  },
  {
    "bg-opacity-10 border-solid border-1": props.variant === "subtle",
  },
  {
    "bg-transparent border-solid border-2": props.variant === "outlined",
  },
  {
    "bg-transparent hover:bg-opacity-10": props.variant === "ghost",
  },
  {
    "bg-primary text-primary-50":
      props.color === "primary" && props.variant === "solid",
  },
  {
    "bg-primary text-primary":
      props.color === "primary" && props.variant === "soft",
  },
  {
    "bg-primary text-primary border-primary-300":
      props.color === "primary" && props.variant === "subtle",
  },
  {
    "border-primary text-primary":
      props.color === "primary" && props.variant === "outlined",
  },
  {
    "text-primary hover:bg-primary":
      props.color === "primary" && props.variant === "ghost",
  },
  {
    "bg-charcoal text-charcoal-50":
      props.color === "neutral" && props.variant === "solid",
  },
  {
    "bg-charcoal text-charcoal-800":
      props.color === "neutral" && props.variant === "soft",
  },
  {
    "bg-charcoal text-charcoal-800 border-charcoal-300":
      props.color === "neutral" && props.variant === "subtle",
  },
  {
    "border-charcoal-800 text-charcoal-800":
      props.color === "neutral" && props.variant === "outlined",
  },
  {
    "text-charcoal-800 hover:bg-charcoal":
      props.color === "neutral" && props.variant === "ghost",
  },
  {
    "bg-success text-success-50":
      props.color === "success" && props.variant === "solid",
  },
  {
    "bg-success text-success-600":
      props.color === "success" && props.variant === "soft",
  },
  {
    "bg-success text-success-600 border-success-300":
      props.color === "success" && props.variant === "subtle",
  },
  {
    "border-success text-success":
      props.color === "success" && props.variant === "outlined",
  },
  {
    "text-success-600 hover:bg-success":
      props.color === "success" && props.variant === "ghost",
  },
  {
    "bg-warning text-warning-50":
      props.color === "warning" && props.variant === "solid",
  },
  {
    "bg-warning text-warning-500":
      props.color === "warning" && props.variant === "soft",
  },
  {
    "bg-warning text-warning-500 border-warning-300":
      props.color === "warning" && props.variant === "subtle",
  },
  {
    "border-warning text-warning":
      props.color === "warning" && props.variant === "outlined",
  },
  {
    "text-warning-500 hover:bg-warning":
      props.color === "warning" && props.variant === "ghost",
  },
  {
    "bg-danger text-danger-50":
      props.color === "danger" && props.variant === "solid",
  },
  {
    "bg-danger text-danger":
      props.color === "danger" && props.variant === "soft",
  },
  {
    "bg-danger text-danger border-danger-300":
      props.color === "danger" && props.variant === "subtle",
  },
  {
    "border-danger text-danger":
      props.color === "danger" && props.variant === "outlined",
  },
  {
    "text-danger hover:bg-danger":
      props.color === "danger" && props.variant === "ghost",
  },
]);
</script>

<template>
  <span
    class="py-0.5 px-2 w-fit rounded-cu border-none font-sans font-medium font-size-3 flex justify-center items-center gap-2 box-border"
    :class="badgeClasses"
  >
    <slot></slot>
  </span>
</template>

<style>
@unocss-placeholder;
</style>
