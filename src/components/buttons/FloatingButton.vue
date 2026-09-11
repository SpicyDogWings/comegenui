<script setup lang="ts">
import { computed, type PropType } from "vue";

const props = defineProps({
  /** Color semántico del FAB: primary, secondary, neutral, success, warning, danger. */
  color: {
    type: String as PropType<'primary' | 'secondary' | 'neutral' | 'success' | 'warning' | 'danger'>,
    required: false,
    default: "primary",
  },
  /** Deshabilita el botón: atenúa el FAB y no emite `click`. */
  disabled: {
    type: Boolean,
    required: false,
    default: false,
  },
});

const emit = defineEmits(["click"]);

const fabStyles = computed(() => ({
  '--fab-bg': `var(--cu-color-${props.color})`,
  '--fab-bg-hover': `var(--cu-color-${props.color}-hover)`,
  '--fab-bg-active': `var(--cu-color-${props.color}-active)`,
}));

function onClick() {
  if (!props.disabled) {
    emit("click");
  }
}
</script>

<template>
  <button
    type="button"
    class="cu-floating-button"
    :class="{ 'cu-floating-button--disabled': disabled }"
    :style="fabStyles"
    :disabled="disabled"
    @click="onClick"
  >
    <slot />
  </button>
</template>

<style>
.cu-floating-button {
  position: fixed;
  bottom: var(--cu-space-lg);
  right: var(--cu-space-lg);
  z-index: 1000;
  width: var(--cu-space-3xl);
  height: var(--cu-space-3xl);
  padding: 0;
  font-family: var(--cu-font-sans);
  font-size: var(--cu-font-size-xl);
  border: none;
  border-radius: var(--cu-radius-full);
  background-color: var(--fab-bg);
  color: var(--cu-color-surface);
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--cu-shadow-lg);
  transition: all 150ms ease;
}

.cu-floating-button:hover:not(.cu-floating-button--disabled) {
  background-color: var(--fab-bg-hover);
  box-shadow: var(--cu-shadow-xl);
  transform: translateY(-2px);
}

.cu-floating-button:active:not(.cu-floating-button--disabled) {
  background-color: var(--fab-bg-active);
  transform: translateY(0);
}

.cu-floating-button--disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}
</style>
