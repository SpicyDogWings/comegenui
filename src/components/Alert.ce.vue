<script setup lang="ts">
import { computed, getCurrentInstance } from "vue";
import Alert from "./Alert.vue";
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
  close: {
    type: Boolean,
    required: false,
    default: false,
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
    default: "soft",
    validator: (value: string) =>
      ["solid", "outlined", "soft", "subtle"].includes(value),
  },
  title: {
    type: String,
    required: false,
  },
  show: {
    type: Boolean,
    required: false,
    default: true,
  },
  hightContrast: {
    type: Boolean,
    required: false,
    default: false,
  },
});

const effectiveTheme = computed(() => props.theme || getHostTheme());
const hexColor = computed(() => {
  const map = getColorMap(effectiveTheme.value as "light" | "dark");
  return map[props.color as keyof typeof map] || props.color;
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
  <Alert
    :color="hexColor"
    :variant="props.variant"
    :close="props.close"
    :title="props.title"
    :show="props.show"
    :hight-contrast="props.hightContrast"
    @close="ceEmit('close', $event)"
    @open="ceEmit('open', $event)"
    @update:show="ceEmit('update:show', $event)"
  >
    <template #icon>
      <slot name="icon"></slot>
    </template>
    <slot></slot>
  </Alert>
</template>

<style>
@unocss-placeholder;
</style>
