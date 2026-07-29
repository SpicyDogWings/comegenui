<script setup lang="ts">

const props = defineProps({
  variant: {
    type: String,
    required: false,
    default: "ghost",
    validator: (value: string) =>
      ["solid", "outlined", "soft", "ghost", "subtle", "link", "none"].includes(value),
  },
})
</script>

<template>
  <button
  :class="[props.variant]"
  class="cu-button">
    <slot></slot>
  </button>
</template>

<style scoped>
.cu-button {
  background-color: var(--cu-color-primary);
  font-family: var(--cu-font-sans);
  font-size: var(--cu-font-size-sm);
  font-weight: var(--cu-font-weight-medium);
  padding: var(--cu-space-md) var(--cu-space-lg);
  border-radius: var(--cu-radius-none);
  box-shadow: var(--cu-shadow-sm);
  border: var(--cu-border-none);
  cursor: pointer;
  transition: transform 0.05s ease-in-out;
  &:active {
    transform: scale(0.97);
  }
  /*&:focus {
      outline: var(--cu-border-thin) solid var(--cu-color-primary);
      outline-offset: var(--cu-space-2xs);
  }*/

  &.ghost {
      background-color: transparent;
      color: var(--cu-color-primary);
      &:hover {
        background-color: var(--cu-color-primary-ghost-hover);
      }
      &:active {
        background-color: var(--cu-color-primary-ghost-active);
      }
  }

  &.soft {
      background-color: var(--cu-color-primary-soft);
      color: var(--cu-color-primary);
      &:hover {
        background-color: var(--cu-color-primary-soft-hover);
      }
      &:active {
        background-color: var(--cu-color-primary-soft-active);
      }
  }

  &.subtle {
      background-color: var(--cu-color-primary-subtle);
      color: var(--cu-color-primary);
      border: var(--cu-border-thin) solid var(--cu-color-primary-subtle-border);
      &:hover {
        background-color: var(--cu-color-primary-subtle-hover);
      }
      &:active {
        background-color: var(--cu-color-primary-subtle-active);
      }
  }

  &.solid {
      background-color: var(--cu-color-primary);
      color: var(--cu-color-surface);
      &:hover {
        background-color: var(--cu-color-primary-hover);
      }
      &:active {
        background-color: var(--cu-color-primary-active);
      }
  }

  &.link {
      background-color: transparent;
      color: var(--cu-color-primary);
      box-shadow: none;
      padding: 0;
      text-decoration: underline;
      text-underline-offset: var(--cu-space-2xs);
      &:hover {
        text-decoration-thickness: 2px;
      }
      &:active {
        text-decoration-thickness: 2px;
      }
  }


}
</style>
