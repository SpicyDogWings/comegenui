<script setup lang="ts">
import { computed, ref, watch, type PropType } from "vue";
import { useMagicKeys, whenever } from "@vueuse/core";
import Button from "../buttons/Button.vue";

const props = defineProps({
  color: {
    type: String as PropType<'primary' | 'secondary' | 'neutral' | 'success' | 'warning' | 'danger'>,
    required: false,
    default: "neutral",
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
  persistent: {
    type: Boolean,
    required: false,
    default: false,
  },
  size: {
    type: String,
    required: false,
    default: "auto",
    validator: (value: string) => ["auto", "sm", "md", "lg", "xl", "full"].includes(value),
  },
  height: {
    type: String,
    required: false,
    default: "auto",
    validator: (value: string) => ["auto", "sm", "md", "lg", "xl", "full"].includes(value),
  },
});

const emit = defineEmits(["close", "opened", "closed"]);

const isOpen = ref(false);

const colorStyles = computed(() => ({
  '--modal-color': `var(--cu-color-${props.color})`,
}));

function open() {
  isOpen.value = true;
}
function close() {
  isOpen.value = false;
}
function toggle() {
  isOpen.value = !isOpen.value;
}

const keys = useMagicKeys({ target: window });
whenever(() => keys.Escape?.value, () => !props.persistent && isOpen.value && close());

function handleBackdropClick(event: MouseEvent) {
  if (!props.persistent && event.target === event.currentTarget) {
    close();
  }
}

watch(isOpen, (newVal) => {
  emit(newVal ? "opened" : "closed");
  if (!newVal) emit("close");
});

defineExpose({
  open,
  close,
  toggle,
  isOpen: () => isOpen.value,
});
</script>

<template>
  <div
    v-show="isOpen"
    @click="handleBackdropClick"
    tabindex="-1"
    role="dialog"
    class="cu-modal-backdrop"
    aria-modal="true"
    :aria-labelledby="title ? 'modal-title' : undefined"
    :aria-describedby="description ? 'modal-description' : undefined"
  >
    <div
      class="cu-modal"
      :style="colorStyles"
      :data-size="size"
      :data-height="height"
    >
      <header class="cu-modal-header">
        <div class="cu-modal-header-text">
          <div v-if="title" class="cu-modal-title-row">
            <slot name="icon" />
            <h2
              id="modal-title"
              class="cu-modal-title"
            >
              {{ title }}
            </h2>
          </div>
          <p
            v-if="description"
            id="modal-description"
            class="cu-modal-description"
          >
            {{ description }}
          </p>
        </div>
        <Button
          v-if="!persistent"
          :color="color"
          variant="ghost"
          @click="close"
          class="cu-modal-close"
          aria-label="Cerrar modal"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        </Button>
      </header>

      <main class="cu-modal-body">
        <slot></slot>
      </main>

      <footer class="cu-modal-footer">
        <slot name="footer"></slot>
      </footer>
    </div>
  </div>
</template>

<style>
.cu-modal-backdrop {
  z-index: 1000;
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--cu-space-md);
  background-color: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(4px);
}

.cu-modal {
  background-color: var(--cu-color-surface);
  color: var(--cu-color-neutral);
  border-radius: var(--cu-radius-lg);
  box-shadow: var(--cu-shadow-xl);
  padding: var(--cu-space-md);
  width: 100%;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
  box-sizing: border-box;
}

/* size */
.cu-modal[data-size="auto"] { max-width: var(--cu-modal-size-auto, 50vw); }
.cu-modal[data-size="sm"] { max-width: var(--cu-modal-size-sm, 25vw); }
.cu-modal[data-size="md"] { max-width: var(--cu-modal-size-md, 30vw); }
.cu-modal[data-size="lg"] { max-width: var(--cu-modal-size-lg, 35vw); }
.cu-modal[data-size="xl"] { max-width: var(--cu-modal-size-xl, 40vw); }
.cu-modal[data-size="full"] { max-width: var(--cu-modal-size-full, 90vw); }

/* height */
.cu-modal[data-height="auto"] { max-height: var(--cu-modal-height-auto, 50vh); }
.cu-modal[data-height="sm"] { max-height: var(--cu-modal-height-sm, 30vh); }
.cu-modal[data-height="md"] { max-height: var(--cu-modal-height-md, 40vh); }
.cu-modal[data-height="lg"] { max-height: var(--cu-modal-height-lg, 50vh); }
.cu-modal[data-height="xl"] { max-height: var(--cu-modal-height-xl, 60vh); }
.cu-modal[data-height="full"] { max-height: var(--cu-modal-height-full, 90vh); }

.cu-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: var(--cu-space-lg);
  gap: var(--cu-space-md);
}

.cu-modal-header-text {
  display: flex;
  flex-direction: column;
  gap: var(--cu-space-2xs);
  min-width: 0;
}

.cu-modal-title-row {
  display: flex;
  align-items: center;
  gap: var(--cu-space-sm);
}

.cu-modal-title {
  font-family: var(--cu-font-sans);
  font-size: var(--cu-font-size-lg);
  font-weight: var(--cu-font-weight-bold);
  margin: 0;
  color: var(--modal-color);
}

.cu-modal-description {
  font-family: var(--cu-font-sans);
  font-size: var(--cu-font-size-sm);
  margin: 0;
  color: var(--cu-color-neutral);
  opacity: 0.7;
}

.cu-modal-close {
  flex-shrink: 0;
  padding: var(--cu-space-sm) !important;
  height: auto !important;
  width: auto !important;
}

.cu-modal-body {
  padding: 0 var(--cu-space-lg) var(--cu-space-lg);
  flex: 1;
  min-height: 0;
  overflow-y: auto;
}

.cu-modal-body > * {
  width: 100%;
  overflow-x: hidden;
}

.cu-modal-footer {
  padding: var(--cu-space-lg);
  border-top: var(--cu-border-thin) solid var(--cu-border-color);
}
</style>
