<script setup lang="ts">
import { computed, ref, watch, type PropType } from 'vue'
import Button from '@/components/buttons/Button.vue'
import LucideChevronLeft from '@/components/icons/LucideChevronLeft.vue'
import LucideChevronRight from '@/components/icons/LucideChevronRight.vue'
import LucideChevronsLeft from '@/components/icons/LucideChevronsLeft.vue'
import LucideChevronsRight from '@/components/icons/LucideChevronsRight.vue'
import MonthSliderLabel from './month-slider/MonthSliderLabel.vue'

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
    validator: (value: string) =>
      ['solid', 'outlined', 'soft', 'ghost', 'subtle'].includes(value),
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

const emit = defineEmits<{
  (e: 'update:modelValue', value: Date): void
  (e: 'change', value: Date): void
}>()

// ── Utilidades de fecha (sin librerías externas) ──

function startOfCurrentMonth(): Date {
  const now = new Date()
  return new Date(now.getFullYear(), now.getMonth(), 1)
}

// Normaliza cualquier entrada al primer día del mes (hora local, 00:00)
function parseDateInput(value: string | number | Date | null | undefined): Date {
  if (value instanceof Date) {
    return new Date(value.getFullYear(), value.getMonth(), 1)
  }
  if (typeof value === 'number') {
    const d = new Date(value)
    return new Date(d.getFullYear(), d.getMonth(), 1)
  }
  if (typeof value === 'string') {
    // "2026-03-01" se parsea como fecha local (evita el desfase UTC)
    const m = value.match(/^(\d{4})-(\d{2})(?:-(\d{2}))?$/)
    const parsed = m
      ? new Date(Number(m[1] ?? 0), Number(m[2] ?? 1) - 1, m[3] ? Number(m[3]) : 1)
      : new Date(value)
    if (Number.isNaN(parsed.getTime())) return startOfCurrentMonth()
    return new Date(parsed.getFullYear(), parsed.getMonth(), 1)
  }
  return startOfCurrentMonth()
}

function sameMonth(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth()
}

function addMonths(date: Date, delta: number): Date {
  return new Date(date.getFullYear(), date.getMonth() + delta, 1)
}

// ── Límites (min / max) ──

const minDate = computed(() => (props.min === null || props.min === undefined || props.min === '' ? null : parseDateInput(props.min)))
const maxDate = computed(() => (props.max === null || props.max === undefined || props.max === '' ? null : parseDateInput(props.max)))

function clampDate(date: Date): Date {
  if (minDate.value && date < minDate.value) return minDate.value
  if (maxDate.value && date > maxDate.value) return maxDate.value
  return date
}

// ── Estado ──

const month = ref<Date>(clampDate(parseDateInput(props.modelValue)))

watch(
  () => props.modelValue,
  (value) => {
    if (value === null || value === undefined || value === '') return
    const parsed = clampDate(parseDateInput(value))
    if (!sameMonth(parsed, month.value)) {
      month.value = parsed
    }
  },
)

// Si min/max cambian en runtime y dejan el mes fuera del rango, se re-ajusta
watch([minDate, maxDate], () => {
  const next = clampDate(month.value)
  if (!sameMonth(next, month.value)) {
    month.value = next
  }
})

// ── Formato con tokens (Intl nativo) ──

// Orden importa: se escanea de mayor a menor longitud
const MONTH_TOKENS = ['MMMM', 'MMM', 'MM', 'yyyy', 'M', 'yy'] as const

function formatMonth(date: Date, format: string): string {
  const locale = props.locale
  const monthFull = new Intl.DateTimeFormat(locale, { month: 'long' }).format(date)
  const monthShort = new Intl.DateTimeFormat(locale, { month: 'short' }).format(date)
  const pad = (n: number) => String(n).padStart(2, '0')
  const values: Record<string, string> = {
    MMMM: monthFull,
    MMM: monthShort,
    MM: pad(date.getMonth() + 1),
    M: String(date.getMonth() + 1),
    yyyy: String(date.getFullYear()),
    yy: String(date.getFullYear()).slice(-2),
  }
  let out = ''
  let i = 0
  while (i < format.length) {
    let matched = false
    for (const token of MONTH_TOKENS) {
      if (format.startsWith(token, i)) {
        out += values[token]
        i += token.length
        matched = true
        break
      }
    }
    if (!matched) {
      out += format[i]
      i += 1
    }
  }
  return out
}

// En Custom Elements los atributos booleanos llegan como string: "false"/"0" = desactivado
const showYearNavigation = computed(
  () => props.yearNavigation !== false && props.yearNavigation !== 'false' && props.yearNavigation !== '0',
)

// Si el formato no incluye año y el mes no es del año actual, se muestra el año al lado
const hasYearToken = computed(() => /[yY]/.test(props.monthFormat))
const currentYear = computed(() => new Date().getFullYear())
const showAutoYear = computed(() => !hasYearToken.value && month.value.getFullYear() !== currentYear.value)

const monthLabel = computed(() => formatMonth(month.value, props.monthFormat))
const yearLabel = computed(() => formatMonth(month.value, props.yearFormat))

// ── Navegación (con límites) ──

function setMonth(next: Date) {
  if (props.disabled) return
  const clamped = clampDate(next)
  if (sameMonth(clamped, month.value)) return
  month.value = clamped
  emit('update:modelValue', clamped)
  emit('change', clamped)
}

function nextMonth() {
  setMonth(addMonths(month.value, 1))
}

function prevMonth() {
  setMonth(addMonths(month.value, -1))
}

function nextYear() {
  setMonth(new Date(month.value.getFullYear() + 1, month.value.getMonth(), 1))
}

function prevYear() {
  setMonth(new Date(month.value.getFullYear() - 1, month.value.getMonth(), 1))
}

function goToMonth(value: string | number | Date) {
  setMonth(parseDateInput(value))
}

function getValue(): Date {
  return new Date(month.value)
}

function setValue(value: string | number | Date | null) {
  if (value === null || value === undefined || value === '') return
  setMonth(parseDateInput(value))
}

defineExpose({
  nextMonth,
  prevMonth,
  nextYear,
  prevYear,
  goToMonth,
  getValue,
  setValue,
})

// Botones deshabilitados en los bordes de min/max
const canPrevMonth = computed(() => !minDate.value || month.value > minDate.value)
const canNextMonth = computed(() => !maxDate.value || month.value < maxDate.value)
const canPrevYear = computed(
  () => !minDate.value || new Date(month.value.getFullYear() - 1, month.value.getMonth(), 1) >= minDate.value,
)
const canNextYear = computed(
  () => !maxDate.value || new Date(month.value.getFullYear() + 1, month.value.getMonth(), 1) <= maxDate.value,
)

// Labels de accesibilidad de los botones de navegación
const ariaYearPrev = 'Ir al año anterior'
const ariaMonthPrev = 'Ir al mes anterior'
const ariaMonthNext = 'Ir al mes siguiente'
const ariaYearNext = 'Ir al año siguiente'

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
    class="cu-month-slider"
    :class="{ 'is-disabled': props.disabled }"
    :style="colorStyles"
    role="group"
    :aria-label="`Selector de mes: ${showAutoYear ? monthLabel + ' ' + yearLabel : monthLabel}`"
  >
    <Button
      v-if="showYearNavigation"
      class="cu-button--icon-only"
      variant="ghost"
      :color="props.color"
      :disabled="props.disabled || !canPrevYear"
      :aria-label="ariaYearPrev"
      @click="prevYear()"
    >
      <LucideChevronsLeft :width="16" :height="16" />
    </Button>

    <Button
      class="cu-button--icon-only"
      variant="ghost"
      :color="props.color"
      :disabled="props.disabled || !canPrevMonth"
      :aria-label="ariaMonthPrev"
      @click="prevMonth()"
    >
      <LucideChevronLeft :width="16" :height="16" />
    </Button>

    <MonthSliderLabel
      :label="monthLabel"
      :year="showAutoYear ? yearLabel : ''"
      :disabled="props.disabled"
      :color="props.color"
      :variant="props.variant"
      :can-navigate-prev="canPrevMonth"
      :can-navigate-next="canNextMonth"
      @navigate="(dir) => setMonth(addMonths(month, dir))"
    />

    <Button
      class="cu-button--icon-only"
      variant="ghost"
      :color="props.color"
      :disabled="props.disabled || !canNextMonth"
      :aria-label="ariaMonthNext"
      @click="nextMonth()"
    >
      <LucideChevronRight :width="16" :height="16" />
    </Button>

    <Button
      v-if="showYearNavigation"
      class="cu-button--icon-only"
      variant="ghost"
      :color="props.color"
      :disabled="props.disabled || !canNextYear"
      :aria-label="ariaYearNext"
      @click="nextYear()"
    >
      <LucideChevronsRight :width="16" :height="16" />
    </Button>
  </div>
</template>

<style scoped>
.cu-month-slider {
  display: inline-flex;
  align-items: center;
  gap: var(--cu-space-2xs);
  font-family: var(--cu-font-sans);
}

.cu-month-slider.is-disabled {
  opacity: 0.7;
}
</style>
