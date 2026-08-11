<script setup lang="ts">
import { ref, getCurrentInstance, type PropType } from 'vue'
import Calendar from '../../controls/Calendar.vue'
import { initTokens } from '@/plugins/cu-tokens/css'

initTokens()

const props = defineProps({
  // API espejo de MonthSlider/YearSlider: acepta Date, timestamp o fecha "YYYY-MM-DD"
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
    default: 'primary',
  },
  variant: {
    type: String as PropType<'solid' | 'outlined' | 'soft' | 'subtle'>,
    default: 'soft',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  disabledWeekdays: {
    type: [Array, String] as PropType<number[] | string>,
    default: '',
  },
  disabledDates: {
    type: [Array, String] as PropType<(string | Date)[] | string>,
    default: '',
  },
  locale: {
    type: String,
    default: 'es',
  },
  weekStart: {
    type: Number,
    default: 1,
  },
  yearNavigation: {
    type: [Boolean, String] as PropType<boolean | string>,
    default: false,
  },
  monthFormat: {
    type: String,
    default: 'MMMM',
  },
  yearFormat: {
    type: String,
    default: 'yyyy',
  },
})

const calendarRef = ref<InstanceType<typeof Calendar> | null>(null)

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

function nextMonth() { calendarRef.value?.nextMonth() }
function prevMonth() { calendarRef.value?.prevMonth() }
function goToMonth(value: string | number | Date) { calendarRef.value?.goToMonth(value) }
function getValue(): Date | null { return calendarRef.value?.getValue() ?? null }
function setValue(value: string | number | Date | null) { calendarRef.value?.setValue(value) }

defineExpose({ nextMonth, prevMonth, goToMonth, getValue, setValue })
</script>

<template>
  <Calendar
    ref="calendarRef"
    :model-value="props.modelValue"
    :min="props.min"
    :max="props.max"
    :color="props.color"
    :variant="props.variant"
    :disabled="props.disabled"
    :locale="props.locale"
    :week-start="props.weekStart"
    :year-navigation="props.yearNavigation"
    :month-format="props.monthFormat"
    :year-format="props.yearFormat"
    :disabled-weekdays="props.disabledWeekdays"
    :disabled-dates="props.disabledDates"
    @select="ceEmit('select', $event)"
    @change="ceEmit('change', $event)"
    @update:modelValue="ceEmit('update:modelValue', $event)"
  />
</template>

<style>
:host {
  display: inline-block;
}
</style>
