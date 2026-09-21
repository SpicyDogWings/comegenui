<script setup lang="ts">
import { computed, defineModel, useTemplateRef } from "vue";

/** Valor actual del textarea (v-model). */
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
    validator: (value: string) => ["outlined", "soft", "ghost", "subtle"].includes(value),
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
  rows: {
    type: Number,
    required: false,
    default: 3,
  },
  noResize: {
    type: Boolean,
    required: false,
    default: false,
  },

});

const textareaRef = useTemplateRef("textarea");

const textareaStyles = computed(() => ({
  '--btn-bg': `var(--cu-color-${props.color})`,
  '--btn-bg-hover': `var(--cu-color-${props.color}-ghost-hover)`,
  '--btn-soft': `var(--cu-color-${props.color}-soft)`,
  '--btn-soft-hover': `var(--cu-color-${props.color}-soft-hover)`,
  '--btn-subtle': `var(--cu-color-${props.color}-subtle)`,
  '--btn-subtle-hover': `var(--cu-color-${props.color}-subtle-hover)`,
  '--btn-subtle-border': `var(--cu-color-${props.color}-subtle-border)`,
}));

/** Devuelve el valor actual del textarea. */
const get = () => value.value;
/** Setea el valor del textarea. */
const set = (newValue: string | number) => { value.value = String(newValue); };
/** Limpia el textarea. */
const reset = () => { value.value = ""; };
/** Enfoca el textarea. */
const focus = () => { textareaRef.value?.focus(); };

defineExpose({ get, set, reset, focus });
</script>

<template>
  <textarea
    ref="textarea"
    :placeholder="props.placeholder"
    :value="value"
    @input="value = ($event.target as HTMLTextAreaElement).value"
    class="cu-textarea"
    :class="[
      `cu-textarea--${props.variant}`,
      { 'cu-textarea--disabled': props.disabled, 'cu-textarea--no-resize': props.noResize },
    ]"
    :style="textareaStyles"
    :disabled="props.disabled"
    :readonly="props.readOnly"
    :rows="props.rows"
  />
</template>

<style scoped>
.cu-textarea {
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
  resize: vertical;
}

.cu-textarea::placeholder {
  color: var(--cu-color-neutral-text);
  opacity: 0.5;
}

.cu-textarea:focus {
  box-shadow: 0 0 0 var(--cu-border-thin) var(--btn-subtle-border);
}

.cu-textarea--no-resize {
  resize: none;
}

/* subtle */
.cu-textarea--subtle {
  background-color: var(--btn-subtle);
  border: var(--cu-border-thin) solid var(--btn-subtle-border);
}
.cu-textarea--subtle:hover {
  background-color: var(--btn-subtle-hover);
}

/* soft */
.cu-textarea--soft {
  background-color: var(--btn-soft);
}
.cu-textarea--soft:hover {
  background-color: var(--btn-soft-hover);
}

/* ghost */
.cu-textarea--ghost {
  background-color: transparent;
}
.cu-textarea--ghost:hover {
  background-color: var(--btn-bg-hover);
}

/* outlined */
.cu-textarea--outlined {
  background-color: transparent;
  border: var(--cu-border-thin) solid var(--btn-subtle-border);
}
.cu-textarea--outlined:hover {
  background-color: var(--btn-bg-hover);
}

/* disabled */
.cu-textarea--disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}
</style>
