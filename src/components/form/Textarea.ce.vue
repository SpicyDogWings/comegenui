<script setup lang="ts">
import { ref, watch, getCurrentInstance } from "vue";
import Textarea from "./Textarea.vue";

const props = defineProps({
  theme: {
    type: String,
    required: false,
    default: "",
  },
  modelValue: {
    type: String,
    required: false,
    default: "",
  },
  startValue: {
    type: String,
    required: false,
  },
  color: {
    type: String,
    required: false,
    default: "neutral",
  },
  variant: {
    type: String,
    required: false,
    default: "soft",
    validator: (value: string) => ["outlined", "soft", "ghost", "subtle"].includes(value),
  },
  placeholder: {
    type: String,
    required: false,
  },
  disabled: {
    type: Boolean,
    required: false,
    default: false,
  },
  readOnly: {
    type: Boolean,
    required: false,
    default: false,
  },
  rows: {
    type: Number,
    required: false,
    default: 3,
  },
  noResize: {
    type: Boolean,
    required: false,
    default: false,
  },
  hightContrast: {
    type: Boolean,
    required: false,
    default: false,
  },
});

const innerValue = ref(props.modelValue);
const textareaRef = ref<InstanceType<typeof Textarea> | null>(null);
const instance = getCurrentInstance();

watch(() => props.modelValue, (val) => {
  innerValue.value = val;
});

watch(() => textareaRef.value?.get(), (val) => {
  if (val !== undefined && val !== null && val !== innerValue.value) {
    innerValue.value = val;
    ceEmit("update:modelValue", val);
  }
});

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

defineExpose({
  get: () => textareaRef.value?.get(),
  set: (value: string | number) => textareaRef.value?.set(value),
  reset: () => textareaRef.value?.reset(),
  focus: () => textareaRef.value?.focus(),
});
</script>

<template>
  <Textarea
    ref="textareaRef"
    :color="props.color"
    :variant="props.variant"
    :placeholder="props.placeholder"
    :disabled="props.disabled"
    :read-only="props.readOnly"
    :rows="props.rows"
    :no-resize="props.noResize"
    :start-value="props.startValue"
    :model-value="innerValue"
  />
</template>

<style scoped>
</style>
