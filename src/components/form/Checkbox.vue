<script setup lang="ts">
import { computed, ref, defineModel, type PropType } from "vue";

const checked = defineModel<boolean>({ default: false });

const props = defineProps({
  color: {
    type: String as PropType<'primary' | 'secondary' | 'neutral' | 'success' | 'warning' | 'danger'>,
    required: false,
    default: "neutral",
  },
  size: {
    type: String,
    required: false,
    default: "md",
    validator: (value: string) => ["sm", "md"].includes(value),
  },
  disabled: {
    type: Boolean,
    required: false,
    default: false,
  },
  label: {
    type: String,
    required: false,
  },
});

const emit = defineEmits(["change"]);
const inputRef = ref<HTMLInputElement | null>(null);

const checkboxStyles = computed(() => ({
  '--cb-bg': `var(--cu-color-${props.color})`,
  '--cb-soft': `var(--cu-color-${props.color}-soft)`,
  '--cb-ghost-hover': `var(--cu-color-${props.color}-ghost-hover)`,
  '--cb-text': `var(--cu-color-${props.color}-text)`,
}));

defineExpose({
  get: () => checked.value,
  set: (value: boolean) => {
    checked.value = value;
    emit("change", { target: { checked: value } });
  },
  reset: () => {
    checked.value = false;
    emit("change", { target: { checked: false } });
  },
  focus: () => inputRef.value?.focus(),
});
</script>

<template>
  <label
    class="cu-checkbox"
    :class="[
      `cu-checkbox--${props.size}`,
      { 'cu-checkbox--disabled': props.disabled }
    ]"
  >
    <input
      ref="inputRef"
      type="checkbox"
      :checked="checked"
      @change="(e) => { checked = (e.target as HTMLInputElement).checked; emit('change', e); }"
      :disabled="props.disabled"
      tabindex="-1"
      class="cu-checkbox-input"
    />
    <div
      class="cu-checkbox-box"
      :class="{ 'cu-checkbox-box--checked': checked }"
      :style="checkboxStyles"
    >
      <svg
        v-if="checked"
        xmlns="http://www.w3.org/2000/svg"
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="3"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="cu-checkbox-icon"
      >
        <path d="M20 6L9 17l-5-5" />
      </svg>
    </div>
    <span v-if="props.label" class="cu-checkbox-label">{{ props.label }}</span>
  </label>
</template>

<style scoped>
.cu-checkbox {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: var(--cu-space-sm);
  cursor: pointer;
  box-sizing: border-box;
  width: fit-content;
}

.cu-checkbox--md {
  gap: var(--cu-space-sm);
}

.cu-checkbox--sm {
  gap: var(--cu-space-xs);
}

.cu-checkbox--disabled {
  pointer-events: none;
  opacity: 0.7;
}

.cu-checkbox-input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
  box-sizing: border-box;
}

.cu-checkbox-box {
  position: relative;
  border-radius: var(--cu-radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 200ms ease;
  border: var(--cu-border-medium) solid var(--cu-border-color);
  background-color: transparent;
  box-sizing: border-box;
  flex-shrink: 0;
}

.cu-checkbox--md .cu-checkbox-box {
  width: 16px;
  height: 16px;
}

.cu-checkbox--sm .cu-checkbox-box {
  width: 14px;
  height: 14px;
}

.cu-checkbox-box--checked {
  background-color: var(--cb-bg);
  border-color: var(--cb-bg);
}

.cu-checkbox-box:hover:not(.cu-checkbox--disabled) {
  border-color: var(--cb-bg);
  background-color: var(--cb-ghost-hover);
}

.cu-checkbox-box--checked:hover:not(.cu-checkbox--disabled) {
  background-color: var(--cb-bg);
}

.cu-checkbox-icon {
  color: var(--cu-color-surface);
}

.cu-checkbox-label {
  font-family: var(--cu-font-sans);
  color: var(--cu-color-neutral);
}

.cu-checkbox--md .cu-checkbox-label {
  font-size: var(--cu-font-size-sm);
}

.cu-checkbox--sm .cu-checkbox-label {
  font-size: var(--cu-font-size-xs);
}

.cu-checkbox--disabled .cu-checkbox-label {
  opacity: 0.7;
}
</style>
