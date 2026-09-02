<script setup lang="ts">
import { ref, getCurrentInstance, type PropType } from 'vue'
import DatePickerRange from '../../form/DatePickerRange.vue'
import { initTokens } from '@/plugins/cu-tokens/css'

initTokens()

const props = defineProps({
  startDate: {
    type: [String, Number, Date] as PropType<string | number | Date | null>,
    default: null,
  },
  endDate: {
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
  yearNavigation: { type: [Boolean, String] as PropType<boolean | string>, default: false },
  monthFormat: { type: String, default: 'MMMM' },
  yearFormat: { type: String, default: 'yyyy' },
  disabledWeekdays: { type: [Array, String] as PropType<number[] | string>, default: '' },
  disabledDates: { type: [Array, String] as PropType<(string | Date)[] | string>, default: '' },
  events: {
    type: Array as PropType<CalendarEvent[]>,
    default: () => [],
  },
  dualCalendar: { type: Boolean, default: false },
  position: { type: String, default: 'bottom' },
  align: { type: String, default: 'start' },
  fixed: { type: Boolean, default: false },
  clearable: { type: Boolean, default: true },
  todayButton: { type: Boolean, default: false },
  label: { type: String, default: '' },
})

interface CalendarEvent {
  date: string | number | Date
  color?: string
}

const pickerRef = ref<InstanceType<typeof DatePickerRange> | null>(null)

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
function getStartDate(): Date | null { return pickerRef.value?.getStartDate() ?? null }
function getEndDate(): Date | null { return pickerRef.value?.getEndDate() ?? null }
function setRange(start: string | number | Date | null, end: string | number | Date | null) {
  pickerRef.value?.setRange(start, end)
}
function clear() { pickerRef.value?.clear() }

defineExpose({
  open, close, toggle, getStartDate, getEndDate, setRange, clear,
  isOpen: () => pickerRef.value?.isOpen || false,
})
</script>

<template>
  <DatePickerRange
    ref="pickerRef"
    :start-date="props.startDate"
    :end-date="props.endDate"
    :min="props.min"
    :max="props.max"
    :color="props.color"
    :variant="props.variant"
    :disabled="props.disabled"
    :placeholder="props.placeholder"
    :locale="props.locale"
    :week-start="props.weekStart"
    :format="props.format"
    :year-navigation="props.yearNavigation"
    :month-format="props.monthFormat"
    :year-format="props.yearFormat"
    :disabled-weekdays="props.disabledWeekdays"
    :disabled-dates="props.disabledDates"
    :events="props.events"
    :dual-calendar="props.dualCalendar"
    :position="props.position"
    :align="props.align"
    :fixed="props.fixed"
    :clearable="props.clearable"
    :today-button="props.todayButton"
    :label="props.label"
    @update:startDate="ceEmit('update:startDate', $event)"
    @update:endDate="ceEmit('update:endDate', $event)"
    @select="ceEmit('select', $event)"
    @change="ceEmit('change', $event)"
    @open="ceEmit('open', $event)"
    @close="ceEmit('close', $event)"
  />
</template>

<style>
:host {
  display: block;
  width: 100%;
}
</style>
