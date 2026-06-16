<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import Button from "./Button.vue";

interface DropdownItem {
  label?: string;
  icon?: string;
  href?: string;
  onClick?: () => void;
  color?: string;
  variant?: string;
  disabled?: boolean;
  divider?: boolean;
  target?: string;
}

const props = defineProps({
  color: { type: String, required: false, default: "#2c2c2c" },
  hightContrast: { type: Boolean, required: false, default: false },
  variant: { type: String, required: false, default: "ghost" },
  disabled: { type: Boolean, required: false, default: false },
  label: { type: String, required: false, default: "" },
  placement: { type: String, required: false, default: "bottom-start" },
  offset: { type: Number, required: false, default: 4 },
  menuBg: { type: String, required: false, default: "#ffffff" },
  items: { type: Array as () => DropdownItem[], required: false, default: () => [] },
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

function handleItemClick(item: DropdownItem) {
  if (item.disabled || item.divider) return;
  if (item.onClick) item.onClick();
  close();
}

defineExpose({ open, close, toggle, get isOpen() { return isOpen.value } });
</script>

<template>
  <div ref="dropdownRef" class="relative inline-block box-border">
    <Button
      :color="color"
      :variant="variant"
      :disabled="disabled"
      :hight-contrast="hightContrast"
      @click="toggle"
    >
      {{ label || "Dropdown" }}
    </Button>

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
      <template v-if="items && items.length > 0">
        <template v-for="(item, i) in items" :key="i">
          <hr v-if="item.divider" class="my-1 w-[90%] mx-auto border-0 border-t border-t-neutral-50" />
          <Button
            v-else
            :color="item.color || color"
            :variant="item.variant || 'ghost'"
            :to="item.href"
            :target="item.target"
            :disabled="item.disabled"
            :hight-contrast="hightContrast"
            style="width:100%;justify-content:flex-start"
            @click="handleItemClick(item)"
          >
            <span v-if="item.icon" v-html="item.icon" class="transform translate-y-0.5"></span>
            <span v-if="item.label">{{ item.label }}</span>
          </Button>
        </template>
      </template>
      <slot v-else></slot>
    </div>
  </div>
</template>

<style>
@unocss-placeholder;
</style>
