<script setup lang="ts">
import { ref, getCurrentInstance, type PropType } from "vue";
import Modal from "../../overlay/Modal.vue";
import { initTokens } from "@/plugins/cu-tokens/css";

initTokens();

const props = defineProps({
  /** Color semántico: `primary`, `neutral`, `success`, `warning`, `danger` */
  color: {
    type: String as PropType<'primary' | 'secondary' | 'neutral' | 'success' | 'warning' | 'danger'>,
    default: "neutral",
  },
  /** Título del modal (se muestra en la cabecera) */
  title: String,
  /** Descripción bajo el título (texto secundario) */
  description: String,
  /** Si es `true`, no se cierra con click en el backdrop ni con `Escape` */
  persistent: Boolean,
  /** Ancho del modal: `auto`, `sm`, `md`, `lg`, `xl`, `full` */
  size: { type: String, default: "auto" },
  /** Alto del modal: `auto`, `sm`, `md`, `lg`, `xl`, `full` */
  height: { type: String, default: "auto" },
});

const modalRef = ref<InstanceType<typeof Modal> | null>(null);

const instance = getCurrentInstance();
function ceEmit(event: string, payload: unknown) {
  const el = instance?.vnode.el as HTMLElement | null;
  const host = el?.getRootNode()?.host || el;
  if (host) {
    host.dispatchEvent(new CustomEvent(event, {
      detail: payload,
      bubbles: true,
      composed: true,
    }));
  }
}

function open() { modalRef.value?.open(); }
function close() { modalRef.value?.close(); }
function toggle() { modalRef.value?.toggle(); }
function isOpen() { return modalRef.value?.isOpen() ?? false; }

defineExpose({ open, close, toggle, isOpen });
</script>

<template>
  <Modal
    ref="modalRef"
    :color="props.color"
    :title="props.title"
    :description="props.description"
    :persistent="props.persistent"
    :size="props.size"
    :height="props.height"
    @close="ceEmit('close', $event)"
    @opened="ceEmit('opened', $event)"
    @closed="ceEmit('closed', $event)"
    @cancel="ceEmit('cancel', $event)"
    @accept="ceEmit('accept', $event)"
  >
    <template #icon>
      <slot name="icon"></slot>
    </template>
    <slot></slot>
    <template #footer>
      <slot name="footer"></slot>
    </template>
  </Modal>
</template>

<style>
@unocss-placeholder;
</style>
