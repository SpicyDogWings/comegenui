<script setup lang="ts">
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
    default: "solid",
    validator: (value: string) => ["solid", "outlined"].includes(value),
  },
});
</script>

<template>
  <button
    class="py-2 px-4 rounded-cu border-none font-sans font-bold hover:cursor-pointer"
    :class="[
      {
        'bg-charcoal-50 text-charcoal hover:bg-charcoal-100 active:bg-charcoal-200':
          !props.color && props.variant === 'solid',
      },
      {
        'bg-transparent border-solid border-2 border-charcoal text-charcoal':
          !props.color && props.variant === 'outlined',
      },
      {
        'bg-primary text-primary-50 hover:bg-primary-600 active:bg-primary-700':
          props.color === 'primary' && props.variant === 'solid',
      },
      {
        'bg-transparent border-solid border-2 border-primary text-primary':
          props.color === 'primary' && props.variant === 'outlined',
      },
      {
        'bg-charcoal-800 text-charcoal-100 hover:bg-charcoal-900 active:bg-charcoal-950':
          props.color === 'neutral' && props.variant === 'solid',
      },
      {
        'bg-transparent border-solid border-2 border-charcoal-800 text-charcoal-800':
          props.color === 'neutral' && props.variant === 'outlined',
      },
      {
        'bg-success text-success-50 hover:bg-success-500 active:bg-success-600':
          props.color === 'success' && props.variant === 'solid',
      },
      {
        'bg-transparent border-solid border-2 border-success text-success':
          props.color === 'success' && props.variant === 'outlined',
      },
      {
        'bg-warning text-warning-50 hover:bg-warning-400 active:bg-warning-500':
          props.color === 'warning' && props.variant === 'solid',
      },
      {
        'bg-transparent border-solid border-2 border-warning text-warning':
          props.color === 'warning' && props.variant === 'outlined',
      },
      {
        'bg-danger text-danger-50 hover:bg-danger-700 active:bg-danger-800':
          props.color === 'danger' && props.variant === 'solid',
      },
      {
        'bg-transparent border-solid border-2 border-danger text-danger':
          props.color === 'danger' && props.variant === 'outlined',
      },
    ]"
  >
    <slot></slot>
  </button>
</template>

<style>
@unocss-placeholder;
</style>
