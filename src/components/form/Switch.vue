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
  label: {
    type: String,
    required: false,
    default: "",
  },
});

const emit = defineEmits(["change"]);
const inputRef = useTemplateRef("input");
const { focused: inputFocus } = useFocus(inputRef);

const switchStyles = computed(() => ({
  '--switch-bg': `var(--cu-color-${props.color})`,
  '--switch-ghost-hover': `var(--cu-color-${props.color}-ghost-hover)`,
}));

const toggle = (next?: boolean) => {
  if (props.disabled) return;
  const value = next ?? !checked.value;
  if (value === checked.value) return;
  checked.value = value;
  emit("change", value);
};

const onInput = (e: Event) => {
  toggle((e.target as HTMLInputElement).checked);
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
  <label
    class="cu-switch"
    :class="[
      `cu-switch--${props.size}`,
      { 'cu-switch--disabled': props.disabled }
    ]"
  >
    <span
      class="cu-switch-track"
      :class="{ 'cu-switch--checked': checked }"
      :style="switchStyles"
      role="switch"
      :aria-checked="checked"
    >
      <span class="cu-switch-thumb" />
      <input
        ref="input"
        type="checkbox"
        :checked="checked"
        :disabled="props.disabled"
        tabindex="-1"
        class="cu-switch-input"
        @change="onInput"
      />
    </span>
    <span v-if="props.label || $slots.default" class="cu-switch-label">
      <slot>{{ props.label }}</slot>
    </span>
  </label>
</template>

<style>
/* label nativo (misma implementación que Checkbox): el click en el label
   activa el input anidado y su change alterna */
.cu-switch {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: var(--cu-space-sm);
  vertical-align: middle;
  cursor: pointer;
}

.cu-switch-track {
  position: relative;
  display: inline-flex;
  align-items: center;
  border-radius: var(--cu-radius-full);
  transition: all 150ms ease;
  box-sizing: border-box;
}

.cu-switch--md .cu-switch-track {
  width: 48px;
  height: var(--cu-space-2xl);
}

.cu-switch--sm .cu-switch-track {
  width: var(--cu-space-2xl);
  height: 20px;
}

.cu-switch-track.cu-switch--checked {
  background-color: var(--switch-bg);
}

.cu-switch-track:not(.cu-switch--checked) {
  background-color: var(--cu-color-neutral-soft);
}

.cu-switch-track.cu-switch--checked:hover {
  background-color: var(--switch-ghost-hover);
}

.cu-switch-track:not(.cu-switch--checked):hover {
  background-color: var(--cu-color-neutral-ghost-hover);
}

.cu-switch--disabled {
  cursor: not-allowed;
}

.cu-switch--disabled .cu-switch-track {
  opacity: 0.7;
  pointer-events: none;
}

.cu-switch--disabled .cu-switch-label {
  opacity: 0.7;
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

.cu-switch--md .cu-switch-track.cu-switch--checked .cu-switch-thumb {
  transform: translateX(16px);
}

.cu-switch--sm .cu-switch-track.cu-switch--checked .cu-switch-thumb {
  transform: translateX(12px);
}

.cu-switch-input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.cu-switch-label {
  font-family: var(--cu-font-sans);
  color: var(--cu-color-neutral);
}

.cu-switch--md .cu-switch-label {
  font-size: var(--cu-font-size-sm);
}

.cu-switch--sm .cu-switch-label {
  font-size: var(--cu-font-size-xs);
}
</style>
