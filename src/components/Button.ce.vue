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
    validator: (value: string) => ["solid", "outlined", "soft", "ghost", "subtle"].includes(value),
  },
});
</script>

<template>
  <button
    class="py-2 px-4 rounded-cu border-none font-sans font-bold hover:cursor-pointer"
    :class="[
      {
        'bg-primary text-primary-50 hover:bg-primary-600 active:bg-primary-700':
          props.color === 'primary' && props.variant === 'solid',
      },
      {
        'bg-primary-100 text-primary hover:bg-primary-200 active:bg-primary-300':
          props.color === 'primary' && props.variant === 'soft',
      },
      {
        'bg-primary-100 text-primary border-solid border-1 border-primary-300 hover:bg-primary-200 active:bg-primary-300':
          props.color === 'primary' && props.variant === 'subtle',
      },
      {
        'bg-transparent border-solid border-2 border-primary text-primary':
          props.color === 'primary' && props.variant === 'outlined',
      },
      {
        'bg-transparent text-primary hover:bg-primary-50 active:bg-primary-100':
          props.color === 'primary' && props.variant === 'ghost',
      },
      {
        'bg-charcoal-800 text-charcoal-100 hover:bg-charcoal-900 active:bg-charcoal-950':
          props.color === 'neutral' && props.variant === 'solid',
      },
      {
        'bg-charcoal-100 text-charcoal-800 hover:bg-charcoal-200 active:bg-charcoal-300':
          props.color === 'neutral' && props.variant === 'soft',
      },
      {
        'bg-charcoal-100 text-charcoal-800 border-solid border-1 border-charcoal-300 hover:bg-charcoal-200 active:bg-charcoal-300':
          props.color === 'neutral' && props.variant === 'subtle',
      },
      {
        'bg-transparent border-solid border-2 border-charcoal-800 text-charcoal-800':
          props.color === 'neutral' && props.variant === 'outlined',
      },
      {
        'bg-transparent text-charcoal-800 hover:bg-charcoal-50 active:bg-charcoal-100':
          props.color === 'neutral' && props.variant === 'ghost',
      },
      {
        'bg-success text-success-50 hover:bg-success-500 active:bg-success-600':
          props.color === 'success' && props.variant === 'solid',
      },
      {
        'bg-success-100 text-success-600 hover:bg-success-200 active:bg-success-300':
          props.color === 'success' && props.variant === 'soft',
      },
      {
        'bg-success-100 text-success-600 border-solid border-1 border-success-300 hover:bg-success-200 active:bg-success-300':
          props.color === 'success' && props.variant === 'subtle',
      },
      {
        'bg-transparent border-solid border-2 border-success text-success':
          props.color === 'success' && props.variant === 'outlined',
      },
      {
        'bg-transparent text-success-600 hover:bg-success-50 active:bg-success-100':
          props.color === 'success' && props.variant === 'ghost',
      },
      {
        'bg-warning text-warning-50 hover:bg-warning-400 active:bg-warning-500':
          props.color === 'warning' && props.variant === 'solid',
      },
      {
        'bg-warning-100 text-warning-500 hover:bg-warning-200 active:bg-warning-300':
          props.color === 'warning' && props.variant === 'soft',
      },
      {
        'bg-warning-100 text-warning-500 border-solid border-1 border-warning-200 hover:bg-warning-200 active:bg-warning-300':
          props.color === 'warning' && props.variant === 'subtle',
      },
      {
        'bg-transparent border-solid border-2 border-warning text-warning':
          props.color === 'warning' && props.variant === 'outlined',
      },
      {
        'bg-transparent text-warning-500 hover:bg-warning-50 active:bg-warning-100':
          props.color === 'warning' && props.variant === 'ghost',
      },
      {
        'bg-danger text-danger-50 hover:bg-danger-700 active:bg-danger-800':
          props.color === 'danger' && props.variant === 'solid',
      },
      {
        'bg-danger-100 text-danger hover:bg-danger-200 active:bg-danger-300':
          props.color === 'danger' && props.variant === 'soft',
      },
      {
        'bg-danger-100 text-danger border-solid border-1 border-danger-300 hover:bg-danger-200 active:bg-danger-300':
          props.color === 'danger' && props.variant === 'subtle',
      },
      {
        'bg-transparent border-solid border-2 border-danger text-danger':
          props.color === 'danger' && props.variant === 'outlined',
      },
      {
        'bg-transparent text-danger hover:bg-danger-50 active:bg-danger-100':
          props.color === 'danger' && props.variant === 'ghost',
      },
    ]"
  >
    <slot></slot>
  </button>
</template>

<style>
@unocss-placeholder;
</style>
