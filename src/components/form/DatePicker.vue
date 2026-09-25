<script setup lang="ts">
import { computed, ref, watch, type PropType } from 'vue'
import Button from '../buttons/Button.vue'
import Calendar from '../controls/Calendar.vue'
import DualCalendar from '../controls/DualCalendar.vue'
import DatePickerShell from './DatePickerShell.vue'
import { useDateRange } from '@/composables/useDateRange'
import { formatDate, normalizeDate, parseDate, type CalendarEvent } from '@/utils/date'

const props = defineProps({
  /** Modo de selección: `single` (una fecha) o `range` (inicio + fin). */
  mode: {
    type: String as PropType<'single' | 'range'>,
    default: 'single',
    validator: (value: string) => ['single', 'range'].includes(value),
  },
  // API espejo de MonthSlider/YearSlider: acepta Date, timestamp o fecha "YYYY-MM-DD"
  /** Fecha seleccionada (modo `single`) */
  modelValue: {
    type: [String, Number, Date] as PropType<string | number | Date | null>,
    default: null,
  },
  /** Inicio del rango (modo `range`) */
  startDate: {
    type: [String, Number, Date] as PropType<string | number | Date | null>,
    default: null,
  },
  /** Fin del rango (modo `range`) */
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
  monthFormat: { type: String, required: false, default: 'MMMM' },
  yearFormat: { type: String, required: false, default: 'yyyy' },
  // Días deshabilitados del calendario interno (además de min/max)
  disabledWeekdays: { type: [Array, String] as PropType<number[] | string>, required: false, default: '' },
  disabledDates: { type: [Array, String] as PropType<(string | Date)[] | string>, required: false, default: '' },
  events: {
    type: Array as PropType<CalendarEvent[]>,
    default: () => [],
  },
  grid: { type: Boolean, required: false, default: false },
  border: { type: Boolean, required: false, default: false },
  /** Modo `range`: muestra dos meses lado a lado (dual) */
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

const isRange = computed(() => props.mode === 'range')

// ── Estado (single) ──

const selectedValue = ref<Date | null>(parseDate(props.modelValue))

watch(
  () => props.modelValue,
  (value) => {
    selectedValue.value = parseDate(value)
  },
)

// ── Estado (range) ──

const {
  startValue: rangeStart,
  endValue: rangeEnd,
  select: selectRange,
  clear: clearRange,
  setRange,
  reset: resetRange,
} = useDateRange({
  start: () => props.startDate,
  end: () => props.endDate,
  onStartChange: (value) => emit('update:startDate', value),
  onEndChange: (value) => emit('update:endDate', value),
  onChange: (value) => emit('change', value),
  onSelect: (value) => emit('select', value),
})

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

function onSelectSingle(day: Date) {
  selectedValue.value = day
  emit('update:modelValue', day)
  emit('change', day)
  emit('select', day)
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
  // Evita que un rango a medio elegir sobreviva al cierre del panel.
  resetRange()
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

/** Devuelve la fecha de inicio (modo rango). */
function getStartDate(): Date | null {
  return rangeStart.value
}

/** Devuelve la fecha de fin (modo rango). */
function getEndDate(): Date | null {
  return rangeEnd.value
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
      <DualCalendar
        v-else
        :start-date="rangeStart"
        :end-date="rangeEnd"
        :months="dualCalendar ? 2 : 1"
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
        @select="selectRange"
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