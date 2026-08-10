<script setup lang="ts">
import { ref, getCurrentInstance, type PropType } from 'vue'
import MonthSlider from '../../form/MonthSlider.vue'
import { initTokens } from '@/plugins/cu-tokens/css'

initTokens()

const props = defineProps({
  modelValue: {
    type: [String, Number, Date] as PropType<string | number | Date | null>,
    default: null,
  },
  monthFormat: {
    type: String,
    default: 'MMMM',
  },
  yearFormat: {
    type: String,
    default: 'yyyy',
  },
  locale: {
    type: String,
    default: 'es',
  },
  yearNavigation: {
    type: [Boolean, String] as PropType<boolean | string>,
    default: true,
  },
  variant: {
    type: String as PropType<'solid' | 'outlined' | 'soft' | 'ghost' | 'subtle'>,
    default: 'soft',
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
  disabled: {
    type: Boolean,
    default: false,
  },
})

const sliderRef = ref<InstanceType<typeof MonthSlider> | null>(null)

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

function nextMonth() { sliderRef.value?.nextMonth() }
function prevMonth() { sliderRef.value?.prevMonth() }
function nextYear() { sliderRef.value?.nextYear() }
function prevYear() { sliderRef.value?.prevYear() }
function goToMonth(value: string | number | Date) { sliderRef.value?.goToMonth(value) }
function getValue(): Date | null { return sliderRef.value?.getValue() ?? null }
function setValue(value: string | number | Date | null) { sliderRef.value?.setValue(value) }

defineExpose({ nextMonth, prevMonth, nextYear, prevYear, goToMonth, getValue, setValue })
</script>

<template>
  <MonthSlider
    ref="sliderRef"
    :model-value="props.modelValue"
    :month-format="props.monthFormat"
    :year-format="props.yearFormat"
    :locale="props.locale"
    :year-navigation="props.yearNavigation"
    :variant="props.variant"
    :min="props.min"
    :max="props.max"
    :color="props.color"
    :disabled="props.disabled"
    @change="ceEmit('change', $event)"
    @update:modelValue="ceEmit('update:modelValue', $event)"
  />
</template>

<style>
@unocss-placeholder;
</style>
