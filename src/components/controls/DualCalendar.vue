<script setup lang="ts">
// DualCalendar (interno) — composición de 1 o 2 `Calendar` con meses
// consecutivos al abrir y navegación independiente por calendario. No se
// registra como Custom Element: lo consume `DatePicker` en modo rango.
import { computed, ref, type PropType } from 'vue'
import Calendar from './Calendar.vue'
import { addMonths, parseDate, type CalendarEvent } from '@/utils/date'

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
  weekStart: { type: Number, default: 1 },
  yearNavigation: { type: [Boolean, String] as PropType<boolean | string>, default: false },
  monthFormat: { type: String, default: 'MMMM' },
  yearFormat: { type: String, default: 'yyyy' },
  disabledWeekdays: { type: [Array, String] as PropType<number[] | string>, default: '' },
  disabledDates: { type: [Array, String] as PropType<(string | Date)[] | string>, default: '' },
  events: {
    type: Array as PropType<CalendarEvent[]>,
    default: () => [],
  },
  grid: { type: Boolean, default: false },
  border: { type: Boolean, default: false },
  /** Cantidad de meses visibles (1 = rango simple, 2 = dual). */
  months: { type: Number, default: 2, validator: (v: number) => v === 1 || v === 2 },
})

const emit = defineEmits<{
  (e: 'select', value: Date): void
}>()

// Primer mes: el del `startDate` si existe, si no el mes actual.
function initialMonth(): Date {
  const start = parseDate(props.startDate)
  const base = start ?? new Date()
  return new Date(base.getFullYear(), base.getMonth(), 1)
}

const firstMonth = ref<Date>(initialMonth())
const secondMonth = ref<Date>(addMonths(firstMonth.value, 1))

const showSecond = computed(() => props.months === 2)

const rangeStart = computed(() => parseDate(props.startDate))
const rangeEnd = computed(() => parseDate(props.endDate))
</script>

<template>
  <div
    class="cu-dual-calendar"
    :class="{ 'cu-dual-calendar--dual': showSecond }"
  >
    <Calendar
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
      @select="emit('select', $event)"
    />
    <Calendar
      v-if="showSecond"
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
      @select="emit('select', $event)"
    />
  </div>
</template>

<style scoped>
.cu-dual-calendar {
  display: flex;
  flex-direction: column;
  gap: var(--cu-space-md);
}

.cu-dual-calendar--dual {
  flex-direction: row;
}

.cu-dual-calendar--dual :deep(.cu-calendar) {
  flex: 1;
  min-width: 0;
}
</style>
