<script setup lang="ts">
import { ref, watch, computed } from "vue";

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
const hasTransitionedIn = ref(false);

// Sync with v-model
watch(
  () => props.modelValue,
  (newVal) => {
    isOpen.value = newVal;
    if (newVal) {
      emit("opened");
      hasTransitionedIn.value = false;
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
  "bg-black/30 backdrop-blur-sm transition-opacity duration-200",
  { "opacity-0": !isOpen.value },
  { "opacity-100": isOpen.value },
]);

const modalClasses = computed(() => [
  "bg-charcoal-50 rounded-cu shadow-xl border-collapse",
  "max-h-[90vh] overflow-auto transition-all duration-200",
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
  { "scale-95 opacity-0": !isOpen.value },
  { "scale-100 opacity-100": isOpen.value },
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

function handleTransitionEnd() {
  if (isOpen.value) {
    hasTransitionedIn.value = true;
  }
}
</script>

<template>
  <Transition name="modal-fade">
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
      <div
        :class="modalClasses"
        @transitionend="handleTransitionEnd"
      >
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
          <button
            v-if="closable"
            @click="close"
            class="p-1 rounded-cu hover:bg-charcoal-100 text-charcoal-600 hover:text-charcoal-800 text-2xl leading-none"
            aria-label="Cerrar modal"
          >
            &times;
          </button>
        </header>
        
        <main class="p-4">
          <slot></slot>
        </main>
        
        <footer v-if="$slots.footer" :class="footerClasses">
          <slot name="footer"></slot>
        </footer>
      </div>
    </div>
  </Transition>
</template>

<style>
@unocss-placeholder;

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.2s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-to,
.modal-fade-leave-from {
  opacity: 1;
}
</style>
