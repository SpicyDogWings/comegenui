<script setup lang="ts">
// DualCalendar (interno) — dos `Calendar` en modo `range`, con meses
// consecutivos al abrir y navegación independiente. NO tiene lógica de rango
// propia: el rango lo administra `Calendar` y acá sólo se comparte el valor
// entre los dos (primer click en cualquiera inicia, segundo completa). No se
// registra como Custom Element ni se publica en la lib: lo consumen
// `DatePicker` (dualCalendar) y el playground.
import { ref, type PropType } from 'vue'
import Calendar from './Calendar.vue'
import type { DateRange } from '@/composables/useDateRange'
import { addMonths, isMonthFormat, isYearFormat, parseDate, type CalendarEvent } from '@/utils/date'

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
    type: String as PropType<'solid' | 'outlined' | 'soft' | 'subtle'>,
    default: 'soft',
  },
  disabled: { type: Boolean, default: false },
  locale: { type: String, default: 'es' },
  weekStart: {
    type: Number,
    default: 1,
    validator: (value: number) => value >= 0 && value <= 6,
  },
  yearNavigation: { type: [Boolean, String] as PropType<boolean | string>, default: false },
  /** Formato del mes en el header: `MMMM` (septiembre), `MMM` (sept), `MM` (09) o `M` (9). Un valor no soportado cae a `MMMM` */
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
  disabledWeekdays: { type: [Array, String] as PropType<number[] | string>, default: '' },
  disabledDates: { type: [Array, String] as PropType<(string | Date)[] | string>, default: '' },
  events: {
    type: Array as PropType<CalendarEvent[]>,
    default: () => [],
  },
  grid: { type: Boolean, default: false },
  border: { type: Boolean, default: false },
})

const emit = defineEmits<{
  (e: 'update:startDate', value: Date | null): void
  (e: 'update:endDate', value: Date | null): void
  (e: 'change', value: DateRange): void
  (e: 'select', value: DateRange): void
}>()

// ── Espejo del rango: el valor lo administra cada Calendar (modo range) y acá
// se comparte el mismo `rangeStart`/`rangeEnd` entre los dos. ──

const rangeStart = ref<Date | null>(parseDate(props.startDate))
const rangeEnd = ref<Date | null>(parseDate(props.endDate))

function onRangeStart(value: Date | null) {
  rangeStart.value = value
  emit('update:startDate', value)
}

function onRangeEnd(value: Date | null) {
  rangeEnd.value = value
  emit('update:endDate', value)
}

function onRangeChange(value: Date | DateRange) {
  if (value instanceof Date) return
  rangeStart.value = value.start
  rangeEnd.value = value.end
  emit('change', value)
}

function onRangeSelect(value: Date | DateRange) {
  if (value instanceof Date) return
  rangeStart.value = value.start
  rangeEnd.value = value.end
  emit('select', value)
}

// ── Meses: el primero arranca en el mes del `startDate` (o el actual) y el
// segundo es el siguiente. Cada Calendar navega su propio mes. ──

function initialMonth(): Date {
  const start = parseDate(props.startDate)
  const base = start ?? new Date()
  return new Date(base.getFullYear(), base.getMonth(), 1)
}

const firstMonth = ref<Date>(initialMonth())
const secondMonth = ref<Date>(addMonths(firstMonth.value, 1))

// ── API programática ──

/** Devuelve la fecha de inicio del rango. */
function getStartDate(): Date | null {
  return rangeStart.value
}

/** Devuelve la fecha de fin del rango. */
function getEndDate(): Date | null {
  return rangeEnd.value
}

/** Setea el rango completo y emite los cambios. */
function setRange(start: string | number | Date | null, end: string | number | Date | null) {
  rangeStart.value = parseDate(start)
  rangeEnd.value = parseDate(end)
  emit('update:startDate', rangeStart.value)
  emit('update:endDate', rangeEnd.value)
  emit('change', { start: rangeStart.value, end: rangeEnd.value })
}

/** Limpia el rango. */
function clear() {
  rangeStart.value = null
  rangeEnd.value = null
  emit('update:startDate', null)
  emit('update:endDate', null)
  emit('change', { start: null, end: null })
}

defineExpose({ getStartDate, getEndDate, setRange, clear })
</script>

<template>
  <div class="cu-dual-calendar">
    <Calendar
      mode="range"
      :view-month="firstMonth"
      :range-start="rangeStart"
      :range-end="rangeEnd"
      :min="props.min"
      :max="props.max"
      :color="props.color"
      :variant="props.variant"
      :locale="props.locale"
      :week-start="props.weekStart"
      :year-navigation="props.yearNavigation"
      :month-format="props.monthFormat"
      :year-format="props.yearFormat"
      :disabled="props.disabled"
      :disabled-weekdays="props.disabledWeekdays"
      :disabled-dates="props.disabledDates"
      :events="props.events"
      :grid="props.grid"
      :border="props.border"
      @update:view-month="firstMonth = $event"
      @update:range-start="onRangeStart"
      @update:range-end="onRangeEnd"
      @change="onRangeChange"
      @select="onRangeSelect"
    />
    <Calendar
      mode="range"
      :view-month="secondMonth"
      :range-start="rangeStart"
      :range-end="rangeEnd"
      :min="props.min"
      :max="props.max"
      :color="props.color"
      :variant="props.variant"
      :locale="props.locale"
      :week-start="props.weekStart"
      :year-navigation="props.yearNavigation"
      :month-format="props.monthFormat"
      :year-format="props.yearFormat"
      :disabled="props.disabled"
      :disabled-weekdays="props.disabledWeekdays"
      :disabled-dates="props.disabledDates"
      :events="props.events"
      :grid="props.grid"
      :border="props.border"
      @update:view-month="secondMonth = $event"
      @update:range-start="onRangeStart"
      @update:range-end="onRangeEnd"
      @change="onRangeChange"
      @select="onRangeSelect"
    />
  </div>
</template>

<style scoped>
.cu-dual-calendar {
  display: flex;
  flex-direction: row;
  gap: var(--cu-space-md);
}

.cu-dual-calendar :deep(.cu-calendar) {
  flex: 1;
  min-width: 0;
}
</style>
