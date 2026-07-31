<script setup lang="ts">
import { ref, getCurrentInstance, type PropType } from "vue";
import Tabs from "../Tabs.vue";
import { initTokens } from "@/plugins/cu-tokens/css";

initTokens();

const props = defineProps({
  tabs: {
    type: Array as PropType<{ key: string; label: string; disabled?: boolean }[]>,
    default: () => [],
  },
  modelValue: { type: String, default: "" },
  color: {
    type: String as PropType<'primary' | 'secondary' | 'neutral' | 'success' | 'warning' | 'danger'>,
    default: "primary",
  },
  variant: { type: String as PropType<'tabs' | 'pills' | 'boxed' | 'soft'>, default: "tabs" },
  size: { type: String as PropType<'sm' | 'md' | 'lg'>, default: "md" },
  disabled: Boolean,
});

const tabsRef = ref<InstanceType<typeof Tabs> | null>(null);

const instance = getCurrentInstance();
function ceEmit(event: string, payload: unknown) {
  const el = instance?.vnode.el as HTMLElement | null;
  const root = el?.getRootNode() as ShadowRoot | Document | null;
  const host = root && 'host' in root ? (root as ShadowRoot).host : el;
  if (host) {
    host.dispatchEvent(new CustomEvent(event, {
      detail: payload,
      bubbles: true,
      composed: true,
    }));
  }
}

function getActive() { return tabsRef.value?.getActive() ?? ""; }
function setActive(key: string) { tabsRef.value?.setActive(key); }
function next() { tabsRef.value?.next(); }
function prev() { tabsRef.value?.prev(); }

defineExpose({ getActive, setActive, next, prev });
</script>

<template>
  <Tabs
    ref="tabsRef"
    :tabs="props.tabs"
    :modelValue="props.modelValue"
    :color="props.color"
    :variant="props.variant"
    :size="props.size"
    :disabled="props.disabled"
    @update:modelValue="ceEmit('update:modelValue', $event)"
    @change="ceEmit('change', $event)"
  >
    <template v-for="tab in props.tabs" :key="tab.key" #[tab.key]>
      <slot :name="tab.key"></slot>
    </template>
    <template v-for="tab in props.tabs" :key="`icon-${tab.key}`" #[`tab-icon-${tab.key}`]>
      <slot :name="`tab-icon-${tab.key}`"></slot>
    </template>
  </Tabs>
</template>
