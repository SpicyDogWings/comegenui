<script setup lang="ts">
import { computed, ref, watch, useTemplateRef } from "vue";
import { getBgClasses, getFgClasses } from "../../utils/palette";
import { useFocus } from "@vueuse/core";

const props = defineProps({
  modelValue: {
    type: String,
    required: false,
    default: "",
  },
  startValue: {
    type: String,
    required: false,
  },
  color: {
    type: String,
    required: false,
    default: "#2c2c2c",
    validator: (value: string) =>
      /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/i.test(value),
  },
  variant: {
    type: String,
    required: false,
    default: "ghost",
    validator: (value: string) =>
      ["outlined", "soft", "ghost", "subtle", "none"].includes(value),
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
  hightContrast: {
    type: Boolean,
    required: false,
    default: false,
  },
});

const inputValue = ref(props.modelValue || props.startValue);
const emit = defineEmits(["update:modelValue"]);

const inputRef = useTemplateRef("input");
const { focused: inputFocus } = useFocus(inputRef);

const bgClass = computed(() =>
  getBgClasses(props.color, props.variant, props.hightContrast),
);
const fgClass = computed(() =>
  getFgClasses(props.color, props.variant, props.hightContrast),
);



const get = () => {
  return inputValue.value;
};
const set = (value: string | number) => {
  inputValue.value = String(value);
};
const reset = () => {
  inputValue.value = "";
};

watch(
  () => props.modelValue,
  (val) => {
    inputValue.value = val;
  },
  { immediate: true },
);

defineExpose({
  get,
  set,
  reset,
  focus: () => inputFocus.value = true,
});
</script>

<template>
  <input
    ref="input"
    :type="props.type"
    :placeholder="props.placeholder"
    :value="inputValue"
    @input="
      (e) => {
        inputValue = (e.target as HTMLInputElement).value;
        emit('update:modelValue', inputValue);
      }
    "
    class="py-2 px-3 rounded-cu font-sans border-none text-[var(--btn-fg)] focus:outline-none focus:ring-2 w-full bg-[var(--btn-bg)] box-border"
    :class="{
      'focus:ring-[var(--btn-bd)]': true,
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
  />
</template>

<style>
@unocss-placeholder;
</style>
