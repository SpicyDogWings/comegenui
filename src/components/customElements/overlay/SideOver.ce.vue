<script setup lang="ts">
import { getCurrentInstance } from "vue";
import SideOver from "../../overlay/SideOver.vue";
import { initTokens } from "@/plugins/cu-tokens/css";

initTokens();

const props = defineProps({
  open: { type: Boolean, default: false },
  position: { type: String, default: "right" },
  size: { type: String, default: "300px" },
  fullscreen: { type: Boolean, default: false },
  persistent: { type: Boolean, default: false },
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
</script>

<template>
  <SideOver
    :model-value="props.open"
    :position="props.position"
    :size="props.size"
    :fullscreen="props.fullscreen"
    :persistent="props.persistent"
    @update:model-value="ceEmit('update:open', $event)"
    @close="ceEmit('close', $event)"
  >
    <slot></slot>
  </SideOver>
</template>

<style>
@unocss-placeholder;
</style>