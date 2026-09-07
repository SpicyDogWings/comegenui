<script setup lang="ts">
import { ref, watch, getCurrentInstance } from "vue";
import SideOver from "../../overlay/SideOver.vue";
import { initTokens } from "@/plugins/cu-tokens/css";

initTokens();

const props = defineProps({
  open: { type: Boolean, default: false },
  title: { type: String, default: "" },
  position: { type: String, default: "right" },
  size: { type: String, default: "300px" },
  fullscreen: { type: Boolean, default: false },
  persistent: { type: Boolean, default: false },
  zIndex: { type: Number, default: 1100 },
});

const isOpen = ref(props.open);
watch(() => props.open, (value) => {
  isOpen.value = value;
});

const sideOverRef = ref<InstanceType<typeof SideOver> | null>(null);

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
    ref="sideOverRef"
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