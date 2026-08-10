<script setup lang="ts">
import { ref, getCurrentInstance, type PropType } from 'vue'
import YearSlider from '../../controls/YearSlider.vue'
import { initTokens } from '@/plugins/cu-tokens/css'

initTokens()

const props = defineProps({
  modelValue: {
    type: Number,
    default: null,
  },
  variant: {
    type: String as PropType<'solid' | 'outlined' | 'soft' | 'ghost' | 'subtle'>,
    default: 'soft',
  },
  min: {
    type: Number,
    default: null,
  },
  max: {
    type: Number,
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

const sliderRef = ref<InstanceType<typeof YearSlider> | null>(null)

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

function nextYear() { sliderRef.value?.nextYear() }
function prevYear() { sliderRef.value?.prevYear() }
function goToYear(value: number) { sliderRef.value?.goToYear(value) }
function getValue(): number | null { return sliderRef.value?.getValue() ?? null }
function setValue(value: number | null) { sliderRef.value?.setValue(value) }

defineExpose({ nextYear, prevYear, goToYear, getValue, setValue })
</script>

<template>
  <YearSlider
    ref="sliderRef"
    :model-value="props.modelValue"
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
