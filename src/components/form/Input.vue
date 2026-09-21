<script setup lang="ts">
import { computed, defineModel, useTemplateRef } from "vue";
import { useFocus } from "@vueuse/core";

const value = defineModel<string>({ default: "" });

const props = defineProps({
  startValue: {
    type: String,
    required: false,
  },
  color: {
    type: String,
    required: false,
    default: "neutral",
    validator: (value: string) =>
      ["primary", "secondary", "neutral", "success", "warning", "danger"].includes(value),
  },
  variant: {
    type: String,
    required: false,
    default: "soft",
    validator: (value: string) =>
      ["outlined", "soft", "ghost", "subtle"].includes(value),
  },
  type: {
    type: String,
    required: false,
    default: "text",
    validator: (value: string) =>
      ["text", "password", "email", "number", "tel", "url", "search"].includes(value),
  },
  placeholder: {
    type: String,
    required: false,
  },
  disabled: {
    type: Boolean,
    required: false,
    default: false,
  },
  readOnly: {
    type: Boolean,
    required: false,
    default: false,
  },
  /** Tamaño del input (sm | md | lg). */
  size: {
    type: String,
    required: false,
    default: "md",
    validator: (value: string) => ["sm", "md", "lg"].includes(value),
  },
});

const sizeClass = computed(() => props.size !== 'md' ? `cu-input--${props.size}` : '');

const inputRef = useTemplateRef("input");
const { focused: inputFocus } = useFocus(inputRef);

const inputStyles = computed(() => ({
  '--btn-bg': `var(--cu-color-${props.color})`,
  '--btn-bg-hover': `var(--cu-color-${props.color}-ghost-hover)`,
  '--btn-bg-active': `var(--cu-color-${props.color}-ghost-active)`,
  '--btn-soft': `var(--cu-color-${props.color}-soft)`,
  '--btn-soft-hover': `var(--cu-color-${props.color}-soft-hover)`,
  '--btn-subtle': `var(--cu-color-${props.color}-subtle)`,
  '--btn-subtle-hover': `var(--cu-color-${props.color}-subtle-hover)`,
  '--btn-subtle-border': `var(--cu-color-${props.color}-subtle-border)`,
}));

/** Devuelve el valor actual del input. */
const get = () => value.value;
/** Setea el valor del input. */
const set = (newValue: string | number) => { value.value = String(newValue); };
/** Limpia el input. */
const reset = () => { value.value = ""; };

defineExpose({
  get,
  set,
  reset,
  /** Enfoca el input. */
  focus: () => inputFocus.value = true,
});
</script>

<template>
  <input
    ref="input"
    :type="props.type"
    :placeholder="props.placeholder"
    :value="value"
    @input="value = ($event.target as HTMLInputElement).value"
    class="cu-input"
    :class="[
      `cu-input--${props.variant}`,
      sizeClass,
      { 'cu-input--disabled': props.disabled },
    ]"
    :style="inputStyles"
    :disabled="props.disabled"
    :readonly="props.readOnly"
  />
</template>

<style scoped>
.cu-input {
  font-family: var(--cu-font-sans);
  font-size: var(--cu-font-size-sm);
  font-weight: var(--cu-font-weight-medium);
  padding: var(--cu-space-md) var(--cu-space-lg);
  border-radius: var(--cu-radius-md);
  border: none;
  outline: none;
  width: 100%;
  box-sizing: border-box;
  background-color: var(--btn-bg);
  color: var(--cu-color-neutral-text);
  transition: all 150ms ease;
}

/* sizes */
.cu-input--sm {
  padding: var(--cu-space-sm) var(--cu-space-md);
  font-size: var(--cu-font-size-xs);
}

.cu-input--lg {
  padding: var(--cu-space-lg) var(--cu-space-xl);
  font-size: var(--cu-font-size-md);
}

.cu-input::placeholder {
  color: var(--cu-color-neutral-text);
  opacity: 0.5;
}

.cu-input:focus {
  box-shadow: 0 0 0 var(--cu-border-thin) var(--btn-subtle-border);
}

/* subtle */
.cu-input--subtle {
  background-color: var(--btn-subtle);
  border: var(--cu-border-thin) solid var(--btn-subtle-border);
}
.cu-input--subtle:hover {
  background-color: var(--btn-subtle-hover);
}

/* soft */
.cu-input--soft {
  background-color: var(--btn-soft);
}
.cu-input--soft:hover {
  background-color: var(--btn-soft-hover);
}

/* ghost */
.cu-input--ghost {
  background-color: transparent;
}
.cu-input--ghost:hover {
  background-color: var(--btn-bg-hover);
}

/* outlined */
.cu-input--outlined {
  background-color: transparent;
  border: var(--cu-border-thin) solid var(--btn-subtle-border);
}
.cu-input--outlined:hover {
  background-color: var(--btn-bg-hover);
}

/* disabled */
.cu-input--disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}
</style>
