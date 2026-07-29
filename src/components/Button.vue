<script setup lang="ts">
import { type PropType } from "vue";

const props = defineProps({
  variant: {
    type: String,
    required: false,
    default: "ghost",
    validator: (value: string) =>
      ["solid", "outlined", "soft", "ghost", "subtle", "link", "none"].includes(value),
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
  type: {
    type: String as PropType<'button' | 'submit' | 'reset'>,
    required: false,
    default: 'button',
  },
  disabled: {
    type: Boolean,
    required: false,
    default: false,
  },
});
</script>

<template>
  <a
    v-if="props.to"
    :href="props.to"
    :target="props.target"
    :class="{
      'cu-button--disabled': props.disabled,
    }"
    class="cu-button-link"
  >
    <button
      :type="props.type"
      :class="[
        'cu-button',
        `cu-button--${props.variant}`,
        { 'cu-button--disabled': props.disabled }
      ]"
      :disabled="props.disabled"
    >
      <slot></slot>
    </button>
  </a>
  <button
    v-else
    :type="props.type"
    :class="[
      'cu-button',
      `cu-button--${props.variant}`,
      { 'cu-button--disabled': props.disabled }
    ]"
    :disabled="props.disabled"
  >
    <slot></slot>
  </button>
</template>

<style>
.cu-button {
  font-family: var(--cu-font-sans);
  font-size: var(--cu-font-size-sm);
  font-weight: var(--cu-font-weight-medium);
  padding: var(--cu-space-md) var(--cu-space-lg);
  border-radius: var(--cu-radius-md);
  border: none;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: var(--cu-space-xs);
  box-sizing: border-box;
  transition: all 150ms ease;
}

.cu-button:active:not(.cu-button--disabled) {
  transform: scale(0.97);
}

.cu-button--disabled {
  opacity: 0.7;
  cursor: not-allowed;
  /*pointer-events: none;*/
}

/* solid */
.cu-button--solid {
  background-color: var(--cu-color-primary);
  color: var(--cu-color-surface);
}
.cu-button--solid:hover:not(.cu-button--disabled) {
  background-color: var(--cu-color-primary-hover);
}
.cu-button--solid:active:not(.cu-button--disabled) {
  background-color: var(--cu-color-primary-active);
}

/* ghost */
.cu-button--ghost {
  background-color: transparent;
  color: var(--cu-color-primary);
}
.cu-button--ghost:hover:not(.cu-button--disabled) {
  background-color: var(--cu-color-primary-ghost-hover);
}
.cu-button--ghost:active:not(.cu-button--disabled) {
  background-color: var(--cu-color-primary-ghost-active);
}

/* soft */
.cu-button--soft {
  background-color: var(--cu-color-primary-soft);
  color: var(--cu-color-primary);
}
.cu-button--soft:hover:not(.cu-button--disabled) {
  background-color: var(--cu-color-primary-soft-hover);
}
.cu-button--soft:active:not(.cu-button--disabled) {
  background-color: var(--cu-color-primary-soft-active);
}

/* subtle */
.cu-button--subtle {
  background-color: var(--cu-color-primary-subtle);
  color: var(--cu-color-primary);
  border: var(--cu-border-thin) solid var(--cu-color-primary-subtle-border);
}
.cu-button--subtle:hover:not(.cu-button--disabled) {
  background-color: var(--cu-color-primary-subtle-hover);
}
.cu-button--subtle:active:not(.cu-button--disabled) {
  background-color: var(--cu-color-primary-subtle-active);
}

/* outlined */
.cu-button--outlined {
  background-color: transparent;
  color: var(--cu-color-primary);
  border: var(--cu-border-thin) solid var(--cu-color-primary);
}
.cu-button--outlined:hover:not(.cu-button--disabled) {
  background-color: var(--cu-color-primary-ghost-hover);
}
.cu-button--outlined:active:not(.cu-button--disabled) {
  background-color: var(--cu-color-primary-ghost-active);
}

/* link */
.cu-button--link {
  background-color: transparent;
  color: var(--cu-color-primary);
  padding: 0;
  box-shadow: none;
  text-decoration: underline;
  text-underline-offset: var(--cu-space-2xs);
}
.cu-button--link:hover:not(.cu-button--disabled) {
  text-decoration-thickness: 2px;
}

/* none */
.cu-button--none {
  background-color: var(--cu-color-neutral);
  color: var(--cu-color-surface);
}
.cu-button--none:hover:not(.cu-button--disabled) {
  background-color: var(--cu-color-neutral-hover);
}
.cu-button--none:active:not(.cu-button--disabled) {
  background-color: var(--cu-color-neutral-active);
}

/* link wrapper */
.cu-button-link {
  text-decoration: none;
}
.cu-button-link:hover {
  text-decoration: underline;
  text-underline-offset: var(--cu-space-2xs);
}
</style>
