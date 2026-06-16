<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import Button from "./Button.vue";

const props = defineProps({
  color: { type: String, required: false, default: "#2c2c2c" },
  hightContrast: { type: Boolean, required: false, default: false },
  variant: { type: String, required: false, default: "ghost" },
  disabled: { type: Boolean, required: false, default: false },
  label: { type: String, required: false, default: "" },
  placement: { type: String, required: false, default: "bottom-start" },
  offset: { type: Number, required: false, default: 4 },
  menuBg: { type: String, required: false, default: "#ffffff" },
});

const emit = defineEmits(["open", "close"]);
const isOpen = ref(false);
const dropdownRef = ref<HTMLElement | null>(null);

function onDocumentClick(e: MouseEvent) {
  if (!isOpen.value || !dropdownRef.value) return;
  if (!e.composedPath().includes(dropdownRef.value)) {
    isOpen.value = false;
    emit("close");
  }
}

function onKeyDown(e: KeyboardEvent) {
  if (e.key === "Escape" && isOpen.value) {
    isOpen.value = false;
    emit("close");
  }
}

onMounted(() => {
  document.addEventListener("click", onDocumentClick, true);
  document.addEventListener("keydown", onKeyDown);
});
onUnmounted(() => {
  document.removeEventListener("click", onDocumentClick, true);
  document.removeEventListener("keydown", onKeyDown);
});

function open() {
  if (props.disabled) return;
  isOpen.value = true;
  emit("open");
}
function close() {
  isOpen.value = false;
  emit("close");
}
function toggle() {
  if (props.disabled) return;
  if (isOpen.value) close();
  else open();
}

defineExpose({ open, close, toggle, get isOpen() { return isOpen.value } });
</script>

<template>
  <div ref="dropdownRef" class="relative inline-block box-border">
    <slot name="toggle" :toggle="toggle" :isOpen="isOpen">
      <Button
        :color="color"
        :variant="variant"
        :disabled="disabled"
        :hight-contrast="hightContrast"
        @click="toggle"
      >
        {{ label || "Dropdown" }}
      </Button>
    </slot>

    <div
      v-if="isOpen"
      :style="{ '--menu-bg': menuBg, '--offset': offset + 'px' }"
      class="absolute z-1000 min-w-[200px] max-w-[80vw] rounded-cu p-2 font-sans shadow-xl bg-[var(--menu-bg)]"
      :class="{
        'top-full left-0 mt-[var(--offset)]': placement === 'bottom-start',
        'top-full right-0 mt-[var(--offset)]': placement === 'bottom-end',
        'bottom-full left-0 mb-[var(--offset)]': placement === 'top-start',
        'bottom-full right-0 mb-[var(--offset)]': placement === 'top-end',
      }"
      role="menu"
    >
      <slot></slot>
    </div>
  </div>
</template>

<style>
@unocss-placeholder;
</style>
