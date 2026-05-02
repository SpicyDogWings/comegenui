<script setup lang="ts">
import { computed, ref, watch } from "vue";
import Button from "./Button.ce.vue";

const props = defineProps({
  close: {
    type: Boolean,
    required: false,
    default: false,
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
    default: "soft",
    validator: (value: string) =>
      ["solid", "outlined", "soft", "ghost", "subtle"].includes(value),
  },
  title: {
    type: String,
    required: false,
  },
  show: {
    type: Boolean,
    required: false,
    default: true,
  },
});

const emit = defineEmits(["close", "open", "update:show"]);

const internalShow = ref(props.show);

watch(() => props.show, (val) => {
  internalShow.value = val;
});
watch(internalShow, (val) => {
  emit("update:show", val);
});

function open() {
  internalShow.value = true;
  emit("open");
}
function close() {
  internalShow.value = false;
  emit("close");
}
function toggle() {
  internalShow.value = !internalShow.value;
  emit(internalShow.value ? "open" : "close");
}

const alertColorClasses = computed(() => [
  /* Regla general para outlined */
  {
    "bg-transparent border-solid border-2": props.variant === "outlined",
  },
  /* Regla general para ghost */
  {
    "bg-transparent": props.variant === "ghost",
  },
  /* Regla general para subtle */
  {
    "bg-opacity-10 border-solid border-1": props.variant === "subtle",
  },
  /* Primary */
  {
    "bg-primary text-primary-50": props.color === "primary" && props.variant === "solid",
    "bg-primary bg-opacity-10 text-primary": props.color === "primary" && props.variant === "soft",
    "bg-primary text-primary border-primary-300":
      props.color === "primary" && props.variant === "subtle",
    "border-primary text-primary":
      props.color === "primary" && props.variant === "outlined",
    "text-primary": props.color === "primary" && props.variant === "ghost",
  },
  /* Neutral */
  {
    "bg-charcoal text-charcoal-50": props.color === "neutral" && props.variant === "solid",
    "bg-charcoal bg-opacity-10 text-charcoal-800": props.color === "neutral" && props.variant === "soft",
    "bg-charcoal text-charcoal-800 border-charcoal-300":
      props.color === "neutral" && props.variant === "subtle",
    "border-charcoal-800 text-charcoal-800":
      props.color === "neutral" && props.variant === "outlined",
    "text-charcoal-800": props.color === "neutral" && props.variant === "ghost",
  },
  /* Success */
  {
    "bg-success text-success-50": props.color === "success" && props.variant === "solid",
    "bg-success bg-opacity-10 text-success-600": props.color === "success" && props.variant === "soft",
    "bg-success text-success-600 border-success-300":
      props.color === "success" && props.variant === "subtle",
    "border-success text-success":
      props.color === "success" && props.variant === "outlined",
    "text-success-600": props.color === "success" && props.variant === "ghost",
  },
  /* Warning */
  {
    "bg-warning text-warning-50": props.color === "warning" && props.variant === "solid",
    "bg-warning bg-opacity-10 text-warning-500": props.color === "warning" && props.variant === "soft",
    "bg-warning text-warning-500 border-warning-300":
      props.color === "warning" && props.variant === "subtle",
    "border-warning text-warning":
      props.color === "warning" && props.variant === "outlined",
    "text-warning-500": props.color === "warning" && props.variant === "ghost",
  },
  /* Danger */
  {
    "bg-danger text-danger-50": props.color === "danger" && props.variant === "solid",
    "bg-danger bg-opacity-10 text-danger": props.color === "danger" && props.variant === "soft",
    "bg-danger text-danger border-danger-300":
      props.color === "danger" && props.variant === "subtle",
    "border-danger text-danger":
      props.color === "danger" && props.variant === "outlined",
    "text-danger": props.color === "danger" && props.variant === "ghost",
  },
]);

defineExpose({
  open,
  close,
  toggle,
  get isOpen() { return internalShow.value },
});
</script>

<template>
  <div v-show="internalShow" class="p-5 rounded-cu font-sans flex flex-wrap justify-start items-start" role="alert" :class="alertColorClasses">
    <div class="w-full flex justify-between items-center">
      <div class="flex justify-center items-center gap-3">
        <slot name="icon"></slot>
        <h3 v-if="props.title" class="font-bold m-0">{{ props.title }}</h3>
      </div>
      <Button
        v-if="props.close"
        @click="close"
        :color="props.color"
        variant="ghost"
        aria-label="Cerrar alerta"
        class="px-2 transform-translate-x-4 -transform-translate-y-4"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"> <path d="M18 6 6 18"/> <path d="m6 6 12 12"/> </svg>
      </Button>
    </div>
    <div class="w-full">
      <slot></slot>
    </div>
  </div>
</template>

<style>
@unocss-placeholder;
</style>
