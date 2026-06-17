<script setup lang="ts">
import { computed, defineModel, useTemplateRef } from "vue";
import { getBgClasses, getFgClasses } from "../../utils/palette";

const value = defineModel<string>({ default: "" });

const props = defineProps({
  startValue: {
    type: String,
    required: false,
  },
  color: {
    type: String,
    required: false,
    default: "#2c2c2c",
    validator: (value: string) => /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/i.test(value),
  },
  variant: {
    type: String,
    required: false,
    default: "none",
    validator: (value: string) => ["outlined", "soft", "ghost", "subtle", "none"].includes(value),
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

const bgClass = computed(() =>
  getBgClasses(props.color, props.variant, false),
);
const fgClass = computed(() =>
  getFgClasses(props.color, props.variant, false),
);

const get = () => value.value;
const set = (newValue: string | number) => { value.value = String(newValue); };
const reset = () => { value.value = ""; };
const focus = () => { textareaRef.value?.focus(); };

defineExpose({ get, set, reset, focus });
</script>

<template>
  <textarea
    ref="textarea"
    :placeholder="props.placeholder"
    :value="value"
    @input="value = ($event.target as HTMLTextAreaElement).value"
    class="py-2 px-3 rounded-cu font-sans border-none text-[var(--btn-fg)] focus:outline-none focus:ring-2 w-full bg-[var(--btn-bg)] box-border ph-op-100"
    :class="{
      'focus:ring-[var(--btn-bd)]': true,
      'resize-none': props.noResize,
      'cursor-not-allowed opacity-70 ph-op-50': props.disabled,
      'border-solid border-1 border-[var(--btn-bd)]': props.variant === 'subtle',
      'bg-transparent border-solid border-2 border-[var(--btn-bd)] hover:bg-[var(--btn-bg-hover)]': props.variant === 'outlined',
      'hover:bg-[var(--btn-bg-hover)]': props.variant === 'soft' || props.variant === 'ghost',
      'bg-transparent border-solid border-1 border-charcoal-100': props.variant === 'none',
    }"
    :style="{
      '--btn-fg': fgClass.main,
      '--btn-bg': bgClass.main,
      '--btn-bg-hover': bgClass.hover,
      '--btn-bg-active': bgClass.active,
      '--btn-bd': fgClass.border,
    }"
    :disabled="props.disabled"
    :readonly="props.readOnly"
    :rows="props.rows"
  />
</template>

<style>
@unocss-placeholder;
</style>
