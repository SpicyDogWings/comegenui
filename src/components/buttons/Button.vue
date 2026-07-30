<script setup lang="ts">
import { computed, type PropType } from "vue";

const props = defineProps({
  color: {
    type: String as PropType<'primary' | 'secondary' | 'neutral' | 'success' | 'warning' | 'danger'>,
    required: false,
    default: "neutral",
  },
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

const colorStyles = computed(() => ({
  '--btn-bg': `var(--cu-color-${props.color})`,
  '--btn-bg-hover': `var(--cu-color-${props.color}-hover)`,
  '--btn-bg-active': `var(--cu-color-${props.color}-active)`,
  '--btn-ghost-hover': `var(--cu-color-${props.color}-ghost-hover)`,
  '--btn-ghost-active': `var(--cu-color-${props.color}-ghost-active)`,
  '--btn-soft': `var(--cu-color-${props.color}-soft)`,
  '--btn-soft-hover': `var(--cu-color-${props.color}-soft-hover)`,
  '--btn-soft-active': `var(--cu-color-${props.color}-soft-active)`,
  '--btn-subtle': `var(--cu-color-${props.color}-subtle)`,
  '--btn-subtle-hover': `var(--cu-color-${props.color}-subtle-hover)`,
  '--btn-subtle-active': `var(--cu-color-${props.color}-subtle-active)`,
  '--btn-subtle-border': `var(--cu-color-${props.color}-subtle-border)`,
}))
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
      :style="colorStyles"
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
    :style="colorStyles"
    :disabled="props.disabled"
  >
    <slot></slot>
  </button>
</template>

<style scoped>
.cu-button {
  font-family: var(--cu-font-sans);
  font-size: var(--cu-font-size-sm);
  font-weight: var(--cu-font-weight-medium);
  padding: var(--cu-space-md) var(--cu-space-lg);
  border-radius: var(--cu-radius);
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
}

/* solid */
.cu-button--solid {
  background-color: var(--btn-bg);
  color: var(--cu-color-surface);
}
.cu-button--solid:hover:not(.cu-button--disabled) {
  background-color: var(--btn-bg-hover);
}
.cu-button--solid:active:not(.cu-button--disabled) {
  background-color: var(--btn-bg-active);
}

/* ghost */
.cu-button--ghost {
  background-color: transparent;
  color: var(--btn-bg);
}
.cu-button--ghost:hover:not(.cu-button--disabled) {
  background-color: var(--btn-ghost-hover);
}
.cu-button--ghost:active:not(.cu-button--disabled) {
  background-color: var(--btn-ghost-active);
}

/* soft */
.cu-button--soft {
  background-color: var(--btn-soft);
  color: var(--btn-bg);
}
.cu-button--soft:hover:not(.cu-button--disabled) {
  background-color: var(--btn-soft-hover);
}
.cu-button--soft:active:not(.cu-button--disabled) {
  background-color: var(--btn-soft-active);
}

/* subtle */
.cu-button--subtle {
  background-color: var(--btn-subtle);
  color: var(--btn-bg);
  border: var(--cu-border-thin) solid var(--btn-subtle-border);
}
.cu-button--subtle:hover:not(.cu-button--disabled) {
  background-color: var(--btn-subtle-hover);
}
.cu-button--subtle:active:not(.cu-button--disabled) {
  background-color: var(--btn-subtle-active);
}

/* outlined */
.cu-button--outlined {
  background-color: transparent;
  color: var(--btn-bg);
  border: var(--cu-border-thin) solid var(--btn-bg);
}
.cu-button--outlined:hover:not(.cu-button--disabled) {
  background-color: var(--btn-ghost-hover);
}
.cu-button--outlined:active:not(.cu-button--disabled) {
  background-color: var(--btn-ghost-active);
}

/* link */
.cu-button--link {
  background-color: transparent;
  color: var(--btn-bg);
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
  background-color: var(--btn-bg);
  color: var(--cu-color-surface);
}
.cu-button--none:hover:not(.cu-button--disabled) {
  background-color: var(--btn-bg-hover);
}
.cu-button--none:active:not(.cu-button--disabled) {
  background-color: var(--btn-bg-active);
}

/* link wrapper */
.cu-button-link {
  text-decoration: none;
}
.cu-button-link:hover {
  text-decoration: underline;
  text-underline-offset: var(--cu-space-2xs);
}
.cu-button-link.cu-button--disabled {
  opacity: 0.7;
  pointer-events: none;
}

/* icon-only */
.cu-button--icon-only {
  padding: var(--cu-space-sm);
}
</style>
