<script setup lang="ts">
import { computed, ref, watch, type PropType } from 'vue'
import Button from '../buttons/Button.vue'
import Calendar from '../controls/Calendar.vue'
import DualCalendar from '../controls/DualCalendar.vue'
import DatePickerShell from './DatePickerShell.vue'
import type { DateRange } from '@/composables/useDateRange'
import { formatDate, isMonthFormat, isYearFormat, normalizeDate, parseDate, type CalendarEvent } from '@/utils/date'

const props = defineProps({
  /** Tipo de calendario: `single` (una fecha, `Calendar`) o `range` (inicio + fin, `Calendar` en modo rango). Con `dualCalendar` el tipo es dual (range, 2 meses) */
  mode: {
    type: String as PropType<'single' | 'range'>,
    default: 'single',
    validator: (value: string) => ['single', 'range'].includes(value),
  },
  // API espejo de MonthSlider/YearSlider: acepta Date, timestamp o fecha "YYYY-MM-DD"
  /** Fecha seleccionada (calendario `single`) */
  modelValue: {
    type: [String, Number, Date] as PropType<string | number | Date | null>,
    default: null,
  },
  /** Inicio del rango. Solo con calendario de rango (`mode="range"` o `dualCalendar`); en `single` se ignora */
  startDate: {
    type: [String, Number, Date] as PropType<string | number | Date | null>,
    default: null,
  },
  /** Fin del rango. Solo con calendario de rango (`mode="range"` o `dualCalendar`); en `single` se ignora */
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
    required: false,
    default: 'neutral',
  },
  variant: {
    type: String as PropType<'outlined' | 'soft' | 'ghost' | 'subtle'>,
    required: false,
    default: 'soft',
  },
  disabled: { type: Boolean, required: false, default: false },
  placeholder: { type: String, required: false, default: '' },
  locale: { type: String, required: false, default: 'es' },
  weekStart: {
    type: Number,
    required: false,
    default: 1,
    validator: (value: number) => value >= 0 && value <= 6,
  },
  // Formato de la fecha mostrada en el trigger (tokens: dd MM MMM MMMM yy yyyy)
  format: { type: String, required: false, default: 'dd/MM/yyyy' },
  // Controles de mes del calendario interno (delegan al MonthSlider)
  yearNavigation: { type: [Boolean, String] as PropType<boolean | string>, required: false, default: false },
  /** Formato del mes en el header del calendario interno: `MMMM` (septiembre), `MMM` (sept), `MM` (09) o `M` (9). Un valor no soportado cae a `MMMM` */
  monthFormat: {
    type: String as PropType<'MMMM' | 'MMM' | 'MM' | 'M'>,
    required: false,
    default: 'MMMM',
    validator: isMonthFormat,
  },
  /** Formato del año (badge cuando el mes no es del año actual): `yyyy` (2026) o `yy` (26). Un valor no soportado cae a `yyyy` */
  yearFormat: {
    type: String as PropType<'yyyy' | 'yy'>,
    required: false,
    default: 'yyyy',
    validator: isYearFormat,
  },
  // Días deshabilitados del calendario interno (además de min/max)
  disabledWeekdays: { type: [Array, String] as PropType<number[] | string>, required: false, default: '' },
  disabledDates: { type: [Array, String] as PropType<(string | Date)[] | string>, required: false, default: '' },
  events: {
    type: Array as PropType<CalendarEvent[]>,
    default: () => [],
  },
  grid: { type: Boolean, required: false, default: false },
  border: { type: Boolean, required: false, default: false },
  /** Activa el rango a dos meses (dual). **Implica `range`**: aunque `mode` sea `single`, el picker selecciona un rango */
  dualCalendar: { type: Boolean, required: false, default: false },
  position: { type: String, required: false, default: 'bottom' },
  align: { type: String, required: false, default: 'start' },
  fixed: { type: Boolean, required: false, default: false },
  clearable: { type: Boolean, required: false, default: true },
  // Default por modo (single: true, range: false) resuelto en `showToday`
  todayButton: { type: Boolean, required: false, default: undefined },
  label: { type: String, required: false, default: '' },
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: Date | null): void
  (e: 'update:startDate', value: Date | null): void
  (e: 'update:endDate', value: Date | null): void
  (e: 'change', value: Date | { start: Date | null; end: Date | null } | null): void
  (e: 'select', value: Date | { start: Date | null; end: Date | null }): void
  (e: 'open'): void
  (e: 'close'): void
}>()

const shellRef = ref<InstanceType<typeof DatePickerShell> | null>(null)

// `dualCalendar` implica rango: el picker maneja range siempre que el dual
// esté activo, aunque `mode` sea `single`.
const isRange = computed(() => props.mode === 'range' || props.dualCalendar)

// ── Estado (single) ──

const selectedValue = ref<Date | null>(parseDate(props.modelValue))

watch(
  () => props.modelValue,
  (value) => {
    selectedValue.value = parseDate(value)
  },
)

// ── Estado (range) ──
// DatePicker administra los valores: los espeja desde las props y los pasa a
// los hijos (`Calendar mode="range"` o `DualCalendar`). Los hijos corren la FSM
// de 2 clicks y emiten; acá se actualizan los espejos y se re-emite la API.

const rangeStart = ref<Date | null>(parseDate(props.startDate))
const rangeEnd = ref<Date | null>(parseDate(props.endDate))

watch(
  () => props.startDate,
  (value) => {
    rangeStart.value = parseDate(value)
  },
)
watch(
  () => props.endDate,
  (value) => {
    rangeEnd.value = parseDate(value)
  },
)

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

/** Setea el rango completo y emite los cambios (solo con calendario de rango). */
function setRange(start: string | number | Date | null, end: string | number | Date | null) {
  if (!isRange.value) return
  rangeStart.value = parseDate(start)
  rangeEnd.value = parseDate(end)
  emit('update:startDate', rangeStart.value)
  emit('update:endDate', rangeEnd.value)
  emit('change', { start: rangeStart.value, end: rangeEnd.value })
}

/** Limpia el rango (modo rango). */
function clearRange() {
  rangeStart.value = null
  rangeEnd.value = null
  emit('update:startDate', null)
  emit('update:endDate', null)
  emit('change', { start: null, end: null })
}

// ── Label del trigger ──

const selectedLabel = computed(() => {
  if (!isRange.value) {
    if (selectedValue.value === null) return props.placeholder || 'Seleccionar fecha...'
    return formatDate(selectedValue.value, props.format, props.locale)
  }
  const fmt = (date: Date) => formatDate(date, props.format, props.locale)
  if (rangeStart.value && rangeEnd.value) return `${fmt(rangeStart.value)} - ${fmt(rangeEnd.value)}`
  if (rangeStart.value) return `${fmt(rangeStart.value)} - ...`
  return props.placeholder || 'Seleccionar rango...'
})

// El Calendar no tiene variante `ghost` (se confunde con el día de hoy)
const calendarVariant = computed<'solid' | 'outlined' | 'soft' | 'subtle'>(() =>
  props.variant === 'ghost' ? 'soft' : props.variant,
)

const showToday = computed(() => props.todayButton ?? !isRange.value)

// Panel: más ancho con navegación de año (4 botones) y con dual (2 meses)
const panelWidth = computed(() => {
  if (isRange.value && props.dualCalendar) {
    return props.yearNavigation ? '700px' : '580px'
  }
  return props.yearNavigation ? '330px' : '280px'
})

// ── Interacción ──

function onSelectSingle(value: Date | DateRange) {
  if (!(value instanceof Date)) return
  selectedValue.value = value
  emit('update:modelValue', value)
  emit('change', value)
  emit('select', value)
  shellRef.value?.close()
}

function goToday() {
  const now = normalizeDate(new Date())
  if (isRange.value) {
    setRange(now, now)
    shellRef.value?.close()
    return
  }
  selectedValue.value = now
  emit('update:modelValue', now)
  emit('change', now)
  emit('select', now)
  shellRef.value?.close()
}

/** Limpia la selección. En modo simple cierra el panel; en rango lo deja abierto. */
function clear() {
  if (isRange.value) {
    clearRange()
    return
  }
  selectedValue.value = null
  emit('update:modelValue', null)
  emit('change', null)
  shellRef.value?.close()
}

function onClose() {
  emit('close')
}

// ── API programática ──

/** Devuelve la fecha seleccionada (modo simple). */
function getValue(): Date | null {
  return selectedValue.value
}

/** Setea la fecha seleccionada y emite change (modo simple). */
function setValue(value: string | number | Date | null) {
  if (isRange.value) return
  const parsed = parseDate(value)
  if (parsed === null) return
  selectedValue.value = parsed
  emit('update:modelValue', parsed)
  emit('change', parsed)
}

/** Devuelve la fecha de inicio (solo con calendario de rango). */
function getStartDate(): Date | null {
  return isRange.value ? rangeStart.value : null
}

/** Devuelve la fecha de fin (solo con calendario de rango). */
function getEndDate(): Date | null {
  return isRange.value ? rangeEnd.value : null
}

/** Abre el panel. */
function open() { shellRef.value?.open() }
/** Cierra el panel. */
function close() { shellRef.value?.close() }
/** Alterna el panel. */
function toggle() { shellRef.value?.toggle() }

defineExpose({
  open,
  close,
  toggle,
  getValue,
  setValue,
  clear,
  getStartDate,
  getEndDate,
  setRange,
  /** Indica si el panel está abierto. */
  isOpen: () => shellRef.value?.isOpen() ?? false,
})
</script>

<template>
  <DatePickerShell
    ref="shellRef"
    :color="color"
    :variant="variant"
    :disabled="disabled"
    :label="label"
    :label-text="selectedLabel"
    :position="position"
    :align="align"
    :fixed="fixed"
    :panel-width="panelWidth"
    @open="emit('open')"
    @close="onClose"
  >
    <div class="cu-date-picker-panel">
      <Calendar
        v-if="!isRange"
        :model-value="selectedValue"
        :min="min"
        :max="max"
        :color="color"
        :variant="calendarVariant"
        :locale="locale"
        :week-start="weekStart"
        :year-navigation="yearNavigation"
        :month-format="monthFormat"
        :year-format="yearFormat"
        :disabled="disabled"
        :disabled-weekdays="disabledWeekdays"
        :disabled-dates="disabledDates"
        :events="events"
        :grid="grid"
        :border="border"
        @select="onSelectSingle"
      />
      <Calendar
        v-else-if="!dualCalendar"
        mode="range"
        :range-start="rangeStart"
        :range-end="rangeEnd"
        :min="min"
        :max="max"
        :color="color"
        :variant="calendarVariant"
        :locale="locale"
        :week-start="weekStart"
        :year-navigation="yearNavigation"
        :month-format="monthFormat"
        :year-format="yearFormat"
        :disabled="disabled"
        :disabled-weekdays="disabledWeekdays"
        :disabled-dates="disabledDates"
        :events="events"
        :grid="grid"
        :border="border"
        @update:range-start="onRangeStart"
        @update:range-end="onRangeEnd"
        @change="onRangeChange"
        @select="onRangeSelect"
      />
      <DualCalendar
        v-else
        :start-date="rangeStart"
        :end-date="rangeEnd"
        :min="min"
        :max="max"
        :color="color"
        :variant="calendarVariant"
        :locale="locale"
        :week-start="weekStart"
        :year-navigation="yearNavigation"
        :month-format="monthFormat"
        :year-format="yearFormat"
        :disabled="disabled"
        :disabled-weekdays="disabledWeekdays"
        :disabled-dates="disabledDates"
        :events="events"
        :grid="grid"
        :border="border"
        @update:start-date="onRangeStart"
        @update:end-date="onRangeEnd"
        @change="onRangeChange"
        @select="onRangeSelect"
      />
      <div v-if="showToday || clearable" class="cu-date-picker-footer">
        <Button
          v-if="showToday"
          variant="ghost"
          :color="color"
          class="cu-date-picker-footer-btn"
          @click="goToday()"
        >
          Hoy
        </Button>
        <Button
          v-if="clearable"
          variant="ghost"
          :color="color"
          class="cu-date-picker-footer-btn"
          @click="clear()"
        >
          Limpiar
        </Button>
      </div>
    </div>
  </DatePickerShell>
</template>

<style scoped>
.cu-date-picker-panel {
  display: flex;
  flex-direction: column;
  gap: var(--cu-space-sm);
}

.cu-date-picker-footer {
  display: flex;
  justify-content: space-between;
  gap: var(--cu-space-sm);
  border-top: var(--cu-border-thin) solid var(--cu-border-color);
  padding-top: var(--cu-space-sm);
}

.cu-date-picker-footer-btn {
  font-size: var(--cu-font-size-xs);
}
</style>