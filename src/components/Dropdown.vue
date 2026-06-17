<script setup lang="ts">
import { ref, computed, defineModel, onMounted, onUnmounted } from "vue";
import Button from "./Button.vue";

const props = defineProps({
  color: { type: String, required: false, default: "#2c2c2c" },
  hightContrast: { type: Boolean, required: false, default: false },
  variant: { type: String, required: false, default: "ghost" },
  disabled: { type: Boolean, required: false, default: false },
  label: { type: String, required: false, default: "" },
  placement: { type: String, required: false, default: "bottom-start" },
  position: { type: String, required: false, default: "" },
  align: { type: String, required: false, default: "" },
  offset: { type: Number, required: false, default: 4 },
  menuBg: { type: String, required: false, default: "#ffffff" },
});

const effectivePosition = computed(() => props.position || props.placement.split("-")[0] || "bottom");
const effectiveAlign = computed(() => props.align || props.placement.split("-")[1] || "start");

const selectedValue = defineModel<string>({ default: "" });

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

function get() { return selectedValue.value; }
function set(val: string) { selectedValue.value = val; }
function reset() { selectedValue.value = ""; }

defineExpose({ open, close, toggle, get, set, reset, get isOpen() { return isOpen.value } });
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
      class="absolute z-1000 w-full min-w-[200px] max-w-[80vw] rounded-cu p-2 font-sans shadow-xl bg-[var(--menu-bg)]"
      :class="{
        'top-full': effectivePosition === 'bottom',
        'bottom-full': effectivePosition === 'top',
        'left-0': effectiveAlign === 'start',
        'right-0': effectiveAlign === 'end',
        'left-1/2 -translate-x-1/2': effectiveAlign === 'center',
        'mt-[var(--offset)]': effectivePosition === 'bottom',
        'mb-[var(--offset)]': effectivePosition === 'top',
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
