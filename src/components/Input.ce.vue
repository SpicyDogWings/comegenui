<script setup lang="ts">
import { computed, ref, watch } from "vue";

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
    default: "neutral",
    validator: (value: string) =>
      ["primary", "neutral", "success", "warning", "danger"].includes(value),
  },
  variant: {
    type: String,
    required: false,
    default: "none",
    validator: (value: string) => ["outlined", "soft", "ghost", "subtle", "none"].includes(value),
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
});

const inputValue = ref(props.modelValue || props.startValue);
const emit = defineEmits(["update:modelValue"]);

watch(
  () => props.modelValue,
  (val) => {
    inputValue.value = val;
  },
  { immediate: true },
);

const inputClasses = computed(() => [
  "py-2",
  "px-3",
  "rounded-cu",
  "font-sans",
  "border-none",
  "placeholder:text-charcoal-400",
  "text-neutral-800",
  "focus:outline-none",
  "focus:ring-2",
  {
    "cursor-not-allowed opacity-70": props.disabled,
  },
  {
    "focus:ring-primary-300": props.color === "primary",
    "focus:ring-charcoal-300": props.color === "neutral",
    "focus:ring-success-300": props.color === "success",
    "focus:ring-warning-300": props.color === "warning",
    "focus:ring-danger-300": props.color === "danger",
  },
  {
    "bg-primary-50 border-solid border-1 border-primary-300":
      props.color === "primary" && props.variant === "subtle",
  },
  {
    "bg-transparent border-solid border-2 border-primary":
      props.color === "primary" && props.variant === "outlined",
  },
  {
    "bg-primary-50 hover:bg-primary-100": props.color === "primary" && props.variant === "soft",
  },
  {
    "bg-transparent hover:bg-primary-50": props.color === "primary" && props.variant === "ghost",
  },
  {
    "bg-charcoal-50 border-solid border-1 border-charcoal-300":
      props.color === "neutral" && props.variant === "subtle",
  },
  {
    "bg-transparent border-solid border-2 border-charcoal-800":
      props.color === "neutral" && props.variant === "outlined",
  },
  {
    "bg-charcoal-50 hover:bg-charcoal-100": props.color === "neutral" && props.variant === "soft",
  },
  {
    "bg-transparent hover:bg-charcoal-50": props.color === "neutral" && props.variant === "ghost",
  },
  {
    "bg-success-50 border-solid border-1 border-success-300":
      props.color === "success" && props.variant === "subtle",
  },
  {
    "bg-transparent border-solid border-2 border-success":
      props.color === "success" && props.variant === "outlined",
  },
  {
    "bg-success-50 hover:bg-success-100": props.color === "success" && props.variant === "soft",
  },
  {
    "bg-transparent hover:bg-success-50": props.color === "success" && props.variant === "ghost",
  },
  {
    "bg-warning-50 border-solid border-1 border-warning-300":
      props.color === "warning" && props.variant === "subtle",
  },
  {
    "bg-transparent border-solid border-2 border-warning":
      props.color === "warning" && props.variant === "outlined",
  },
  {
    "bg-warning-50 hover:bg-warning-100": props.color === "warning" && props.variant === "soft",
  },
  {
    "bg-transparent hover:bg-warning-50": props.color === "warning" && props.variant === "ghost",
  },
  {
    "bg-danger-50 border-solid border-1 border-danger-300":
      props.color === "danger" && props.variant === "subtle",
  },
  {
    "bg-transparent border-solid border-2 border-danger":
      props.color === "danger" && props.variant === "outlined",
  },
  {
    "bg-danger-50 hover:bg-danger-100": props.color === "danger" && props.variant === "soft",
  },
  {
    "bg-transparent hover:bg-danger-50": props.color === "danger" && props.variant === "ghost",
  },
  {
    "bg-transparent border-solid border-1 border-charcoal-100": props.variant === "none",
  },
]);

const get = () => {
  return inputValue.value;
};

const set = (value: string | number) => {
  inputValue.value = value;
};

const reset = () => {
  inputValue.value = "";
};

defineExpose({
  get,
  set,
  reset,
});
</script>

<template>
  <input
    :type="props.type"
    :placeholder="props.placeholder"
    :value="inputValue"
    @input="(e) => { inputValue = (e.target as HTMLInputElement).value; emit('update:modelValue', inputValue); }"
    :class="inputClasses"
    :disabled="props.disabled"
    :readonly="props.readOnly"
    class="box-border"
  />
</template>

<style>
@unocss-placeholder;
</style>
