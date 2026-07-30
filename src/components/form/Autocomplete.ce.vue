<script setup lang="ts">
import { ref, watch, getCurrentInstance } from "vue";
import Autocomplete from "./Autocomplete.vue";

const props = defineProps({
  theme: { type: String, required: false, default: "" },
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
  disabled: { type: Boolean, required: false, default: false },
  readOnly: { type: Boolean, required: false, default: false },
  hightContrast: { type: Boolean, required: false, default: false },
  placeholder: { type: String, required: false, default: "" },
  minChars: { type: Number, required: false, default: 0 },
  position: { type: String, required: false, default: "bottom" },
  align: { type: String, required: false, default: "start" },
  placement: { type: String, required: false, default: "" },
  items: { type: Array, required: false, default: () => [] },
  modelValue: { type: String, required: false, default: "" },
});

const autocompleteRef = ref<InstanceType<typeof Autocomplete> | null>(null);
const instance = getCurrentInstance();
const innerValue = ref(props.modelValue);

watch(() => props.modelValue, (val) => {
  innerValue.value = val;
});

watch(() => autocompleteRef.value?.get(), (val) => {
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
  get: () => autocompleteRef.value?.get(),
  set: (val: string) => autocompleteRef.value?.set(val),
  focus: () => autocompleteRef.value?.focus(),
  isOpen: () => autocompleteRef.value?.isOpen || false,
  selectedItem: () => autocompleteRef.value?.selectedItem || null,
});
</script>

<template>
  <Autocomplete
    ref="autocompleteRef"
    :color="props.color"
    :variant="props.variant"
    :type="props.type"
    :disabled="props.disabled"
    :read-only="props.readOnly"
    :hight-contrast="props.hightContrast"
    :placeholder="props.placeholder"
    :min-chars="props.minChars"
    :position="props.position"
    :align="props.align"
    :placement="props.placement"
    :items="props.items"
    :model-value="innerValue"
    @select="ceEmit('select', $event)"
    @blur="ceEmit('blur', $event)"
  />
</template>

<style scoped>
</style>
