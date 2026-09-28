<script setup lang="ts">
import { computed, ref, watch, type PropType } from 'vue'
import { isVariant } from '@/utils/validators'
import Button from '@/components/buttons/Button.vue'
import LucideChevronLeft from '@/components/icons/LucideChevronLeft.vue'
import LucideChevronRight from '@/components/icons/LucideChevronRight.vue'
import MonthSliderLabel from './month-slider/MonthSliderLabel.vue'

const props = defineProps({
  // API espejo de MonthSlider: acepta número, string numérico o fecha "YYYY-MM-DD".
  // En Custom Elements los atributos siempre llegan como string.
  modelValue: {
    type: [Number, String] as PropType<number | string | null>,
    default: null,
  },
  variant: {
    type: String as PropType<'solid' | 'outlined' | 'soft' | 'ghost' | 'subtle'>,
    default: 'soft',
    validator: isVariant,
  },
  min: {
    type: [Number, String] as PropType<number | string | null>,
    default: null,
  },
  max: {
    type: [Number, String] as PropType<number | string | null>,
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

// Normaliza cualquier entrada a un año, o null si no es un año válido.
// Espejo de MonthSlider: acepta "2024" o fechas "2024-06-01"; '' e inválidos = null.
function toYearNumber(value: number | string | null | undefined): number | null {
  if (value === null || value === undefined || value === '') return null
  if (typeof value === 'number') return Number.isFinite(value) ? Math.trunc(value) : null
  const str = value.trim()
  // Año numérico de 4 dígitos: "2024"
  if (/^\d{4}$/.test(str)) return Number(str)
  // Fecha estilo month: "2024-06-01" → 2024
  const date = str.match(/^(\d{4})[-/]/)
  if (date) return Number(date[1])
  return null
}

// Normaliza min/max: '' o valores inválidos (NaN) = sin límite
const minYear = computed<number | null>(() => toYearNumber(props.min))
const maxYear = computed<number | null>(() => toYearNumber(props.max))

function toYear(value: number | string | null | undefined): number {
  const parsed = toYearNumber(value)
  return parsed === null ? currentYear() : parsed
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
    if (value === null || value === undefined || value === '') return
    const next = clampYear(toYear(value))
    if (next !== year.value) year.value = next
  },
)

// Si min/max cambian en runtime y dejan el año fuera del rango, se re-ajusta
watch([minYear, maxYear], () => {
  const next = clampYear(year.value)
  if (next !== year.value) year.value = next
})

function setYear(next: number) {
  if (props.disabled) return
  const clamped = clampYear(next)
  if (clamped === year.value) return
  year.value = clamped
  emit('update:modelValue', clamped)
  emit('change', clamped)
}

/** Avanza al año siguiente (respetando max). */
function nextYear() {
  setYear(year.value + 1)
}

/** Retrocede al año anterior (respetando min). */
function prevYear() {
  setYear(year.value - 1)
}

/** Navega al año indicado. */
function goToYear(value: number | string) {
  const parsed = toYearNumber(value)
  if (parsed !== null) setYear(parsed)
}

/** Devuelve el año actual. */
function getValue(): number {
  return year.value
}

/** Establece el año desde un número o string. */
function setValue(value: number | string | null) {
  const parsed = toYearNumber(value)
  if (parsed !== null) setYear(parsed)
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
      :disabled="props.disabled"
      :color="props.color"
      :variant="props.variant"
      :can-navigate-prev="canPrevYear"
      :can-navigate-next="canNextYear"
      @navigate="(dir) => setYear(year + dir)"
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
