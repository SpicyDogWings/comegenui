<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { getBgClasses, getFgClasses } from "../utils/palette";
import Button from "./Button.vue";

const props = defineProps({
  color: {
    type: String,
    required: false,
    default: "#2c2c2c",
    validator: (value: string) =>
      /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/i.test(value),
  },
  hightContrast: {
    type: Boolean,
    required: false,
    default: false,
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
  close: {
    type: Boolean,
    required: false,
    default: false,
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

const bgClass = computed(() =>
  getBgClasses(props.color, props.variant, props.hightContrast),
);
const fgClass = computed(() =>
  getFgClasses(props.color, props.variant, props.hightContrast),
);

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

defineExpose({
  open,
  close,
  toggle,
  get isOpen() { return internalShow.value },
});
</script>

<template>
  <div v-show="internalShow" class="p-5 rounded-cu font-sans flex flex-wrap justify-start items-start text-[var(--btn-fg)] bg-[var(--btn-bg)]" role="alert"
    :class="{
      'bg-opacity-10': props.variant === 'soft',
      'bg-opacity-10 border-solid border-1': props.variant === 'subtle',
      'border-[var(--btn-bd)]': props.variant === 'subtle' || props.variant === 'outlined',
      'bg-transparent border-solid border-2': props.variant === 'outlined',
      'bg-transparent': props.variant === 'ghost',
    }"
    :style="{
      '--btn-fg': fgClass.main,
      '--btn-bg': bgClass.main,
      '--btn-bg-hover': bgClass.hover,
      '--btn-bg-active': bgClass.active,
      '--btn-bd': fgClass.border,
    }"
  >
    <div class="w-full flex justify-between items-center">
      <div class="flex justify-center items-center gap-2">
        <slot name="icon"></slot>
        <h3 v-if="props.title" class="font-bold m-0 text-[var(--btn-fg)]">{{ props.title }}</h3>
      </div>
      <Button
        v-if="props.close"
        @click="close"
        :color="props.color"
        variant="ghost"
        aria-label="Cerrar alerta"
        class="px-2 -translate-x-4 -translate-y-4"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"> <path d="M18 6 6 18"/> <path d="m6 6 12 12"/> </svg>
      </Button>
    </div>
    <div class="w-full text-[var(--btn-fg)]">
      <slot></slot>
    </div>
  </div>
</template>

<style>
@unocss-placeholder;
</style>
