<script setup lang="ts">
import { computed, ref, watch, type PropType } from 'vue'
import Button from '@/components/buttons/Button.vue'
import LucideChevronLeft from '@/components/icons/LucideChevronLeft.vue'
import LucideChevronRight from '@/components/icons/LucideChevronRight.vue'
import MonthSliderLabel from './month-slider/MonthSliderLabel.vue'

const props = defineProps({
  modelValue: {
    type: Number,
    default: null,
  },
  variant: {
    type: String as PropType<'solid' | 'outlined' | 'soft' | 'ghost' | 'subtle'>,
    default: 'soft',
    validator: (value: string) =>
      ['solid', 'outlined', 'soft', 'ghost', 'subtle'].includes(value),
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

const emit = defineEmits<{
  (e: 'update:modelValue', value: number): void
  (e: 'change', value: number): void
}>()

function currentYear(): number {
  return new Date().getFullYear()
}

// Normaliza min/max/modelValue a número: en Custom Elements los atributos llegan como string
const minYear = computed<number | null>(() =>
  props.min === null || props.min === undefined ? null : Number(props.min),
)
const maxYear = computed<number | null>(() =>
  props.max === null || props.max === undefined ? null : Number(props.max),
)

function toYear(value: number | null | undefined): number {
  if (value === null || value === undefined || Number.isNaN(Number(value))) return currentYear()
  return Number(value)
}

const year = ref<number>(clampYear(toYear(props.modelValue)))

function clampYear(value: number): number {
  if (minYear.value !== null && value < minYear.value) return minYear.value
  if (maxYear.value !== null && value > maxYear.value) return maxYear.value
  return value
}

watch(
  () => props.modelValue,
  (value) => {
    if (value === null || value === undefined) return
    const next = clampYear(toYear(value))
    if (next !== year.value) year.value = next
  },
)

function setYear(next: number) {
  if (props.disabled) return
  const clamped = clampYear(next)
  if (clamped === year.value) return
  year.value = clamped
  emit('update:modelValue', clamped)
  emit('change', clamped)
}

function nextYear() {
  setYear(year.value + 1)
}

function prevYear() {
  setYear(year.value - 1)
}

function goToYear(value: number) {
  setYear(Number(value))
}

function getValue(): number {
  return year.value
}

function setValue(value: number | null) {
  if (value === null || value === undefined) return
  setYear(Number(value))
}

defineExpose({
  nextYear,
  prevYear,
  goToYear,
  getValue,
  setValue,
})

// Botones deshabilitados en los bordes de min/max
const canPrevYear = computed(() => minYear.value === null || year.value > minYear.value)
const canNextYear = computed(() => maxYear.value === null || year.value < maxYear.value)

// ── Estilos por color semántico (cascada hacia el label) ──

const colorStyles = computed(() => ({
  '--ms-accent': `var(--cu-color-${props.color})`,
  '--ms-accent-hover': `var(--cu-color-${props.color}-hover)`,
  '--ms-accent-text': `var(--cu-color-${props.color}-text)`,
  '--ms-soft': `var(--cu-color-${props.color}-soft)`,
  '--ms-soft-hover': `var(--cu-color-${props.color}-soft-hover)`,
  '--ms-subtle': `var(--cu-color-${props.color}-subtle)`,
  '--ms-subtle-hover': `var(--cu-color-${props.color}-subtle-hover)`,
  '--ms-subtle-border': `var(--cu-color-${props.color}-subtle-border)`,
  '--ms-ghost-hover': `var(--cu-color-${props.color}-ghost-hover)`,
  '--ms-surface': `var(--cu-color-surface)`,
}))
</script>

<template>
  <div
    class="cu-year-slider"
    :class="{ 'is-disabled': props.disabled }"
    :style="colorStyles"
    role="group"
    :aria-label="`Selector de año: ${year}`"
  >
    <Button
      class="cu-button--icon-only"
      variant="ghost"
      :color="props.color"
      :disabled="props.disabled || !canPrevYear"
      :aria-label="'Ir al año anterior'"
      @click="prevYear()"
    >
      <LucideChevronLeft :width="16" :height="16" />
    </Button>

    <MonthSliderLabel
      :label="String(year)"
      :draggable="false"
      :disabled="props.disabled"
      :color="props.color"
      :variant="props.variant"
    />

    <Button
      class="cu-button--icon-only"
      variant="ghost"
      :color="props.color"
      :disabled="props.disabled || !canNextYear"
      :aria-label="'Ir al año siguiente'"
      @click="nextYear()"
    >
      <LucideChevronRight :width="16" :height="16" />
    </Button>
  </div>
</template>

<style scoped>
.cu-year-slider {
  display: inline-flex;
  align-items: center;
  gap: var(--cu-space-2xs);
  font-family: var(--cu-font-sans);
}

.cu-year-slider.is-disabled {
  opacity: 0.7;
}
</style>
