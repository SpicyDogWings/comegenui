<script setup lang="ts">
import { ref, watch } from "vue";
import { useMagicKeys, whenever } from "@vueuse/core";
import Modal from "./Modal.vue";

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
    default: "md",
    validator: (value: string) => ["sm", "md", "lg", "xl", "full"].includes(value),
  },
  height: {
    type: String,
    required: false,
    default: "auto",
    validator: (value: string) => ["auto", "sm", "md", "lg", "xl", "full"].includes(value),
  },
});

const emit = defineEmits(["close", "opened", "closed"]);

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
  get isOpen() { return modalRef.value?.isOpen || false },
});
</script>

<template>
  <Modal
    ref="modalRef"
    :title="props.title"
    :description="props.description"
    :persistent="props.persistent"
    :size="props.size"
    :height="props.height"
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
