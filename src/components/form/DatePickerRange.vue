<script setup lang="ts">
import { computed, ref, watch, type PropType } from 'vue'
import Dropdown from '../overlay/Dropdown.vue'
import Button from '../buttons/Button.vue'
import Calendar from '../controls/Calendar.vue'
import Label from './Label.vue'

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
    type: String as PropType<'outlined' | 'soft' | 'ghost' | 'subtle'>,
    default: 'soft',
  },
  disabled: { type: Boolean, default: false },
  placeholder: { type: String, default: '' },
  locale: { type: String, default: 'es' },
  weekStart: { type: Number, default: 1 },
  format: { type: String, default: 'dd/MM/yyyy' },
  yearNavigation: { type: [Boolean, String] as PropType<boolean | string>, default: false },
  monthFormat: { type: String, default: 'MMMM' },
  yearFormat: { type: String, default: 'yyyy' },
  disabledWeekdays: { type: [Array, String] as PropType<number[] | string>, default: '' },
  disabledDates: { type: [Array, String] as PropType<(string | Date)[] | string>, default: '' },
  events: {
    type: Array as PropType<CalendarEvent[]>,
    default: () => [],
  },
  dualCalendar: { type: Boolean, default: false },
  position: { type: String, default: 'bottom' },
  align: { type: String, default: 'start' },
  fixed: { type: Boolean, default: false },
  clearable: { type: Boolean, default: true },
  todayButton: { type: Boolean, default: false },
  label: { type: String, default: '' },
})

interface CalendarEvent {
  date: string | number | Date
  color?: string
}

const emit = defineEmits<{
  (e: 'update:startDate', value: Date | null): void
  (e: 'update:endDate', value: Date | null): void
  (e: 'change', value: { start: Date | null; end: Date | null }): void
  (e: 'select', value: { start: Date | null; end: Date | null }): void
  (e: 'open'): void
  (e: 'close'): void
}>()

const dropdownRef = ref<InstanceType<typeof Dropdown> | null>(null)

// ── Utilidades de fecha ──

function normalize(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

function parseDateInput(value: string | number | Date | null | undefined): Date | null {
  if (value === null || value === undefined || value === '') return null
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : normalize(value)
  }
  if (typeof value === 'number') {
    if (!Number.isFinite(value)) return null
    const d = new Date(value)
    return Number.isNaN(d.getTime()) ? null : normalize(d)
  }
  const m = value.trim().match(/^(\d{4})-(\d{2})(?:-(\d{2}))?$/)
  const parsed = m
    ? new Date(Number(m[1] ?? 0), Number(m[2] ?? 1) - 1, m[3] ? Number(m[3]) : 1)
    : new Date(value)
  if (Number.isNaN(parsed.getTime())) return null
  return normalize(parsed)
}

function formatDate(date: Date, format: string, locale: string): string {
  const pad = (n: number) => String(n).padStart(2, '0')
  const monthName = (long: boolean) => {
    const label = new Intl.DateTimeFormat(locale, { month: long ? 'long' : 'short' }).format(date)
    return label.charAt(0).toUpperCase() + label.slice(1)
  }
  const tokens: Record<string, () => string> = {
    yyyy: () => String(date.getFullYear()),
    yy: () => String(date.getFullYear()).slice(-2),
    MMMM: () => monthName(true),
    MMM: () => monthName(false),
    MM: () => pad(date.getMonth() + 1),
    dd: () => pad(date.getDate()),
  }
  return format.replace(/yyyy|MMMM|MMM|yy|MM|dd/g, (token) => tokens[token]?.() ?? token)
}

// ── Estado interno ──

const startValue = ref<Date | null>(parseDateInput(props.startDate))
const endValue = ref<Date | null>(parseDateInput(props.endDate))
const pickingEnd = ref(false) // true cuando ya se eligió inicio y se espera fin

watch(() => props.startDate, (val) => {
  startValue.value = parseDateInput(val)
})
watch(() => props.endDate, (val) => {
  endValue.value = parseDateInput(val)
})

// ── Label del trigger ──

const selectedLabel = computed(() => {
  const fmt = (d: Date) => formatDate(d, props.format, props.locale)
  if (startValue.value && endValue.value) {
    return `${fmt(startValue.value)} - ${fmt(endValue.value)}`
  }
  if (startValue.value) {
    return `${fmt(startValue.value)} - ...`
  }
  return props.placeholder || 'Seleccionar rango...'
})

// ── Navegación de meses ──

const viewMonth = ref(new Date())
if (startValue.value) {
  viewMonth.value = new Date(startValue.value.getFullYear(), startValue.value.getMonth(), 1)
}

const secondMonth = computed(() => {
  return new Date(viewMonth.value.getFullYear(), viewMonth.value.getMonth() + 1, 1)
})

function nextMonth() {
  viewMonth.value = new Date(viewMonth.value.getFullYear(), viewMonth.value.getMonth() + 1, 1)
}

function prevMonth() {
  viewMonth.value = new Date(viewMonth.value.getFullYear(), viewMonth.value.getMonth() - 1, 1)
}

// ── Interacción ──

function onSelect(day: Date) {
  if (!pickingEnd.value || !startValue.value) {
    // Primer click: selecciona inicio
    startValue.value = day
    endValue.value = null
    pickingEnd.value = true
    emit('update:startDate', day)
  } else {
    // Segundo click: selecciona fin
    if (day.getTime() < startValue.value.getTime()) {
      // Si es anterior, swap
      endValue.value = startValue.value
      startValue.value = day
      emit('update:startDate', day)
      emit('update:endDate', endValue.value)
    } else {
      endValue.value = day
      emit('update:endDate', day)
    }
    pickingEnd.value = false
    emit('select', { start: startValue.value, end: endValue.value })
    emit('change', { start: startValue.value, end: endValue.value })
    dropdownRef.value?.close()
  }
}

function clear() {
  startValue.value = null
  endValue.value = null
  pickingEnd.value = false
  emit('update:startDate', null)
  emit('update:endDate', null)
  emit('change', { start: null, end: null })
}

// ── API programática ──

function getStartDate(): Date | null { return startValue.value }
function getEndDate(): Date | null { return endValue.value }
function setRange(start: string | number | Date | null, end: string | number | Date | null) {
  startValue.value = parseDateInput(start)
  endValue.value = parseDateInput(end)
  pickingEnd.value = false
  emit('update:startDate', startValue.value)
  emit('update:endDate', endValue.value)
  emit('change', { start: startValue.value, end: endValue.value })
}
function open() { dropdownRef.value?.open() }
function close() { dropdownRef.value?.close() }
function toggle() { dropdownRef.value?.toggle() }

defineExpose({ open, close, toggle, getStartDate, getEndDate, setRange, clear, isOpen: () => dropdownRef.value?.isOpen || false })

const panelWidth = computed(() => {
  if (props.dualCalendar) return '580px'
  return props.yearNavigation ? '330px' : '280px'
})
</script>

<template>
  <div class="cu-date-picker-range">
    <Label v-if="label" :label="label" @click="open" />
    <Dropdown
      ref="dropdownRef"
      :color="color"
      :disabled="disabled"
      :position="position"
      :align="align"
      :fixed="fixed"
      :offset="4"
      :panel-width="panelWidth"
      @open="emit('open')"
      @close="emit('close')"
    >
      <!-- Trigger -->
      <template #toggle="{ toggle }">
        <Button
          :color="color"
          :variant="variant"
          :disabled="disabled"
          class="cu-date-picker-range-toggle"
          @click="toggle"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M8 2v4" /><path d="M16 2v4" />
            <rect width="18" height="18" x="3" y="4" rx="2" /><path d="M3 10h18" />
          </svg>
          <span class="cu-date-picker-range-label">{{ selectedLabel }}</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="cu-date-picker-chevron">
            <path d="m6 9 6 6 6-6" />
          </svg>
        </Button>
      </template>

      <!-- Panel -->
      <template #default>
        <div class="cu-date-picker-range-panel">
          <div class="cu-date-picker-range-calendars" :class="{ 'cu-date-picker-range-calendars--dual': dualCalendar }">
            <Calendar
              :model-value="startValue"
              :range-start="startValue"
              :range-end="endValue"
              :min="min"
              :max="max"
              :color="color"
              :variant="variant === 'ghost' ? 'soft' : variant"
              :locale="locale"
              :week-start="weekStart"
              :year-navigation="yearNavigation"
              :month-format="monthFormat"
              :year-format="yearFormat"
              :disabled="disabled"
              :disabled-weekdays="disabledWeekdays"
              :disabled-dates="disabledDates"
              :events="events"
              @select="onSelect"
            />
            <Calendar
              v-if="dualCalendar"
              :model-value="endValue"
              :range-start="startValue"
              :range-end="endValue"
              :min="min"
              :max="max"
              :color="color"
              :variant="variant === 'ghost' ? 'soft' : variant"
              :locale="locale"
              :week-start="weekStart"
              :year-navigation="yearNavigation"
              :month-format="monthFormat"
              :year-format="yearFormat"
              :disabled="disabled"
              :disabled-weekdays="disabledWeekdays"
              :disabled-dates="disabledDates"
              :events="events"
              @select="onSelect"
            />
          </div>
          <div v-if="clearable" class="cu-date-picker-range-footer">
            <Button variant="ghost" :color="color" @click="clear()">Limpiar</Button>
          </div>
        </div>
      </template>
    </Dropdown>
  </div>
</template>

<style scoped>
.cu-date-picker-range {
  width: 100%;
  outline: none;
  display: flex;
  flex-direction: column;
  gap: var(--cu-space-sm);
}

.cu-date-picker-range :deep(.cu-dropdown) {
  width: 100%;
}

.cu-date-picker-range-toggle {
  width: 100%;
  justify-content: space-between;
  gap: var(--cu-space-md);
  box-sizing: border-box;
}

.cu-date-picker-range-label {
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  min-width: 0;
  text-align: left;
}

.cu-date-picker-chevron {
  transition: transform 200ms ease;
  flex-shrink: 0;
}

.cu-date-picker-range-panel {
  display: flex;
  flex-direction: column;
  gap: var(--cu-space-sm);
}

.cu-date-picker-range-calendars {
  display: flex;
  flex-direction: column;
  gap: var(--cu-space-md);
}

.cu-date-picker-range-calendars--dual {
  flex-direction: row;
}

.cu-date-picker-range-calendars--dual :deep(.cu-calendar) {
  flex: 1;
}

.cu-date-picker-range-footer {
  display: flex;
  justify-content: flex-end;
  gap: var(--cu-space-sm);
  border-top: var(--cu-border-thin) solid var(--cu-border-color);
  padding-top: var(--cu-space-sm);
}
</style>
