<script setup lang="ts">
import { ref, computed, watch } from "vue";
import Dropdown from "../overlay/Dropdown.vue";
import Button from "../buttons/Button.vue";

interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
  color?: string;
  variant?: string;
}

const props = defineProps({
  color: {
    type: String,
    required: false,
    default: "neutral",
    validator: (value: string) =>
      ["primary", "secondary", "neutral", "success", "warning", "danger"].includes(value),
  },
  variant: {
    type: String,
    required: false,
    default: "soft",
    validator: (value: string) =>
      ["outlined", "soft", "ghost", "subtle"].includes(value),
  },
  disabled: { type: Boolean, required: false, default: false },
  placeholder: { type: String, required: false, default: "" },
  placeholderWrap: { type: Boolean, required: false, default: false },
  position: { type: String, required: false, default: "bottom" },
  align: { type: String, required: false, default: "start" },
  textAlign: {
    type: String,
    required: false,
    default: "left",
    validator: (value: string) => ["left", "center", "right"].includes(value),
  },
  fixed: { type: Boolean, required: false, default: false },
  modelValue: { type: String, required: false, default: "" },
  options: { type: Array as () => SelectOption[], required: false, default: () => [] },
});

const emit = defineEmits(["update:modelValue", "select", "close", "blur"]);
const selectedValue = ref(props.modelValue);
const dropdownRef = ref<InstanceType<typeof Dropdown> | null>(null);
const selectRoot = ref<HTMLElement | null>(null);

const selectedLabel = computed(() => {
  const opt = props.options.find(o => o.value === selectedValue.value);
  return opt ? opt.label : props.placeholder || "Seleccionar...";
});

watch(() => props.modelValue, (val) => {
  selectedValue.value = val;
}, { immediate: true });

function onSelect(option: SelectOption) {
  if (option.disabled) return;
  selectedValue.value = option.value;
  emit("update:modelValue", option.value);
  emit("select", option);
  dropdownRef.value?.close();
}

const optionStyle = computed(() => ({ textAlign: props.textAlign }));

function get() { return selectedValue.value; }
function set(value: string) { selectedValue.value = value; }
function reset() { selectedValue.value = ""; }
function focus() { selectRoot.value?.focus(); }

function onFocusOut(e: FocusEvent) {
  if (!selectRoot.value?.contains(e.relatedTarget as Node)) {
    emit("blur");
  }
}

defineExpose({
  get, set, reset, focus,
  isOpen: () => dropdownRef.value?.isOpen || false,
  selectedItem: () => props.options.find(o => o.value === selectedValue.value) || null,
});
</script>

<template>
  <div ref="selectRoot" class="cu-select" tabindex="-1" @focusout="onFocusOut">
    <Dropdown
      ref="dropdownRef"
      :color="color"
      :disabled="disabled"
      :position="position"
      :align="align"
      :fixed="fixed"
      :offset="4"
      @close="emit('close')"
    >
      <template #toggle="{ toggle, isOpen }">
        <Button
          :color="color"
          :variant="variant"
          :disabled="disabled"
          class="cu-select-toggle"
          @click="toggle"
        >
          <span :class="['cu-select-label', { 'cu-select-label--wrap': placeholderWrap }]">
            {{ selectedLabel }}
          </span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="cu-select-chevron"
            :class="{ 'cu-select-chevron--open': isOpen }"
          >
            <path d="m6 9 6 6 6-6"/>
          </svg>
        </Button>
      </template>
      <template #default>
        <div v-if="options.length > 0" class="cu-select-options">
          <Button
            v-for="(opt, i) in options"
            :key="i"
            :color="opt.color || color"
            :variant="opt.variant || (opt.value === selectedValue ? 'soft' : 'ghost')"
            :disabled="opt.disabled"
            class="cu-select-option"
            :class="{ 'cu-select-option--disabled': opt.disabled }"
            :style="optionStyle"
            @click="onSelect(opt)"
          >
            {{ opt.label }}
          </Button>
        </div>
        <div v-else class="cu-select-empty">
          Sin opciones
        </div>
      </template>
    </Dropdown>
  </div>
</template>

<style scoped>
.cu-select {
  width: 100%;
  outline: none;
}

.cu-select :deep(.cu-dropdown) {
  width: 100%;
}

.cu-select-toggle {
  width: 100%;
  justify-content: space-between;
  gap: var(--cu-space-md);
  box-sizing: border-box;
}

.cu-select-label {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  min-width: 0;
}

.cu-select-label--wrap {
  white-space: normal;
}

.cu-select-chevron {
  transition: transform 200ms ease;
  flex-shrink: 0;
}

.cu-select-chevron--open {
  transform: rotate(180deg);
}

.cu-select-options {
  max-height: 240px;
  overflow-y: auto;
}

.cu-select-option {
  width: 100%;
  justify-content: flex-start;
}

.cu-select-option--disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.cu-select-empty {
  padding: var(--cu-space-md);
  font-family: var(--cu-font-sans);
  font-size: var(--cu-font-size-sm);
  opacity: 0.6;
  text-align: center;
}
</style>
