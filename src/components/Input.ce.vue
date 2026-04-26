<script setup lang="ts">
import { computed, onMounted, getCurrentInstance, ref, watch } from "vue";

const props = defineProps({
  value: {
    type: [String, Number],
    required: false,
    default: "",
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
    default: "outlined",
    validator: (value: string) =>
      ["solid", "outlined", "soft", "ghost", "subtle"].includes(value),
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
});

const emit = defineEmits(["update:value"]);
const inputRef = ref<HTMLInputElement | null>(null);

// Sincronizar cambios externos con el input interno
watch(
  () => props.value,
  (newVal) => {
    if (inputRef.value) {
      inputRef.value.value = String(newVal);
    }
  },
  { immediate: true }
);

// Exponer value como propiedad nativa del custom element
onMounted(() => {
  const instance = getCurrentInstance();
  const el = instance?.proxy?.$el as HTMLElement;
  
  if (el && !('value' in el)) {
    Object.defineProperty(el, 'value', {
      get: () => props.value,
      set: (v: string | number) => emit('update:value', v),
      configurable: true,
      enumerable: true
    });
  }
});

const inputClasses = computed(() => [
  "w-full",
  "py-2",
  "px-3",
  "rounded-cu",
  "font-sans",
  "border-none",
  "placeholder:text-charcoal-400",
  // Primary
  {
    "bg-primary text-primary-50 border-solid border-2 border-primary":
      props.color === "primary" && props.variant === "solid",
  },
  {
    "bg-primary-50 text-primary border-solid border-1 border-primary-300":
      props.color === "primary" && props.variant === "subtle",
  },
  {
    "bg-transparent border-solid border-2 border-primary text-primary":
      props.color === "primary" && props.variant === "outlined",
  },
  {
    "bg-primary-50 text-primary hover:bg-primary-100":
      props.color === "primary" && props.variant === "soft",
  },
  {
    "bg-transparent text-primary hover:bg-primary-50":
      props.color === "primary" && props.variant === "ghost",
  },
  // Neutral
  {
    "bg-charcoal text-charcoal-50 border-solid border-2 border-charcoal":
      props.color === "neutral" && props.variant === "solid",
  },
  {
    "bg-charcoal-50 text-charcoal-800 border-solid border-1 border-charcoal-300":
      props.color === "neutral" && props.variant === "subtle",
  },
  {
    "bg-transparent border-solid border-2 border-charcoal-800 text-charcoal-800":
      props.color === "neutral" && props.variant === "outlined",
  },
  {
    "bg-charcoal-50 text-charcoal-800 hover:bg-charcoal-100":
      props.color === "neutral" && props.variant === "soft",
  },
  {
    "bg-transparent text-charcoal-800 hover:bg-charcoal-50":
      props.color === "neutral" && props.variant === "ghost",
  },
  // Success
  {
    "bg-success text-success-50 border-solid border-2 border-success":
      props.color === "success" && props.variant === "solid",
  },
  {
    "bg-success-50 text-success-600 border-solid border-1 border-success-300":
      props.color === "success" && props.variant === "subtle",
  },
  {
    "bg-transparent border-solid border-2 border-success text-success":
      props.color === "success" && props.variant === "outlined",
  },
  {
    "bg-success-50 text-success-600 hover:bg-success-100":
      props.color === "success" && props.variant === "soft",
  },
  {
    "bg-transparent text-success-600 hover:bg-success-50":
      props.color === "success" && props.variant === "ghost",
  },
  // Warning
  {
    "bg-warning text-warning-50 border-solid border-2 border-warning":
      props.color === "warning" && props.variant === "solid",
  },
  {
    "bg-warning-50 text-warning-500 border-solid border-1 border-warning-300":
      props.color === "warning" && props.variant === "subtle",
  },
  {
    "bg-transparent border-solid border-2 border-warning text-warning":
      props.color === "warning" && props.variant === "outlined",
  },
  {
    "bg-warning-50 text-warning-500 hover:bg-warning-100":
      props.color === "warning" && props.variant === "soft",
  },
  {
    "bg-transparent text-warning-500 hover:bg-warning-50":
      props.color === "warning" && props.variant === "ghost",
  },
  // Danger
  {
    "bg-danger text-danger-50 border-solid border-2 border-danger":
      props.color === "danger" && props.variant === "solid",
  },
  {
    "bg-danger-50 text-danger border-solid border-1 border-danger-300":
      props.color === "danger" && props.variant === "subtle",
  },
  {
    "bg-transparent border-solid border-2 border-danger text-danger":
      props.color === "danger" && props.variant === "outlined",
  },
  {
    "bg-danger-50 text-danger hover:bg-danger-100":
      props.color === "danger" && props.variant === "soft",
  },
  {
    "bg-transparent text-danger hover:bg-danger-50":
      props.color === "danger" && props.variant === "ghost",
  },
]);
</script>

<template>
  <input
    ref="inputRef"
    :type="props.type"
    :placeholder="props.placeholder"
    :value="props.value"
    @input="(e) => emit('update:value', (e.target as HTMLInputElement).value)"
    class="w-full focus:outline-none focus:ring-2 focus:ring-primary-300"
    :class="inputClasses"
  />
</template>

<style>
@unocss-placeholder;
</style>
