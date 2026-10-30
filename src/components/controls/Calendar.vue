<script setup lang="ts">
import { computed, nextTick, ref, watch, type PropType } from 'vue'
import { isDateMode, isVariantNoGhost } from '@/utils/validators'
import MonthSlider from './MonthSlider.vue'
import {
  addDays,
  addMonths,
  isDateDisabled,
  isMonthFormat,
  isYearFormat,
  parseDate,
  sameDay,
  sameMonth,
  shiftMonth,
  startOfCurrentMonth,
  startOfWeek,
  toDisabledDates,
  toDisabledWeekdays,
  toISODate,
  type CalendarEvent,
} from '@/utils/date'
import { useDateRange } from '@/composables/useDateRange'

const props = defineProps({
  // API espejo de MonthSlider/YearSlider: acepta Date, timestamp o fecha "YYYY-MM-DD".
  // En Custom Elements los atributos siempre llegan como string.
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
    // ghost se quita: el día de hoy (transparente + color accent) se confundía con el seleccionado ghost
    type: String as PropType<'solid' | 'outlined' | 'soft' | 'subtle'>,
    default: 'soft',
    validator: isVariantNoGhost,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  // Días deshabilitados adicionales (además de min/max):
  // - disabledWeekdays: números de día de la semana (0 = domingo ... 6 = sábado).
  //   En CE llega como string "0,6" (o array en Vue).
  disabledWeekdays: {
    type: [Array, String] as PropType<number[] | string>,
    default: () => [],
  },
  // - disabledDates: fechas puntuales "YYYY-MM-DD" (o Date/timestamp en Vue).
  //   En CE llega como string separado por comas "2026-08-15,2026-08-16".
  disabledDates: {
    type: [Array, String] as PropType<(string | Date)[] | string>,
    default: () => [],
  },
  locale: {
    type: String,
    default: 'es',
  },
  // Día en que empieza la semana: 0 = domingo, 1 = lunes (default)
  weekStart: {
    type: Number,
    default: 1,
    validator: (value: number) => value >= 0 && value <= 6,
  },
  // ── Controles de mes (delegan al MonthSlider del repo) ──
  yearNavigation: {
    type: [Boolean, String] as PropType<boolean | string>,
    default: false,
  },
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
  // ── Eventos (puntos bajo la fecha) ──
  events: {
    type: Array as PropType<CalendarEvent[]>,
    default: () => [],
  },
  // ── Rango (resaltado entre dos fechas) ──
  rangeStart: {
    type: [String, Number, Date] as PropType<string | number | Date | null>,
    default: null,
  },
  rangeEnd: {
    type: [String, Number, Date] as PropType<string | number | Date | null>,
    default: null,
  },
  grid: {
    type: Boolean,
    default: false,
  },
  border: {
    type: Boolean,
    default: false,
  },
  // Mes visible (primer día). Si se pasa, el calendario queda controlado por
  // el consumidor (DualCalendar) y navega emitiendo `update:viewMonth`.
  viewMonth: {
    type: [String, Number, Date] as PropType<string | number | Date | null>,
    default: null,
  },
  /** Modo de selección: `single` (una fecha) o `range` (inicio + fin). */
  mode: {
    type: String as PropType<'single' | 'range'>,
    default: 'single',
    validator: isDateMode,
  },
})

type CalendarChange = Date | { start: Date | null; end: Date | null }

const emit = defineEmits<{
  (e: 'update:modelValue', value: Date): void
  (e: 'update:viewMonth', value: Date): void
  (e: 'update:rangeStart', value: Date | null): void
  (e: 'update:rangeEnd', value: Date | null): void
  (e: 'change', value: CalendarChange): void
  (e: 'select', value: CalendarChange): void
}>()

const WEEK_LENGTH = 7

// ── Límites (min / max) ──

const minDate = computed<Date | null>(() => parseDate(props.min))
const maxDate = computed<Date | null>(() => parseDate(props.max))

// Normaliza disabledWeekdays ("0,6" en CE o [0,6] en Vue)
const disabledWeekdayList = computed<number[]>(() => toDisabledWeekdays(props.disabledWeekdays))

// Normaliza disabledDates ("2026-08-15,2026-08-16" en CE o array en Vue)
const disabledDateList = computed<Date[]>(() => toDisabledDates(props.disabledDates))

// Recorta el mes visible al mes de min/max (navegación no sale del rango)
function clampMonth(date: Date): Date {
  if (minDate.value) {
    const limit = new Date(minDate.value.getFullYear(), minDate.value.getMonth(), 1)
    if (date < limit) return limit
  }
  if (maxDate.value) {
    const limit = new Date(maxDate.value.getFullYear(), maxDate.value.getMonth(), 1)
    if (date > limit) return limit
  }
  return date
}

// ── Estado ──

const today = new Date()

// Mes interno (modo no controlado). Si llega `viewMonth` por prop, manda esa.
// El mes de arranque sale del valor: `modelValue` (single) o el rango (range),
// así el picker abre en el mes de la fecha ya elegida.
function initialViewMonth(): Date {
  const base =
    parseDate(props.modelValue) ??
    parseDate(props.rangeStart) ??
    parseDate(props.rangeEnd) ??
    startOfCurrentMonth()
  return clampMonth(new Date(base.getFullYear(), base.getMonth(), 1))
}

const internalViewMonth = ref<Date>(initialViewMonth())
const viewMonthProp = computed<Date | null>(() => parseDate(props.viewMonth))
// También se recorta el mes controlado: si el consumidor manda uno fuera de
// min/max, header y grilla muestran el mismo mes del límite.
const viewMonth = computed<Date>(() => clampMonth(viewMonthProp.value ?? internalViewMonth.value))
const isViewMonthControlled = computed(() => viewMonthProp.value !== null)

/** Cambia el mes visible (respeta el consumidor si `viewMonth` está controlado). */
function setViewMonth(next: Date) {
  const target = clampMonth(new Date(next.getFullYear(), next.getMonth(), 1))
  if (isViewMonthControlled.value) emit('update:viewMonth', target)
  else internalViewMonth.value = target
}

// Estado interno de la selección (como Select/sliders): se actualiza al
// clickear y se sincroniza cuando cambia la prop modelValue desde afuera.
const selectedValue = ref<Date | null>(parseDate(props.modelValue))

watch(
  () => props.modelValue,
  (value) => {
    const parsed = parseDate(value)
    selectedValue.value = parsed
    if (parsed !== null) focusDay.value = parsed
    if (parsed === null || isViewMonthControlled.value) return
    internalViewMonth.value = clampMonth(new Date(parsed.getFullYear(), parsed.getMonth(), 1))
  },
)

// Si min/max cambian en runtime y dejan el mes fuera del rango, se re-ajusta
watch([minDate, maxDate], () => {
  if (isViewMonthControlled.value) return
  internalViewMonth.value = clampMonth(internalViewMonth.value)
})

// ── Modo rango (selección de inicio + fin) ──

const isRange = computed(() => props.mode === 'range')

const {
  startValue: rangeValueStart,
  endValue: rangeValueEnd,
  select: selectRange,
  clear: clearRange,
  setRange: setRangeValue,
} = useDateRange({
  start: () => props.rangeStart,
  end: () => props.rangeEnd,
  onStartChange: (value) => emit('update:rangeStart', value),
  onEndChange: (value) => emit('update:rangeEnd', value),
  onChange: (value) => emit('change', value),
  onSelect: (value) => emit('select', value),
})

// ── Navegación ──

// En rango, el foco del teclado sigue al inicio elegido (también por código).
watch(rangeValueStart, (value) => {
  if (value) focusDay.value = value
})

const canPrevMonth = computed(() => {
  if (!minDate.value) return true
  const limit = new Date(minDate.value.getFullYear(), minDate.value.getMonth(), 1)
  return viewMonth.value > limit
})

const canNextMonth = computed(() => {
  if (!maxDate.value) return true
  const limit = new Date(maxDate.value.getFullYear(), maxDate.value.getMonth(), 1)
  return viewMonth.value < limit
})

/** Avanza al mes siguiente (respetando max). */
function nextMonth() {
  if (props.disabled || !canNextMonth.value) return
  setViewMonth(addMonths(viewMonth.value, 1))
}

/** Retrocede al mes anterior (respetando min). */
function prevMonth() {
  if (props.disabled || !canPrevMonth.value) return
  setViewMonth(addMonths(viewMonth.value, -1))
}

/** Navega al mes de la fecha indicada. */
function goToMonth(value: string | number | Date) {
  const parsed = parseDate(value)
  if (parsed === null) return
  setViewMonth(new Date(parsed.getFullYear(), parsed.getMonth(), 1))
}

// El MonthSlider navega solo (botones + drag); acá solo seguimos su mes
function onMonthChange(date: Date) {
  setViewMonth(new Date(date.getFullYear(), date.getMonth(), 1))
}

// ── Grilla (7 columnas que se reparten el ancho disponible) ──

const weekdayLabels = computed<{ short: string; long: string }[]>(() => {
  // Semana de referencia que empieza en domingo: 2026-08-02
  const base = new Date(2026, 7, 2)
  const labels: { short: string; long: string }[] = []
  for (let i = 0; i < WEEK_LENGTH; i++) {
    const day = new Date(base.getFullYear(), base.getMonth(), base.getDate() + i)
    const short = new Intl.DateTimeFormat(props.locale, { weekday: 'short' }).format(day)
    const long = new Intl.DateTimeFormat(props.locale, { weekday: 'long' }).format(day)
    labels.push({
      short: short.charAt(0).toUpperCase() + short.slice(1),
      long: long.charAt(0).toUpperCase() + long.slice(1),
    })
  }
  // Rotar para que la semana arranque en weekStart (0 = domingo)
  return [...labels.slice(props.weekStart), ...labels.slice(0, props.weekStart)]
})

interface DayCell {
  date: Date | null
}

const weeks = computed<DayCell[][]>(() => {
  const year = viewMonth.value.getFullYear()
  const month = viewMonth.value.getMonth()
  const first = new Date(year, month, 1)
  const offset = (first.getDay() - props.weekStart + WEEK_LENGTH) % WEEK_LENGTH
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const cells: DayCell[] = []
  for (let i = 0; i < offset; i++) cells.push({ date: null })
  for (let day = 1; day <= daysInMonth; day++) cells.push({ date: new Date(year, month, day) })

  const rows: DayCell[][] = []
  for (let i = 0; i < cells.length; i += WEEK_LENGTH) {
    rows.push(cells.slice(i, i + WEEK_LENGTH))
  }
  return rows
})

const monthLabel = computed(() => {
  const label = new Intl.DateTimeFormat(props.locale, { month: 'long', year: 'numeric' }).format(
    viewMonth.value,
  )
  return label.charAt(0).toUpperCase() + label.slice(1)
})

// ── Eventos ──

function getEventsForDay(day: Date): CalendarEvent[] {
  // Un evento con fecha inválida (`parseDate` → null) se ignora: antes
  // `sameDay(null, day)` rompía el render y la grilla entera desaparecía.
  return props.events.filter((ev) => {
    const date = parseDate(ev?.date ?? null)
    return date !== null && sameDay(date, day)
  })
}

// ── Selección ──

function isDisabledDay(day: Date): boolean {
  return isDateDisabled(day, {
    disabled: props.disabled,
    min: minDate.value,
    max: maxDate.value,
    disabledWeekdays: disabledWeekdayList.value,
    disabledDates: disabledDateList.value,
  })
}

/** Fuera de `min`/`max`: el teclado no navega más allá (los deshabilitados por
 *  weekday/fecha puntual sí se pueden enfocar, como pide el patrón de grid). */
function isOutOfLimits(day: Date): boolean {
  if (minDate.value && day < minDate.value) return true
  return !!(maxDate.value && day > maxDate.value)
}

function selectDay(day: Date) {
  if (isDisabledDay(day)) return
  focusDay.value = day
  if (isRange.value) {
    // La FSM de 2 clicks vive en `useDateRange`: primer click inicio, segundo fin.
    selectRange(day)
    return
  }
  selectedValue.value = day
  emit('update:modelValue', day)
  emit('change', day)
  emit('select', day)
}

function dayClasses(day: Date): Record<string, boolean> {
  const selected =
    !isRange.value && selectedValue.value !== null && sameDay(day, selectedValue.value)
  const inRange = isInRange(day)
  return {
    'cu-calendar-day--selected': selected,
    'cu-calendar-day--today': sameDay(day, today) && !selected,
    'cu-calendar-day--disabled': isDisabledDay(day),
    'cu-calendar-day--range': inRange,
    'cu-calendar-day--range-start': rangeStartVal.value !== null && sameDay(day, rangeStartVal.value),
    'cu-calendar-day--range-end': rangeEndVal.value !== null && sameDay(day, rangeEndVal.value),
    [`cu-calendar-day--${props.variant}`]: selected,
  }
}

// ── Accesibilidad de la grilla (patrón WAI-ARIA grid) ──
// Un solo día es tab-stop (roving tabindex) y las flechas/Home/End/PageUp/PageDown
// mueven el foco. Sin esto la grilla eran 31 paradas de Tab y el teclado no
// navegaba.

/** Día que tiene el foco del teclado (roving). `null` = todavía no se movió. */
const focusDay = ref<Date | null>(parseDate(props.modelValue) ?? parseDate(props.rangeStart))

const gridRef = ref<HTMLElement | null>(null)

const dayAriaFormatter = computed(
  () =>
    new Intl.DateTimeFormat(props.locale, {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }),
)

function dayAriaLabel(day: Date): string {
  const label = dayAriaFormatter.value.format(day)
  return label.charAt(0).toUpperCase() + label.slice(1)
}

/** ¿El día es el tab-stop de la grilla? Si el enfocado no está en el mes
 *  visible, cae al seleccionado y si no al primer día habilitado del mes. */
const tabStopDay = computed<Date | null>(() => {
  const focused = focusDay.value
  if (focused && sameMonth(focused, viewMonth.value)) return focused
  const selected = selectedValue.value
  if (selected && sameMonth(selected, viewMonth.value)) return selected
  const year = viewMonth.value.getFullYear()
  const month = viewMonth.value.getMonth()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  for (let day = 1; day <= daysInMonth; day++) {
    const candidate = new Date(year, month, day)
    if (!isDisabledDay(candidate)) return candidate
  }
  return new Date(year, month, 1)
})

function isTabStop(day: Date): boolean {
  if (props.disabled) return false
  const stop = tabStopDay.value
  return stop !== null && sameDay(day, stop)
}

function isDaySelected(day: Date): boolean {
  if (isRange.value) {
    return (
      (rangeStartVal.value !== null && sameDay(day, rangeStartVal.value)) ||
      (rangeEndVal.value !== null && sameDay(day, rangeEndVal.value))
    )
  }
  return selectedValue.value !== null && sameDay(day, selectedValue.value)
}

/** Mueve el foco del teclado a `day` (cambiando de mes si hace falta). */
async function moveFocus(day: Date) {
  if (isOutOfLimits(day)) return
  focusDay.value = day
  if (!sameMonth(day, viewMonth.value)) {
    setViewMonth(new Date(day.getFullYear(), day.getMonth(), 1))
  }
  await nextTick()
  gridRef.value?.querySelector<HTMLElement>(`[data-date="${toISODate(day)}"]`)?.focus()
}

function onGridKeydown(event: KeyboardEvent) {
  if (props.disabled) return
  const button = (event.target as HTMLElement | null)?.closest?.('.cu-calendar-day')
  const current = button instanceof HTMLElement ? parseDate(button.dataset.date ?? null) : null
  if (current === null) return

  let next: Date | null = null
  switch (event.key) {
    case 'ArrowLeft':
      next = addDays(current, -1)
      break
    case 'ArrowRight':
      next = addDays(current, 1)
      break
    case 'ArrowUp':
      next = addDays(current, -7)
      break
    case 'ArrowDown':
      next = addDays(current, 7)
      break
    case 'Home':
      next = startOfWeek(current, props.weekStart)
      break
    case 'End':
      next = addDays(startOfWeek(current, props.weekStart), 6)
      break
    case 'PageUp':
      next = shiftMonth(current, -1)
      break
    case 'PageDown':
      next = shiftMonth(current, 1)
      break
    default:
      return
  }
  // Las flechas no scrollean la página mientras se navega la grilla.
  event.preventDefault()
  void moveFocus(next)
}

// El rango solo existe en `mode="range"` (ahí `rangeStart`/`rangeEnd` son el
// valor, administrado por la FSM). En `single` se ignoran por completo: la
// única selección es el click simple (`modelValue`).
const rangeStartVal = computed(() => (isRange.value ? rangeValueStart.value : null))
const rangeEndVal = computed(() => (isRange.value ? rangeValueEnd.value : null))

function isInRange(day: Date): boolean {
  if (!isRange.value) return false
  const start = rangeStartVal.value
  const end = rangeEndVal.value
  if (!start || !end) return false
  const s = start.getTime()
  const e = end.getTime()
  const d = day.getTime()
  return d >= Math.min(s, e) && d <= Math.max(s, e)
}

// ── API programática ──

/** Devuelve la fecha seleccionada (modo `single`). */
function getValue(): Date | null {
  return selectedValue.value
}

/** Establece la fecha seleccionada y emite los eventos de cambio (modo `single`). */
function setValue(value: string | number | Date | null) {
  const parsed = parseDate(value)
  if (parsed === null) return
  // Un día deshabilitado (min/max/weekdays/dates) no se puede seleccionar
  // ni por código: la ficha lo dice explícitamente.
  if (isDisabledDay(parsed)) return
  selectedValue.value = parsed
  focusDay.value = parsed
  setViewMonth(new Date(parsed.getFullYear(), parsed.getMonth(), 1))
  emit('update:modelValue', parsed)
  emit('change', parsed)
}

/** Devuelve el rango seleccionado (modo `range`). */
function getRange(): { start: Date | null; end: Date | null } {
  return { start: rangeValueStart.value, end: rangeValueEnd.value }
}

/** Setea el rango y emite los eventos de cambio (modo `range`). */
function setRange(start: string | number | Date | null, end: string | number | Date | null) {
  setRangeValue(start, end)
}

/** Limpia el rango seleccionado (modo `range`). */
function clear() {
  // Solo rango: en `single` no hay rango que limpiar (la fecha se limpia
  // seteando `modelValue`), y emitir un `change` con forma de rango rompería
  // el payload documentado para single.
  if (!isRange.value) return
  clearRange()
}

defineExpose({
  nextMonth,
  prevMonth,
  goToMonth,
  getValue,
  setValue,
  getRange,
  setRange,
  clear,
})

// ── Estilos por color semántico (CSS custom properties) ──

const colorStyles = computed(() => ({
  '--cal-accent': `var(--cu-color-${props.color})`,
  '--cal-solid': `var(--cu-color-${props.color}-solid)`,
  '--cal-solid-hover': `var(--cu-color-${props.color}-solid-hover)`,
  '--cal-solid-text': `var(--cu-color-surface)`,
  '--cal-accent-text': `var(--cu-color-${props.color}-text)`,
  '--cal-accent-border': `var(--cu-color-${props.color}-border)`,
  '--cal-soft': `var(--cu-color-${props.color}-soft)`,
  '--cal-soft-hover': `var(--cu-color-${props.color}-soft-hover)`,
  '--cal-subtle': `var(--cu-color-${props.color}-subtle)`,
  '--cal-subtle-hover': `var(--cu-color-${props.color}-subtle-hover)`,
  '--cal-subtle-border': `var(--cu-color-${props.color}-subtle-border)`,
  '--cal-ghost-hover': `var(--cu-color-${props.color}-ghost-hover)`,
}))
</script>

<template>
  <div
    class="cu-calendar"
    :class="{ 'is-disabled': props.disabled, 'cu-calendar--year-nav': yearNavigation, 'cu-calendar--grid': props.grid, 'cu-calendar--border': props.border }"
    :style="colorStyles"
    role="grid"
    :aria-label="monthLabel"
  >
    <!-- Header: MonthSlider del repo (chevrons + label con drag + navegación de año) -->
    <div class="cu-calendar-header">
      <MonthSlider
        :model-value="viewMonth"
        :min="min"
        :max="max"
        :color="color"
        :variant="variant"
        :locale="locale"
        :year-navigation="yearNavigation"
        :month-format="monthFormat"
        :year-format="yearFormat"
        :disabled="disabled"
        @change="onMonthChange"
      />
    </div>

    <!-- Días de la semana -->
    <div class="cu-calendar-weekdays" role="row">
      <span
        v-for="(label, i) in weekdayLabels"
        :key="i"
        class="cu-calendar-weekday"
        role="columnheader"
        :aria-label="label.long"
      >
        {{ label.short }}
      </span>
    </div>

    <!-- Grilla de días: 7 columnas que se reparten el ancho del contenedor -->
    <div ref="gridRef" class="cu-calendar-grid" @keydown="onGridKeydown">
      <div v-for="(week, wi) in weeks" :key="wi" class="cu-calendar-week" role="row">
        <template v-for="(cell, ci) in week" :key="ci">
          <button
            v-if="cell.date"
            type="button"
            class="cu-calendar-day"
            :class="dayClasses(cell.date)"
            :data-date="toISODate(cell.date)"
            :aria-label="dayAriaLabel(cell.date)"
            :aria-selected="isDaySelected(cell.date) ? 'true' : 'false'"
            :aria-disabled="isDisabledDay(cell.date) ? 'true' : undefined"
            :aria-current="sameDay(cell.date, today) ? 'date' : undefined"
            :tabindex="isTabStop(cell.date) ? 0 : -1"
            role="gridcell"
            @click="selectDay(cell.date)"
          >
            {{ cell.date.getDate() }}
            <span
              v-if="getEventsForDay(cell.date).length"
              class="cu-calendar-dots"
            >
              <span
                v-for="(ev, ei) in getEventsForDay(cell.date)"
                :key="ei"
                class="cu-calendar-dot"
                :style="ev.color ? { '--dot-color': String(ev.color).startsWith('var(') ? ev.color : `var(--cu-color-${ev.color})` } : undefined"
              ></span>
            </span>
          </button>
          <span v-else class="cu-calendar-day--empty" role="gridcell" aria-disabled="true"></span>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cu-calendar {
  display: inline-flex;
  flex-direction: column;
  gap: var(--cu-space-sm);
  width: 100%;
  min-width: 240px;
  font-family: var(--cu-font-sans);
  box-sizing: border-box;
}

/* Con navegación de año (4 botones del MonthSlider + label min 150px) el header
   necesita más ancho que la grilla: forzamos min-width para evitar overflow. */
.cu-calendar--year-nav {
  min-width: 330px;
}

.cu-calendar.is-disabled {
  opacity: var(--cu-alpha-disabled, 0.7);
}

.cu-calendar-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--cu-space-2xs);
}

/* 7 columnas: cada una ocupa 1/7 del ancho que mida el contenedor */
.cu-calendar-weekdays,
.cu-calendar-week {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: var(--cu-space-2xs);
}

.cu-calendar-weekday {
  text-align: center;
  font-size: var(--cu-font-size-xs);
  font-weight: var(--cu-font-weight-medium);
  padding: var(--cu-space-2xs) 0;
}

.cu-calendar-day {
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: var(--cu-radius-sm);
  background: transparent;
  color: inherit;
  font-family: inherit;
  font-size: var(--cu-font-size-sm);
  cursor: pointer;
  transition: background-color 150ms ease, color 150ms ease;
  box-sizing: border-box;
}

/* Foco de teclado de la grilla (roving tabindex). Usa el accent de texto
   (`-text`), que está garantizado contra la superficie en todos los temas. */
.cu-calendar-day:focus-visible {
  outline: var(--cu-border-thin) solid var(--cal-accent-text);
  outline-offset: calc(var(--cu-space-2xs) * -1);
  position: relative;
  z-index: 1;
}

/* Doble clase (convención del repo): ganarle en cascada a reglas globales
   del consumidor (reset CSS, `.playground button`, etc.) */
.cu-calendar-day.cu-calendar-day:hover:not(.cu-calendar-day--disabled) {
  background: var(--cal-ghost-hover);
}

/* Día no seleccionable: `aria-disabled` (sigue siendo enfocable con el
   teclado, como pide el patrón de grid) + el guard en `selectDay`. */
.cu-calendar-day.cu-calendar-day--disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

/* Hoy: transparente + número en color accent (look ghost). Sin fondo para no
   confundirse con el día seleccionado — se distingue solo por el color. */
.cu-calendar-day.cu-calendar-day--today {
  background: transparent;
  color: var(--cal-accent-text);
  font-weight: var(--cu-font-weight-semibold);
}

/* Variantes del día seleccionado */
.cu-calendar-day--selected.cu-calendar-day--solid {
  background: var(--cal-solid);
  /* Solid mantiene el texto del tema sobre la variante de fondo ajustada. */
  color: var(--cal-solid-text);
}
.cu-calendar-day--selected.cu-calendar-day--solid:hover:not(.cu-calendar-day--disabled) {
  background: var(--cal-solid-hover);
}
.cu-calendar-day--selected.cu-calendar-day--outlined {
  outline: 1.5px solid var(--cal-accent-border);
  color: var(--cal-accent-text);
}
.cu-calendar-day--selected.cu-calendar-day--soft {
  background: var(--cal-soft);
  color: var(--cal-accent-text);
}
.cu-calendar-day--selected.cu-calendar-day--soft:hover:not(.cu-calendar-day--disabled) {
  background: var(--cal-soft-hover);
}
.cu-calendar-day--selected.cu-calendar-day--subtle {
  background: var(--cal-subtle);
  color: var(--cal-accent-text);
  box-shadow: inset 0 0 0 var(--cu-border-thin) var(--cal-subtle-border);
}

.cu-calendar-day--empty {
  aspect-ratio: 1;
}

/* ── Grid interno: líneas separadoras entre días ── */
.cu-calendar--grid .cu-calendar-weekdays,
.cu-calendar--grid .cu-calendar-week {
  gap: 0;
}

.cu-calendar--grid .cu-calendar-day,
.cu-calendar--grid .cu-calendar-day--empty {
  border-right: var(--cu-border-thin) solid var(--cu-border-color);
  border-bottom: var(--cu-border-thin) solid var(--cu-border-color);
  border-radius: 0;
}

.cu-calendar--grid .cu-calendar-week:last-child .cu-calendar-day,
.cu-calendar--grid .cu-calendar-week:last-child .cu-calendar-day--empty {
  border-bottom: none;
}

.cu-calendar--grid .cu-calendar-day:nth-child(7n),
.cu-calendar--grid .cu-calendar-day--empty:nth-child(7n) {
  border-right: none;
}

/* ── Borde exterior: marco alrededor de la cuadrícula de días ── */
.cu-calendar--border .cu-calendar-grid {
  border: var(--cu-border-thin) solid var(--cu-border-color);
  border-radius: var(--cu-radius-sm);
  overflow: hidden;
}

/* ── Rango ── */
.cu-calendar-day.cu-calendar-day--range {
  background: var(--cal-soft);
  border-radius: 0;
}
.cu-calendar-day.cu-calendar-day--range-start {
  background: var(--cal-solid);
  color: var(--cal-solid-text);
  border-radius: var(--cu-radius-sm) 0 0 var(--cu-radius-sm);
}
.cu-calendar-day.cu-calendar-day--range-end {
  background: var(--cal-solid);
  color: var(--cal-solid-text);
  border-radius: 0 var(--cu-radius-sm) var(--cu-radius-sm) 0;
}
.cu-calendar-day--range-start.cu-calendar-day--range-end {
  border-radius: var(--cu-radius-sm);
}

/* ── Puntos de eventos ── */
.cu-calendar-day {
  position: relative;
}

.cu-calendar-dots {
  position: absolute;
  bottom: var(--cu-space-2xs);
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: var(--cu-space-2xs);
  align-items: center;
  justify-content: center;
  pointer-events: none;
}

.cu-calendar-dot {
  width: var(--cu-space-xs);
  height: var(--cu-space-xs);
  border-radius: 50%;
  background: var(--dot-color, var(--cal-accent));
  display: block;
}
</style>
