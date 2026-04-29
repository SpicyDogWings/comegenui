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
    "bg-primary text-primary-50 hover:bg-primary-600 active:bg-primary-700":
      props.color === "primary" && props.variant === "solid",
  },
  {
    "bg-primary-50 text-primary hover:bg-primary-100 active:bg-primary-200":
      props.color === "primary" && props.variant === "soft",
  },
  {
    "bg-primary-50 text-primary border-solid border-1 border-primary-300 hover:bg-primary-100 active:bg-primary-200":
      props.color === "primary" && props.variant === "subtle",
  },
  {
    "bg-transparent border-solid border-2 border-primary text-primary":
      props.color === "primary" && props.variant === "outlined",
  },
  {
    "bg-transparent text-primary hover:bg-primary-50 active:bg-primary-100":
      props.color === "primary" && props.variant === "ghost",
  },
  {
    "bg-transparent text-primary hover:underline hover:decoration-solid hover:decoration-2":
      props.color === "primary" && props.variant === "link",
  },
  {
    "bg-charcoal text-charcoal-50 hover:bg-charcoal-900 active:bg-charcoal-950":
      props.color === "neutral" && props.variant === "solid",
  },
  {
    "bg-charcoal-100 text-charcoal-800 hover:bg-charcoal-200 active:bg-charcoal-300":
      props.color === "neutral" && props.variant === "soft",
  },
  {
    "bg-charcoal-50 text-charcoal-800 border-solid border-1 border-charcoal-300 hover:bg-charcoal-100 active:bg-charcoal-200":
      props.color === "neutral" && props.variant === "subtle",
  },
  {
    "bg-transparent border-solid border-2 border-charcoal-800 text-charcoal-800":
      props.color === "neutral" && props.variant === "outlined",
  },
  {
    "bg-transparent text-charcoal-800 hover:bg-charcoal-100 active:bg-charcoal-200":
      props.color === "neutral" && props.variant === "ghost",
  },
  {
    "bg-transparent text-charcoal-800 hover:underline hover:decoration-solid hover:decoration-2":
      props.color === "neutral" && props.variant === "link",
  },
  {
    "bg-success text-success-50 hover:bg-success-500 active:bg-success-600":
      props.color === "success" && props.variant === "solid",
  },
  {
    "bg-success-50 text-success-600 hover:bg-success-100 active:bg-success-200":
      props.color === "success" && props.variant === "soft",
  },
  {
    "bg-success-50 text-success-600 border-solid border-1 border-success-300 hover:bg-success-100 active:bg-success-200":
      props.color === "success" && props.variant === "subtle",
  },
  {
    "bg-transparent border-solid border-2 border-success text-success":
      props.color === "success" && props.variant === "outlined",
  },
  {
    "bg-transparent text-success-600 hover:bg-success-50 active:bg-success-100":
      props.color === "success" && props.variant === "ghost",
  },
  {
    "bg-transparent text-success-600 hover:underline hover:decoration-solid hover:decoration-2":
      props.color === "success" && props.variant === "link",
  },
  {
    "bg-warning text-warning-50 hover:bg-warning-400 active:bg-warning-500":
      props.color === "warning" && props.variant === "solid",
  },
  {
    "bg-warning-50 text-warning-500 hover:bg-warning-100 active:bg-warning-200":
      props.color === "warning" && props.variant === "soft",
  },
  {
    "bg-warning-50 text-warning-500 border-solid border-1 border-warning-300 hover:bg-warning-100 active:bg-warning-200":
      props.color === "warning" && props.variant === "subtle",
  },
  {
    "bg-transparent border-solid border-2 border-warning text-warning":
      props.color === "warning" && props.variant === "outlined",
  },
  {
    "bg-transparent text-warning-500 hover:bg-warning-50 active:bg-warning-100":
      props.color === "warning" && props.variant === "ghost",
  },
  {
    "bg-transparent text-warning-500 hover:underline hover:decoration-solid hover:decoration-2":
      props.color === "warning" && props.variant === "link",
  },
  {
    "bg-danger text-danger-50 hover:bg-danger-700 active:bg-danger-800":
      props.color === "danger" && props.variant === "solid",
  },
  {
    "bg-danger-50 text-danger hover:bg-danger-100 active:bg-danger-200":
      props.color === "danger" && props.variant === "soft",
  },
  {
    "bg-danger-50 text-danger border-solid border-1 border-danger-300 hover:bg-danger-100 active:bg-danger-200":
      props.color === "danger" && props.variant === "subtle",
  },
  {
    "bg-transparent border-solid border-2 border-danger text-danger":
      props.color === "danger" && props.variant === "outlined",
  },
  {
    "bg-transparent text-danger hover:bg-danger-50 active:bg-danger-100":
      props.color === "danger" && props.variant === "ghost",
  },
  {
    "bg-transparent text-danger hover:underline hover:decoration-solid hover:decoration-2":
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
