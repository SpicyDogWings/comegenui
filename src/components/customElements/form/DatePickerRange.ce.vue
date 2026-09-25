<script setup lang="ts">
// Shim de compatibilidad: `<cu-date-picker-range>` sigue registrado pero ahora
// delega en el `DatePicker` unificado con `mode="range"`. Deprecado: preferir
// `<cu-date-picker mode="range">`. Mismos props/eventos que antes.
import { ref, getCurrentInstance, type PropType } from 'vue'
import DatePicker from '../../form/DatePicker.vue'
import { initTokens } from '@/plugins/cu-tokens/css'
import { isMonthFormat, isYearFormat } from '@/utils/date'

initTokens()

const props = defineProps({
  /** Fecha de inicio del rango */
  startDate: {
    type: [String, Number, Date] as PropType<string | number | Date | null>,
    default: null,
  },
  /** Fecha de fin del rango */
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
  monthFormat: {
    type: String as PropType<'MMMM' | 'MMM' | 'MM' | 'M'>,
    default: 'MMMM',
    validator: isMonthFormat,
  },
  yearFormat: {
    type: String as PropType<'yyyy' | 'yy'>,
    default: 'yyyy',
    validator: isYearFormat,
  },
  disabledWeekdays: { type: [Array, String] as PropType<number[] | string>, default: '' },
  disabledDates: { type: [Array, String] as PropType<(string | Date)[] | string>, default: '' },
  events: {
    type: Array as PropType<CalendarEvent[]>,
    default: () => [],
  },
  grid: { type: Boolean, default: false },
  border: { type: Boolean, default: false },
  dualCalendar: { type: Boolean, default: false },
  position: { type: String as PropType<'bottom' | 'top' | 'left' | 'right'>, default: 'bottom' },
  align: { type: String as PropType<'start' | 'center' | 'end'>, default: 'start' },
  fixed: { type: Boolean, default: false },
  clearable: { type: Boolean, default: true },
  todayButton: { type: Boolean, default: false },
  label: { type: String, default: '' },
})

interface CalendarEvent {
  date: string | number | Date
  color?: string
}

const pickerRef = ref<InstanceType<typeof DatePicker> | null>(null)

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

/** Abre el panel */
function open() { pickerRef.value?.open() }
/** Cierra el panel */
function close() { pickerRef.value?.close() }
/** Abre/cierra el panel */
function toggle() { pickerRef.value?.toggle() }
/** Devuelve la fecha de inicio */
function getStartDate(): Date | null { return pickerRef.value?.getStartDate() ?? null }
/** Devuelve la fecha de fin */
function getEndDate(): Date | null { return pickerRef.value?.getEndDate() ?? null }
/** Define el rango (acepta string/number/Date) */
function setRange(start: string | number | Date | null, end: string | number | Date | null) {
  pickerRef.value?.setRange(start, end)
}
/** Limpia el rango */
function clear() { pickerRef.value?.clear() }

defineExpose({
  open, close, toggle, getStartDate, getEndDate, setRange, clear,
  isOpen: () => pickerRef.value?.isOpen() ?? false,
})
</script>

<template>
  <DatePicker
    ref="pickerRef"
    mode="range"
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
    :grid="props.grid"
    :border="props.border"
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