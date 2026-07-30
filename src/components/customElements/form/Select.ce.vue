<script setup lang="ts">
import { computed, ref, watch, getCurrentInstance } from "vue";
import Select from "../../form/Select.vue";

interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
  color?: string;
  variant?: string;
}

const props = defineProps({
  theme: { type: String, required: false, default: "" },
  modelValue: { type: String, required: false, default: "" },
  options: { type: Array as () => SelectOption[], required: false, default: () => [] },
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
  placeholder: { type: String, required: false },
  placeholderWrap: { type: Boolean, required: false, default: false },
  position: { type: String, required: false, default: "bottom" },
  align: { type: String, required: false, default: "start" },
  placement: { type: String, required: false, default: "" },
  disabled: { type: Boolean, required: false, default: false },
  fixed: { type: Boolean, required: false, default: false },
  hightContrast: { type: Boolean, required: false, default: false },
});

const resolvedOptions = computed(() =>
  (props.options || []).map((opt: any) => ({
    ...opt,
    color: opt.color || undefined,
  })),
);

const selectRef = ref<InstanceType<typeof Select> | null>(null);
const instance = getCurrentInstance();
const innerValue = ref(props.modelValue);

watch(() => props.modelValue, (val) => {
  innerValue.value = val;
});

watch(() => selectRef.value?.get(), (val) => {
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
  get: () => selectRef.value?.get(),
  set: (val: string) => selectRef.value?.set(val),
  reset: () => selectRef.value?.reset(),
  focus: () => selectRef.value?.focus(),
  isOpen: () => selectRef.value?.isOpen || false,
  selectedItem: () => selectRef.value?.selectedItem || null,
});
</script>

<template>
  <Select
    ref="selectRef"
    :color="props.color"
    :variant="props.variant"
    :disabled="props.disabled"
    :hight-contrast="props.hightContrast"
    :placeholder="props.placeholder"
    :placeholder-wrap="props.placeholderWrap"
    :position="props.position"
    :align="props.align"
    :placement="props.placement"
    :fixed="props.fixed"
    :model-value="innerValue"
    :options="resolvedOptions"
    @select="ceEmit('select', $event)"
    @close="ceEmit('close', $event)"
    @blur="ceEmit('blur', $event)"
  />
</template>

<style scoped>
</style>
