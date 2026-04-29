<script setup lang="ts">
import { ref, watch, computed, onMounted, onUnmounted, nextTick, getCurrentInstance } from "vue";
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
  description: {
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
const footerSlotRef = ref<HTMLElement | null>(null);
const movedFooterNodes = ref<HTMLElement[]>([]);

// Internal state that syncs with prop
const isOpen = ref(props.modelValue);

// Para web components: obtener el host element y mover slots al footer
function moveFooterSlots() {
  nextTick(() => {
    const instance = getCurrentInstance();
    const hostEl = instance?.vnode.el as HTMLElement | null;
    const container = modalRef.value;
    
    if (!hostEl || !container) return;

    const footerNodes = Array.from(hostEl.children).filter(
      (child) => child.getAttribute('slot') === 'footer'
    );
    
    const footerElement = footerSlotRef.value;
    if (footerElement && footerNodes.length > 0) {
      footerNodes.forEach(node => {
        hostEl.removeChild(node);
        footerElement.appendChild(node);
        movedFooterNodes.value.push(node);
      });
    }
  });
}

function focusModal() {
  nextTick(() => {
    modalRef.value?.focus();
  });
}

// Watch external changes (from v-model binding)
watch(
  () => props.modelValue,
  (newVal) => {
    isOpen.value = newVal;
    emit(newVal ? "opened" : "closed");
    if (newVal) {
      focusModal();
      moveFooterSlots();
    }
  }
);

// Watch internal changes and emit
watch(
  isOpen,
  (newVal) => {
    emit("update:modelValue", newVal);
    if (!newVal) emit("close");
  }
);

// Devolver nodos al host cuando se cierra
watch(() => isOpen.value, (newVal) => {
  if (!newVal && movedFooterNodes.value.length > 0) {
    const instance = getCurrentInstance();
    const hostEl = instance?.vnode.el as HTMLElement | null;
    if (hostEl) {
      movedFooterNodes.value.forEach(node => {
        hostEl.appendChild(node);
      });
      movedFooterNodes.value = [];
    }
  }
});

const overlayClasses = computed(() => [
  "fixed inset-0 z-50 flex items-center justify-center p-4",
  "bg-black/30 backdrop-blur-sm",
  { "opacity-0 pointer-events-none": !isOpen.value },
  { "opacity-100": isOpen.value },
]);

const modalClasses = computed(() => [
  "bg-charcoal-50 rounded-cu shadow-xl outline-none",
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
  "p-4 border-b border-charcoal-200 relative",
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

const descriptionColor = computed(() => {
  switch (props.color) {
    case "primary":
      return "text-primary-500";
    case "success":
      return "text-success-500";
    case "warning":
      return "text-warning-500";
    case "danger":
      return "text-danger-500";
    default:
      return "text-charcoal-600";
  }
});

function close() {
  if (!props.persistent) {
    isOpen.value = false;
  }
}

function handleBackdropClick(event: MouseEvent) {
  if (props.closable && event.target === (event.currentTarget as HTMLElement)) {
    close();
  }
}

function handleKeydown(event: KeyboardEvent) {
  if (props.closable && event.key === "Escape" && isOpen.value) {
    close();
  }
}

onMounted(() => window.addEventListener("keydown", handleKeydown));
onUnmounted(() => window.removeEventListener("keydown", handleKeydown));
</script>

<template>
  <div
    v-if="isOpen"
    @click="handleBackdropClick"
    tabindex="-1"
    :class="overlayClasses"
  >
    <div
      :class="modalClasses"
      ref="modalRef"
      role="dialog"
      aria-modal="true"
      :aria-labelledby="title ? 'modal-title' : undefined"
      :aria-describedby="description ? 'modal-description' : undefined"
      tabindex="-1"
    >
      <header v-if="title || description || closable" :class="headerClasses">
        <Button
          v-if="closable"
          color="neutral"
          variant="ghost"
          @click="close"
          class="absolute top-4 right-4 p-1 h-auto w-auto"
          aria-label="Cerrar modal"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        </Button>
        <slot name="header"></slot>
        <h2
          v-if="title"
          id="modal-title"
          :class="['font-bold text-lg font-sans', titleColor]"
        >
          {{ title }}
        </h2>
        <p
          v-if="description"
          id="modal-description"
          :class="['text-sm font-sans mt-1', descriptionColor]"
        >
          {{ description }}
        </p>
      </header>

      <main class="p-4">
        <slot></slot>
      </main>

      <footer v-show="$slots.footer || footerSlotRef?.children.length" :class="footerClasses" ref="footerSlotRef">
        <slot name="footer"></slot>
      </footer>
    </div>
  </div>
</template>

<style>
@unocss-placeholder;
</style>
