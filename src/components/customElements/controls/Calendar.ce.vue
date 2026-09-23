<script setup lang="ts">
import { ref, getCurrentInstance, type PropType } from 'vue'
import Calendar from '../../controls/Calendar.vue'
import { initTokens } from '@/plugins/cu-tokens/css'

initTokens()

const props = defineProps({
  // API espejo de MonthSlider/YearSlider: acepta Date, timestamp o fecha "YYYY-MM-DD"
  /** Fecha seleccionada. Acepta `Date`, timestamp o `"YYYY-MM-DD"` (ver [Formato de fechas](#formato-de-fechas)) */
  modelValue: {
    type: [String, Number, Date] as PropType<string | number | Date | null>,
    default: null,
  },
  /** Fecha mínima seleccionable (días anteriores quedan deshabilitados) */
  min: {
    type: [String, Number, Date] as PropType<string | number | Date | null>,
    default: null,
  },
  /** Fecha máxima seleccionable */
  max: {
    type: [String, Number, Date] as PropType<string | number | Date | null>,
    default: null,
  },
  /** Color semántico: `primary`, `secondary`, `neutral`, `success`, `warning`, `danger` */
  color: {
    type: String as PropType<'primary' | 'secondary' | 'neutral' | 'success' | 'warning' | 'danger'>,
    default: 'primary',
  },
  /** Variante del día seleccionado: `solid`, `outlined`, `soft`, `subtle` (sin `ghost`: se confunde con el día de hoy) */
  variant: {
    type: String as PropType<'solid' | 'outlined' | 'soft' | 'subtle'>,
    default: 'soft',
  },
  /** Deshabilita todo el calendario */
  disabled: {
    type: Boolean,
    default: false,
  },
  /** Días de la semana no seleccionables (`0`=domingo … `6`=sábado). En HTML plano: `disabled-weekdays="0,6"` */
  disabledWeekdays: {
    type: [Array, String] as PropType<number[] | string>,
    default: '',
  },
  /** Fechas puntuales no seleccionables `"YYYY-MM-DD"`. En HTML plano: `disabled-dates="2026-08-15,2026-08-16"` */
  disabledDates: {
    type: [Array, String] as PropType<(string | Date)[] | string>,
    default: '',
  },
  /** Locale para nombres de mes y días de la semana */
  locale: {
    type: String,
    default: 'es',
  },
  /** Día en que arranca la semana: `0` = domingo, `1` = lunes */
  weekStart: {
    type: Number,
    default: 1,
  },
  /** Muestra botones `«`/`»` para saltar de año en el header */
  yearNavigation: {
    type: [Boolean, String] as PropType<boolean | string>,
    default: false,
  },
  /** Formato del mes en el header (tokens como MonthSlider) */
  monthFormat: {
    type: String,
    default: 'MMMM',
  },
  /** Formato del año en el header */
  yearFormat: {
    type: String,
    default: 'yyyy',
  },
  /** Eventos a señalar con puntos bajo la fecha (ver [Eventos](#eventos-puntos)). Se asigna como propiedad JS */
  events: {
    type: Array as PropType<CalendarEvent[]>,
    default: () => [],
  },
  /** Inicio del rango (resalta los días entre inicio y fin). Se asigna como propiedad JS */
  rangeStart: {
    type: [String, Number, Date] as PropType<string | number | Date | null>,
    default: null,
  },
  /** Fin del rango. Se asigna como propiedad JS */
  rangeEnd: {
    type: [String, Number, Date] as PropType<string | number | Date | null>,
    default: null,
  },
  /** Dibuja líneas **interiores** (cuadrícula) entre los días. En HTML plano: `<cu-calendar grid>` */
  grid: {
    type: Boolean,
    default: false,
  },
  /** Dibuja el **marco exterior** alrededor de la cuadrícula de días. Combinable con `grid` */
  border: {
    type: Boolean,
    default: false,
  },
})

interface CalendarEvent {
  date: string | number | Date
  color?: string
}

const calendarRef = ref<InstanceType<typeof Calendar> | null>(null)

const instance = getCurrentInstance()
function ceEmit(event: string, payload: unknown) {
  const el = instance?.vnode.el as HTMLElement | null
  const host = (el?.getRootNode() as ShadowRoot | null | undefined)?.host || el
  if (host) {
    host.dispatchEvent(new CustomEvent(event, {
      detail: payload,
      bubbles: true,
      composed: true,
    }))
  }
}

function nextMonth() { calendarRef.value?.nextMonth() }
function prevMonth() { calendarRef.value?.prevMonth() }
function goToMonth(value: string | number | Date) { calendarRef.value?.goToMonth(value) }
function getValue(): Date | null { return calendarRef.value?.getValue() ?? null }
function setValue(value: string | number | Date | null) { calendarRef.value?.setValue(value) }

defineExpose({ nextMonth, prevMonth, goToMonth, getValue, setValue })
</script>

<template>
  <Calendar
    ref="calendarRef"
    :model-value="props.modelValue"
    :min="props.min"
    :max="props.max"
    :color="props.color"
    :variant="props.variant"
    :disabled="props.disabled"
    :locale="props.locale"
    :week-start="props.weekStart"
    :year-navigation="props.yearNavigation"
    :month-format="props.monthFormat"
    :year-format="props.yearFormat"
    :disabled-weekdays="props.disabledWeekdays"
    :disabled-dates="props.disabledDates"
    :events="props.events"
    :range-start="props.rangeStart"
    :range-end="props.rangeEnd"
    :grid="props.grid"
    :border="props.border"
    @select="ceEmit('select', $event)"
    @change="ceEmit('change', $event)"
    @update:modelValue="ceEmit('update:modelValue', $event)"
  />
</template>

<style>
:host {
  display: inline-block;
}
</style>
