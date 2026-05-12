<script setup lang="ts">
import { ref, watch } from "vue";
import { useMagicKeys, whenever } from "@vueuse/core";
import Button from "./Button.vue";

const props = defineProps({
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
  get isOpen() { return isOpen.value },
});

</script>

<template>
  <div
    v-show="isOpen"
    @click="handleBackdropClick"
    tabindex="-1"
    role="dialog"
    class="z-1000 fixed inset-0 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm"
    aria-modal="true"
    :aria-labelledby="title ? 'modal-title' : undefined"
    :aria-describedby="description ? 'modal-description' : undefined"
  >
    <div class="bg-charcoal-50 rounded-cu shadow-xl outline-none w-full flex flex-col overflow-x-hidden" :class="{
      'max-w-[50vw]': size === 'auto',
      'max-w-sm': size === 'sm',
      'max-w-md': size === 'md',
      'max-w-lg': size === 'lg',
      'max-w-xl': size === 'xl',
      'max-w-[90vw]': size === 'full',
      'max-h-[50vh]': height === 'auto',
      'max-h-sm': height === 'sm',
      'max-h-md': height === 'md',
      'max-h-lg': height === 'lg',
      'max-h-xl': height === 'xl',
      'max-h-[90vh]': height === 'full',
    }">
      <header class="p-4 relative">
        <Button
          v-if="!props.persistent"
          color="#2c2c2c"
          variant="ghost"
          @click="close"
          class="absolute top-4 right-4 p-1 h-auto w-auto"
          aria-label="Cerrar modal"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        </Button>
        <h2
          v-if="title"
          id="modal-title"
          class="font-bold text-lg font-sans text-charcoal-800"
        >
          {{ title }}
        </h2>
        <p
          v-if="description"
          id="modal-description"
          class="text-sm font-sans mt-1 text-charcoal-600"
        >
          {{ description }}
        </p>
      </header>

      <main class="p-4 flex-1 min-h-0 overflow-y-auto">
        <div class="w-full overflow-x-hidden">
          <slot></slot>
        </div>
      </main>

      <footer class="p-4">
        <slot name="footer"></slot>
      </footer>
    </div>
  </div>
</template>

<style>
@unocss-placeholder;
</style>
