<script setup lang="ts">
import { ref, watch, getCurrentInstance } from "vue";
import SideOver from "../../overlay/SideOver.vue";
import { initTokens } from "@/plugins/cu-tokens/css";

initTokens();

const props = defineProps({
  /** Estado de visibilidad (v-model). Ver nota de atributo abajo */
  open: { type: Boolean, default: false },
  /** Título de la cabecera (si está vacío y no es `persistent`, igual muestra el botón de cerrar) */
  title: { type: String, default: "" },
  /** Borde desde donde desliza: `left`, `right`, `top`, `bottom` */
  position: { type: String, default: "right" },
  /** Ancho (`left`/`right`) o alto (`top`/`bottom`) del panel. Valor CSS (`300px`, `40vw`) o preset: `sm`, `md`, `lg`, `xl`, `full`. Ignorado con `fullscreen` */
  size: { type: String, default: "300px" },
  /** Ocupa toda la pantalla */
  fullscreen: { type: Boolean, default: false },
  /** Si es `true`, no se cierra por backdrop, `Escape` ni el botón de cerrar */
  persistent: { type: Boolean, default: false },
  /** Z-index del overlay (en HTML se usa como `z-index`) */
  zIndex: { type: Number, default: 1100 },
});

const isOpen = ref(props.open);
watch(() => props.open, (value) => {
  isOpen.value = value;
});

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

function onUpdate(value: boolean) {
  isOpen.value = value;
  ceEmit("update:open", value);
}

function open() { isOpen.value = true; }
function close() { isOpen.value = false; }
function toggle() { isOpen.value = !isOpen.value; }
function isOpenValue() { return isOpen.value; }

defineExpose({ open, close, toggle, isOpen: isOpenValue });
</script>

<template>
  <SideOver
    :model-value="isOpen"
    :title="props.title"
    :position="props.position"
    :size="props.size"
    :fullscreen="props.fullscreen"
    :persistent="props.persistent"
    :z-index="props.zIndex"
    @update:model-value="onUpdate"
    @close="ceEmit('close', $event)"
  >
    <slot></slot>
  </SideOver>
</template>

<style>
@unocss-placeholder;
</style>