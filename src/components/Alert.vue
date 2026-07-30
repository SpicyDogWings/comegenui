<script setup lang="ts">
import { computed, ref, watch, type PropType } from "vue";

const props = defineProps({
  color: {
    type: String as PropType<'primary' | 'secondary' | 'neutral' | 'success' | 'warning' | 'danger'>,
    required: false,
    default: "neutral",
  },
  variant: {
    type: String,
    required: false,
    default: "soft",
    validator: (value: string) =>
      ["solid", "outlined", "soft", "ghost", "subtle"].includes(value),
  },
  title: {
    type: String,
    required: false,
  },
  close: {
    type: Boolean,
    required: false,
    default: false,
  },
  show: {
    type: Boolean,
    required: false,
    default: true,
  },
});

const emit = defineEmits(["close", "open", "update:show"]);

const internalShow = ref(props.show);

watch(() => props.show, (val) => {
  internalShow.value = val;
});
watch(internalShow, (val) => {
  emit("update:show", val);
});

const colorStyles = computed(() => ({
  '--alert-bg': `var(--cu-color-${props.color})`,
  '--alert-bg-hover': `var(--cu-color-${props.color}-hover)`,
  '--alert-bg-active': `var(--cu-color-${props.color}-active)`,
  '--alert-ghost-hover': `var(--cu-color-${props.color}-ghost-hover)`,
  '--alert-ghost-active': `var(--cu-color-${props.color}-ghost-active)`,
  '--alert-soft': `var(--cu-color-${props.color}-soft)`,
  '--alert-soft-hover': `var(--cu-color-${props.color}-soft-hover)`,
  '--alert-soft-active': `var(--cu-color-${props.color}-soft-active)`,
  '--alert-subtle': `var(--cu-color-${props.color}-subtle)`,
  '--alert-subtle-hover': `var(--cu-color-${props.color}-subtle-hover)`,
  '--alert-subtle-active': `var(--cu-color-${props.color}-subtle-active)`,
  '--alert-subtle-border': `var(--cu-color-${props.color}-subtle-border)`,
}))

function open() {
  internalShow.value = true;
  emit("open");
}
function close() {
  internalShow.value = false;
  emit("close");
}
function toggle() {
  internalShow.value = !internalShow.value;
  emit(internalShow.value ? "open" : "close");
}

defineExpose({
  open,
  close,
  toggle,
  isOpen: () => internalShow.value,
});
</script>

<template>
  <div
    v-show="internalShow"
    :class="['cu-alert', `cu-alert--${props.variant}`]"
    :style="colorStyles"
    role="alert"
  >
    <div class="cu-alert-header">
      <div class="cu-alert-title">
        <slot name="icon" />
        <span v-if="props.title" class="cu-alert-title-text">{{ props.title }}</span>
      </div>
      <button
        v-if="props.close"
        @click="close"
        class="cu-alert-close"
        aria-label="Cerrar alerta"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"> <path d="M18 6 6 18"/> <path d="m6 6 12 12"/> </svg>
      </button>
    </div>
    <div class="cu-alert-content">
      <slot />
    </div>
  </div>
</template>

<style>
.cu-alert {
  font-family: var(--cu-font-sans);
  font-size: var(--cu-font-size-sm);
  padding: var(--cu-space-md) var(--cu-space-lg);
  border-radius: var(--cu-radius-md);
  display: flex;
  flex-direction: column;
  gap: var(--cu-space-sm);
  box-sizing: border-box;
}

/* solid */
.cu-alert--solid {
  background-color: var(--alert-bg);
  color: var(--cu-color-surface);
}
.cu-alert.cu-alert--solid .cu-alert-title-text {
  color: var(--cu-color-surface);
}

/* ghost */
.cu-alert--ghost {
  background-color: transparent;
  color: var(--alert-bg);
}

/* soft */
.cu-alert--soft {
  background-color: var(--alert-soft);
  color: var(--alert-bg);
}

/* subtle */
.cu-alert--subtle {
  background-color: var(--alert-subtle);
  color: var(--alert-bg);
  border: var(--cu-border-thin) solid var(--alert-subtle-border);
}

/* outlined */
.cu-alert--outlined {
  background-color: transparent;
  color: var(--alert-bg);
  border: var(--cu-border-thin) solid var(--alert-bg);
}

.cu-alert-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.cu-alert-title {
  display: flex;
  align-items: center;
  gap: var(--cu-space-sm);
}

.cu-alert-title-text {
  font-size: var(--cu-font-size-lg);
  font-weight: var(--cu-font-weight-bold);
  margin: 0;
  color: inherit;
}

.cu-alert-close {
  background: none;
  border: none;
  cursor: pointer;
  color: inherit;
  padding: var(--cu-space-2xs);
  border-radius: var(--cu-radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 150ms ease;
}

.cu-alert-close:hover {
  background-color: var(--alert-ghost-hover);
}

.cu-alert-close:active {
  background-color: var(--alert-ghost-active);
}

.cu-alert-content {
  color: inherit;
}
</style>
