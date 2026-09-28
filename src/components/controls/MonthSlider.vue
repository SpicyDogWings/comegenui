<script setup lang="ts">
import { computed, ref, watch, type PropType } from 'vue'
import { isVariant } from '@/utils/validators'
import Button from '@/components/buttons/Button.vue'
import LucideChevronLeft from '@/components/icons/LucideChevronLeft.vue'
import LucideChevronRight from '@/components/icons/LucideChevronRight.vue'
import LucideChevronsLeft from '@/components/icons/LucideChevronsLeft.vue'
import LucideChevronsRight from '@/components/icons/LucideChevronsRight.vue'
import MonthSliderLabel from './month-slider/MonthSliderLabel.vue'
import {
  addMonths,
  formatDate,
  isMonthFormat,
  isYearFormat,
  parseMonth,
  sameMonth,
  sanitizeMonthFormat,
  sanitizeYearFormat,
  startOfCurrentMonth,
} from '@/utils/date'

const props = defineProps({
  modelValue: {
    type: [String, Number, Date] as PropType<string | number | Date | null>,
    default: null,
  },
  /** Formato del mes: `MMMM` (septiembre), `MMM` (sept), `MM` (09) o `M` (9). Un valor no soportado cae a `MMMM` */
  monthFormat: {
    type: String as PropType<'MMMM' | 'MMM' | 'MM' | 'M'>,
    default: 'MMMM',
    validator: isMonthFormat,
  },
  /** Formato del año (badge cuando el mes no es del año actual): `yyyy` (2026) o `yy` (26). Un valor no soportado cae a `yyyy` */
  yearFormat: {
    type: String as PropType<'yyyy' | 'yy'>,
    default: 'yyyy',
    validator: isYearFormat,
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
    validator: isVariant,
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

// ── Límites (min / max) ──

const minDate = computed(() => parseMonth(props.min))
const maxDate = computed(() => parseMonth(props.max))

function clampDate(date: Date): Date {
  if (minDate.value && date < minDate.value) return minDate.value
  if (maxDate.value && date > maxDate.value) return maxDate.value
  return date
}

// ── Estado ──

const month = ref<Date>(clampDate(parseMonth(props.modelValue) ?? startOfCurrentMonth()))

watch(
  () => props.modelValue,
  (value) => {
    if (value === null || value === undefined || value === '') return
    const parsed = clampDate(parseMonth(value) ?? startOfCurrentMonth())
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

// ── Formato con tokens (Intl nativo, compartido con Calendar/DatePicker) ──
// `monthFormat`/`yearFormat` son enums cerrados: un valor no soportado cae al
// default acá (enforcement runtime, también para los Custom Elements).

const monthFormatValue = computed(() => sanitizeMonthFormat(props.monthFormat))
const yearFormatValue = computed(() => sanitizeYearFormat(props.yearFormat))

const formatMonth = (date: Date, format: string) =>
  formatDate(date, format, props.locale, { capitalizeMonths: false })

// En Custom Elements los atributos booleanos llegan como string: "false"/"0" = desactivado
const showYearNavigation = computed(
  () => props.yearNavigation !== false && props.yearNavigation !== 'false' && props.yearNavigation !== '0',
)

// El formato de mes es solo mes: el año se muestra al lado cuando no es el actual
const currentYear = computed(() => new Date().getFullYear())
const showAutoYear = computed(() => month.value.getFullYear() !== currentYear.value)

const monthLabel = computed(() => formatMonth(month.value, monthFormatValue.value))
const yearLabel = computed(() => formatMonth(month.value, yearFormatValue.value))

// ── Navegación (con límites) ──

function setMonth(next: Date) {
  if (props.disabled) return
  const clamped = clampDate(next)
  if (sameMonth(clamped, month.value)) return
  month.value = clamped
  emit('update:modelValue', clamped)
  emit('change', clamped)
}

/** Avanza un mes (respetando max). */
function nextMonth() {
  setMonth(addMonths(month.value, 1))
}

/** Retrocede un mes (respetando min). */
function prevMonth() {
  setMonth(addMonths(month.value, -1))
}

/** Avanza un año manteniendo el mes. */
function nextYear() {
  setMonth(new Date(month.value.getFullYear() + 1, month.value.getMonth(), 1))
}

/** Retrocede un año manteniendo el mes. */
function prevYear() {
  setMonth(new Date(month.value.getFullYear() - 1, month.value.getMonth(), 1))
}

/** Navega al mes de la fecha indicada. */
function goToMonth(value: string | number | Date) {
  setMonth(parseMonth(value) ?? startOfCurrentMonth())
}

/** Devuelve el mes visible. */
function getValue(): Date {
  return new Date(month.value)
}

/** Establece el mes desde una fecha, timestamp o string. */
function setValue(value: string | number | Date | null) {
  if (value === null || value === undefined || value === '') return
  setMonth(parseMonth(value) ?? startOfCurrentMonth())
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
