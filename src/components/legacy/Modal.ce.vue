<script setup lang="ts">
import { computed, ref } from "vue";
import Modal from "./Modal.vue";
import { getColorMap } from "../utils/palette";
import { getHostTheme } from "../utils/getHostTheme";
import { isValidTheme } from "../config/theme";

const props = defineProps({
  theme: {
    type: String,
    required: false,
    default: "",
    validator: isValidTheme,
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
    default: "ghost",
    validator: (value: string) =>
      ["solid", "outlined", "soft", "ghost", "subtle", "link", "none"].includes(value),
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
  hightContrast: {
    type: Boolean,
    required: false,
    default: false,
  },
});

const emit = defineEmits(["close", "opened", "closed"]);

const effectiveTheme = computed(() => props.theme || getHostTheme());
const hexColor = computed(() => {
  const map = getColorMap(effectiveTheme.value as "light" | "dark");
  return map[props.color as keyof typeof map] || props.color;
});

const modalRef = ref<InstanceType<typeof Modal> | null>(null);

function open() {
  modalRef.value?.open();
}
function close() {
  modalRef.value?.close();
}
function toggle() {
  modalRef.value?.toggle();
}

defineExpose({
  open,
  close,
  toggle,
  isOpen: () => modalRef.value?.isOpen || false,
});
</script>

<template>
  <Modal
    ref="modalRef"
    :theme="effectiveTheme"
    :color="hexColor"
    :variant="props.variant"
    :title="props.title"
    :description="props.description"
    :persistent="props.persistent"
    :size="props.size"
    :height="props.height"
    :hight-contrast="props.hightContrast"
    @close="emit('close')"
    @opened="emit('opened')"
    @closed="emit('closed')"
  >
    <slot></slot>
    <template #footer>
      <slot name="footer"></slot>
    </template>
  </Modal>
</template>

<style>
@unocss-placeholder;
</style>
