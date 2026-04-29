<script setup lang="ts">
import { ref, watch, computed } from "vue";
import Button from "./Button.ce.vue";

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  title: {
    type: String,
    required: false,
    default: "",
  },
  size: {
    type: String,
    required: false,
    default: "md",
    validator: (value: string) => ["sm", "md", "lg", "xl", "full"].includes(value),
  },
  color: {
    type: String,
    required: false,
    default: "neutral",
    validator: (value: string) =>
      ["primary", "neutral", "success", "warning", "danger"].includes(value),
  },
  closable: {
    type: Boolean,
    required: false,
    default: true,
  },
  persistent: {
    type: Boolean,
    required: false,
    default: false,
  },
});

const emit = defineEmits(["update:modelValue", "close", "opened", "closed"]);

const modalRef = ref<HTMLElement | null>(null);
const isOpen = ref(props.modelValue);

// Sync with v-model
watch(
  () => props.modelValue,
  (newVal) => {
    isOpen.value = newVal;
    if (newVal) {
      emit("opened");
    } else {
      emit("closed");
    }
  }
);

watch(
  isOpen,
  (newVal) => {
    emit("update:modelValue", newVal);
    if (!newVal) {
      emit("close");
    }
  }
);

const overlayClasses = computed(() => [
  "fixed inset-0 z-50 flex items-center justify-center p-4",
  "bg-black/30 backdrop-blur-sm",
  { "opacity-0 pointer-events-none": !isOpen.value },
  { "opacity-100": isOpen.value },
]);

const modalClasses = computed(() => [
  "bg-charcoal-50 rounded-cu shadow-xl border-collapse",
  "max-h-[90vh] overflow-auto",
  {
    "w-full max-w-sm": props.size === "sm",
    "w-full max-w-md": props.size === "md",
    "w-full max-w-lg": props.size === "lg",
    "w-full max-w-xl": props.size === "xl",
    "w-full max-w-[90vw] max-h-[90vh]": props.size === "full",
  },
  {
    "border-2 border-primary": props.color === "primary",
    "border-2 border-charcoal-800": props.color === "neutral",
    "border-2 border-success": props.color === "success",
    "border-2 border-warning": props.color === "warning",
    "border-2 border-danger": props.color === "danger",
  },
]);

const headerClasses = computed(() => [
  "p-4 border-b border-charcoal-200 flex justify-between items-center",
  {
    "border-primary-200": props.color === "primary",
    "border-charcoal-300": props.color === "neutral",
    "border-success-200": props.color === "success",
    "border-warning-200": props.color === "warning",
    "border-danger-200": props.color === "danger",
  },
]);

const footerClasses = computed(() => [
  "p-4 border-t border-charcoal-200 flex justify-end items-center gap-3",
  {
    "border-primary-200": props.color === "primary",
    "border-charcoal-300": props.color === "neutral",
    "border-success-200": props.color === "success",
    "border-warning-200": props.color === "warning",
    "border-danger-200": props.color === "danger",
  },
]);

const titleColor = computed(() => {
  switch (props.color) {
    case "primary":
      return "text-primary-600";
    case "success":
      return "text-success-600";
    case "warning":
      return "text-warning-600";
    case "danger":
      return "text-danger-600";
    default:
      return "text-charcoal-800";
  }
});

function close() {
  if (!props.persistent) {
    isOpen.value = false;
  }
}

function handleBackdropClick(event: MouseEvent) {
  if (props.closable && event.target === modalRef.value?.parentElement) {
    close();
  }
}

function handleKeydown(event: KeyboardEvent) {
  if (props.closable && event.key === "Escape") {
    close();
  }
}
</script>

<template>
  <div
      v-if="isOpen"
      ref="modalRef"
      :class="overlayClasses"
      @click="handleBackdropClick"
      @keydown.esc="handleKeydown"
      tabindex="-1"
      role="dialog"
      aria-modal="true"
      :aria-labelledby="title ? 'modal-title' : undefined"
    >
      <div :class="modalClasses">
        <header v-if="$slots.header || title || closable" :class="headerClasses">
          <h2
            v-if="title"
            id="modal-title"
            :class="['font-bold text-lg font-sans', titleColor]"
          >
            {{ title }}
          </h2>
          <div class="flex-1"></div>
          <slot name="header"></slot>
          <Button
            v-if="closable"
            color="neutral"
            variant="ghost"
            @click="close"
            class="p-1 h-auto w-auto"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </Button>
        </header>

        <main class="p-4">
          <slot></slot>
        </main>

        <footer v-if="$slots.footer" :class="footerClasses">
          <slot name="footer"></slot>
        </footer>
      </div>
    </div>
</template>

<style>
@unocss-placeholder;
</style>
