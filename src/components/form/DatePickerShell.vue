<script setup lang="ts">
// DatePickerShell (interno) — trigger + Dropdown + label compartidos por
// `DatePicker` (modo simple y rango). El panel se pasa por slot default.
import { ref, type PropType } from 'vue'
import Dropdown from '../overlay/Dropdown.vue'
import Button from '../buttons/Button.vue'
import Label from './Label.vue'

const props = defineProps({
  color: {
    type: String as PropType<'primary' | 'secondary' | 'neutral' | 'success' | 'warning' | 'danger'>,
    default: 'neutral',
  },
  variant: {
    type: String as PropType<'outlined' | 'soft' | 'ghost' | 'subtle'>,
    default: 'soft',
  },
  disabled: { type: Boolean, default: false },
  label: { type: String, default: '' },
  /** Texto que muestra el trigger (fecha formateada o placeholder). */
  labelText: { type: String, default: '' },
  position: { type: String as PropType<'bottom' | 'top' | 'left' | 'right'>, default: 'bottom' },
  align: { type: String as PropType<'start' | 'center' | 'end'>, default: 'start' },
  fixed: { type: Boolean, default: false },
  panelWidth: { type: String, default: '' },
})

const emit = defineEmits<{
  (e: 'open'): void
  (e: 'close'): void
}>()

const dropdownRef = ref<InstanceType<typeof Dropdown> | null>(null)

/** Abre el panel. */
function open() { dropdownRef.value?.open() }
/** Cierra el panel. */
function close() { dropdownRef.value?.close() }
/** Alterna el panel. */
function toggle() { dropdownRef.value?.toggle() }

defineExpose({ open, close, toggle, isOpen: () => dropdownRef.value?.isOpen() ?? false })
</script>

<template>
  <div class="cu-date-picker">
    <Label v-if="props.label" :label="props.label" @click="open" />
    <Dropdown
      ref="dropdownRef"
      :color="props.color"
      :disabled="props.disabled"
      :position="props.position"
      :align="props.align"
      :fixed="props.fixed"
      :offset="4"
      :panel-width="props.panelWidth"
      @open="emit('open')"
      @close="emit('close')"
    >
      <template #toggle="{ toggle }">
        <Button
          :color="props.color"
          :variant="props.variant"
          :disabled="props.disabled"
          class="cu-date-picker-toggle"
          @click="toggle"
        >
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
            class="cu-date-picker-icon"
          >
            <path d="M8 2v4" />
            <path d="M16 2v4" />
            <rect width="18" height="18" x="3" y="4" rx="2" />
            <path d="M3 10h18" />
          </svg>
          <span class="cu-date-picker-label">{{ props.labelText }}</span>
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
            class="cu-date-picker-chevron"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </Button>
      </template>

      <slot />
    </Dropdown>
  </div>
</template>

<style scoped>
.cu-date-picker {
  width: 100%;
  outline: none;
  display: flex;
  flex-direction: column;
  gap: var(--cu-space-sm);
}

.cu-date-picker :deep(.cu-dropdown) {
  width: 100%;
}

.cu-date-picker-toggle {
  width: 100%;
  justify-content: space-between;
  gap: var(--cu-space-md);
  box-sizing: border-box;
}

.cu-date-picker-icon {
  flex-shrink: 0;
}

.cu-date-picker-label {
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  min-width: 0;
  text-align: left;
}

.cu-date-picker-chevron {
  transition: transform 200ms ease;
  flex-shrink: 0;
}
</style>