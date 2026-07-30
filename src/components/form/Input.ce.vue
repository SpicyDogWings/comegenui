<script setup lang="ts">
import { ref, watch, getCurrentInstance } from "vue";
import Input from "./Input.vue";

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
  },
  type: {
    type: String,
    required: false,
    default: "text",
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

});

const innerValue = ref(props.modelValue);
const inputRef = ref<InstanceType<typeof Input> | null>(null);
const instance = getCurrentInstance();

watch(() => props.modelValue, (val) => {
  innerValue.value = val;
});

watch(() => inputRef.value?.get(), (val) => {
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
  get: () => inputRef.value?.get(),
  set: (value: string | number) => inputRef.value?.set(value),
  reset: () => inputRef.value?.reset(),
  focus: () => inputRef.value?.focus(),
});
</script>

<template>
  <Input
    ref="inputRef"
    :color="props.color"
    :variant="props.variant"
    :type="props.type"
    :placeholder="props.placeholder"
    :disabled="props.disabled"
    :read-only="props.readOnly"

    :start-value="props.startValue"
    :model-value="innerValue"
  />
</template>

<style scoped>
</style>
