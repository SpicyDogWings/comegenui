<script setup lang="ts">
import { computed, defineModel, useTemplateRef, type PropType } from "vue";
import { useFocus } from "@vueuse/core";

const checked = defineModel<boolean>({ default: false });

const props = defineProps({
  color: {
    type: String as PropType<'primary' | 'secondary' | 'neutral' | 'success' | 'warning' | 'danger'>,
    required: false,
    default: "neutral",
  },
  variant: {
    type: String,
    required: false,
    default: "solid",
    validator: (value: string) => ["solid", "soft", "outlined"].includes(value),
  },
  size: {
    type: String,
    required: false,
    default: "md",
    validator: (value: string) => ["sm", "md"].includes(value),
  },
  disabled: {
    type: Boolean,
    required: false,
    default: false,
  },
});

const emit = defineEmits(["change"]);
const inputRef = useTemplateRef("input");
const { focused: inputFocus } = useFocus(inputRef);

const switchStyles = computed(() => ({
  '--switch-bg': `var(--cu-color-${props.color})`,
  '--switch-soft': `var(--cu-color-${props.color}-soft)`,
  '--switch-ghost-hover': `var(--cu-color-${props.color}-ghost-hover)`,
  '--switch-soft-hover': `var(--cu-color-${props.color}-soft-hover)`,
  '--switch-text': `var(--cu-color-${props.color}-text)`,
}));

const toggle = () => {
  if (props.disabled) return;
  checked.value = !checked.value;
  emit("change", checked.value);
};

const get = () => checked.value;
const set = (value: boolean) => {
  checked.value = value;
  emit("change", value);
};
const reset = () => {
  checked.value = false;
  emit("change", false);
};

defineExpose({
  get,
  set,
  reset,
  focus: () => (inputFocus.value = true),
});
</script>

<template>
  <div
    @click="toggle"
    class="cu-switch"
    :class="[
      `cu-switch--${props.size}`,
      `cu-switch--${props.variant}`,
      {
        'cu-switch--disabled': props.disabled,
        'cu-switch--checked': checked,
      }
    ]"
    :style="switchStyles"
    role="switch"
    :aria-checked="checked"
  >
    <span class="cu-switch-thumb" />
    <input
      ref="input"
      type="checkbox"
      :checked="checked"
      class="cu-switch-input"
      :disabled="props.disabled"
    />
  </div>
</template>

<style>
.cu-switch {
  position: relative;
  display: inline-flex;
  align-items: center;
  border-radius: var(--cu-radius-full);
  cursor: pointer;
  transition: all 150ms ease;
  box-sizing: border-box;
}

.cu-switch--md {
  width: 48px;
  height: 32px;
}

.cu-switch--sm {
  width: 32px;
  height: 20px;
}

/* solid (default) */
.cu-switch--solid.cu-switch--checked {
  background-color: var(--switch-bg);
}

.cu-switch--solid:not(.cu-switch--checked) {
  background-color: var(--cu-color-neutral-soft);
}

.cu-switch--solid:hover:not(.cu-switch--disabled) {
  background-color: var(--switch-ghost-hover);
}

.cu-switch--solid:not(.cu-switch--checked):hover:not(.cu-switch--disabled) {
  background-color: var(--cu-color-neutral-ghost-hover);
}

/* soft */
.cu-switch--soft.cu-switch--checked {
  background-color: var(--switch-soft);
}

.cu-switch--soft:not(.cu-switch--checked) {
  background-color: var(--cu-color-neutral-subtle);
}

.cu-switch--soft:hover:not(.cu-switch--disabled) {
  background-color: var(--switch-soft-hover);
}

.cu-switch--soft:not(.cu-switch--checked):hover:not(.cu-switch--disabled) {
  background-color: var(--cu-color-neutral-subtle-hover);
}

/* outlined */
.cu-switch--outlined.cu-switch--checked {
  background-color: var(--switch-bg);
}

.cu-switch--outlined:not(.cu-switch--checked) {
  background-color: transparent;
  border: var(--cu-border-medium) solid var(--cu-border-color);
}

.cu-switch--outlined:hover:not(.cu-switch--disabled) {
  background-color: var(--switch-ghost-hover);
}

.cu-switch--outlined:not(.cu-switch--checked):hover:not(.cu-switch--disabled) {
  background-color: var(--cu-color-neutral-ghost-hover);
}

.cu-switch--disabled {
  opacity: 0.7;
  cursor: not-allowed;
  pointer-events: none;
}

.cu-switch-thumb {
  position: absolute;
  border-radius: var(--cu-radius-full);
  background-color: var(--cu-color-surface);
  box-shadow: var(--cu-shadow-sm);
  transition: all 150ms ease;
}

.cu-switch--md .cu-switch-thumb {
  width: 24px;
  height: 24px;
  top: 4px;
  left: 4px;
}

.cu-switch--sm .cu-switch-thumb {
  width: 16px;
  height: 16px;
  top: 2px;
  left: 2px;
}

.cu-switch--checked.cu-switch--md .cu-switch-thumb {
  transform: translateX(16px);
}

.cu-switch--checked.cu-switch--sm .cu-switch-thumb {
  transform: translateX(12px);
}

.cu-switch-input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}
</style>
