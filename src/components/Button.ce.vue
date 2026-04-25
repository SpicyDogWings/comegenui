<script setup lang="ts">
const props = defineProps({
  color: {
    type: String,
    required: false,
    default: "",
    validator: (value: string) =>
      ["primary", "neutral", "success", "warning", "danger", ""].includes(
        value,
      ),
  },
});
</script>

<template>
  <button
    class="py-2 px-4 rounded-cu border-none hover:cursor-pointer"
    :class="[
      { 'bg-charcoal-50 text-charcoal hover:bg-charcoal-100 active:bg-charcoal-200': props.color === '' },
      { 'bg-primary text-primary-50 hover:bg-primary-600 active:bg-primary-700': props.color === 'primary' },
      { 'bg-charcoal-800 text-charcoal-100 hover:bg-charcoal-900 active:bg-charcoal-950': props.color === 'neutral' },
      { 'bg-success text-success-50 hover:bg-success-500 active:bg-success-600': props.color === 'success' },
      { 'bg-warning text-warning-50 hover:bg-warning-400 active:bg-warning-500': props.color === 'warning' },
      { 'bg-danger text-danger-50 hover:bg-danger-700 active:bg-danger-800': props.color === 'danger' },
    ]"
  >
    <slot></slot>
  </button>
</template>

<style>
@unocss-placeholder;
</style>
