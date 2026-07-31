<script setup lang="ts">
import { getCurrentInstance } from "vue";
import FloatingButton from "@/components/buttons/FloatingButton.vue";

const props = defineProps({
  color: { type: String, default: "primary" as string },
  disabled: { type: Boolean, default: false },
});

const instance = getCurrentInstance();
function onClick() {
  const el = instance?.vnode.el as HTMLElement | null;
  const host = (el?.getRootNode() as any)?.host || el;
  if (host) {
    host.dispatchEvent(new CustomEvent("click", { bubbles: true, composed: true }));
  }
}
</script>

<template>
  <FloatingButton
    :color="(props.color as any)"
    :disabled="props.disabled"
    @click="onClick"
  >
    <slot />
  </FloatingButton>
</template>

<style>
@unocss-placeholder;
</style>
