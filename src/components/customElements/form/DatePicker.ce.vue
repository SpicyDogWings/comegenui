<script setup lang="ts">
import { ref, watch, getCurrentInstance, type PropType } from 'vue'
import DatePicker from '../../form/DatePicker.vue'
import { initTokens } from '@/plugins/cu-tokens/css'

initTokens()

const props = defineProps({
  modelValue: {
    type: [String, Number, Date] as PropType<string | number | Date | null>,
    default: null,
  },
  min: {
    type: [String, Number, Date] as PropType<string | number | Date | null>,
    default: null,
  },
  max: {
    type: [String, Number, Date] as PropType<string | number | Date | null>,
    default: null,
  },
  color: {
    type: String as PropType<'primary' | 'secondary' | 'neutral' | 'success' | 'warning' | 'danger'>,
    default: 'neutral',
  },
  variant: {
    type: String as PropType<'outlined' | 'soft' | 'ghost' | 'subtle'>,
    default: 'soft',
  },
  disabled: { type: Boolean, default: false },
  placeholder: { type: String, default: '' },
  locale: { type: String, default: 'es' },
  weekStart: { type: Number, default: 1 },
  format: { type: String, default: 'dd/MM/yyyy' },
  position: { type: String, default: 'bottom' },
  align: { type: String, default: 'start' },
  placement: { type: String, default: '' },
  fixed: { type: Boolean, default: false },
  clearable: { type: Boolean, default: true },
  todayButton: { type: Boolean, default: true },
})

const pickerRef = ref<InstanceType<typeof DatePicker> | null>(null)
const innerValue = ref(props.modelValue)

watch(() => props.modelValue, (val) => {
  innerValue.value = val
})

const instance = getCurrentInstance()
function ceEmit(event: string, payload: unknown) {
  const el = instance?.vnode.el as HTMLElement | null
  const host = (el?.getRootNode() as ShadowRoot | null | undefined)?.host || el
  if (host) {
    host.dispatchEvent(new CustomEvent(event, {
      detail: payload,
      bubbles: true,
      composed: true,
    }))
  }
}

function open() { pickerRef.value?.open() }
function close() { pickerRef.value?.close() }
function toggle() { pickerRef.value?.toggle() }
function getValue(): Date | null { return pickerRef.value?.getValue() ?? null }
function setValue(value: string | number | Date | null) { pickerRef.value?.setValue(value) }
function clear() { pickerRef.value?.clear() }

defineExpose({ open, close, toggle, getValue, setValue, clear, isOpen: () => pickerRef.value?.isOpen() || false })
</script>

<template>
  <DatePicker
    ref="pickerRef"
    :model-value="innerValue"
    :min="props.min"
    :max="props.max"
    :color="props.color"
    :variant="props.variant"
    :disabled="props.disabled"
    :placeholder="props.placeholder"
    :locale="props.locale"
    :week-start="props.weekStart"
    :format="props.format"
    :position="props.position"
    :align="props.align"
    :placement="props.placement"
    :fixed="props.fixed"
    :clearable="props.clearable"
    :today-button="props.todayButton"
    @select="ceEmit('select', $event)"
    @change="ceEmit('change', $event)"
    @open="ceEmit('open', $event)"
    @close="ceEmit('close', $event)"
    @update:modelValue="ceEmit('update:modelValue', $event)"
  />
</template>

<style>
:host {
  display: block;
  width: 100%;
}
</style>
