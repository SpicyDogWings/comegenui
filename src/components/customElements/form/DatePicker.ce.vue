<script setup lang="ts">
import { ref, watch, getCurrentInstance, type PropType } from 'vue'
import DatePicker from '../../form/DatePicker.vue'
import { initTokens } from '@/plugins/cu-tokens/css'
import { isMonthFormat, isYearFormat } from '@/utils/date'

initTokens()

const props = defineProps({
  /** Tipo de calendario: `single` (una fecha) o `range` (inicio + fin). Con `dual-calendar` el tipo es dual (range, 2 meses) */
  mode: {
    type: String as PropType<'single' | 'range'>,
    default: 'single',
  },
  /** Fecha seleccionada (calendario `single`) */
  modelValue: {
    type: [String, Number, Date] as PropType<string | number | Date | null>,
    default: null,
  },
  /** Inicio del rango. Solo con calendario de rango (`mode="range"` o `dual-calendar`); en `single` se ignora. En HTML: `start-date="2026-08-01"` */
  startDate: {
    type: [String, Number, Date] as PropType<string | number | Date | null>,
    default: null,
  },
  /** Fin del rango. Solo con calendario de rango (`mode="range"` o `dual-calendar`); en `single` se ignora. En HTML: `end-date="2026-08-31"` */
  endDate: {
    type: [String, Number, Date] as PropType<string | number | Date | null>,
    default: null,
  },
  /** Fecha mínima seleccionable */
  min: {
    type: [String, Number, Date] as PropType<string | number | Date | null>,
    default: null,
  },
  /** Fecha máxima seleccionable */
  max: {
    type: [String, Number, Date] as PropType<string | number | Date | null>,
    default: null,
  },
  /** Color semántico del trigger y del día seleccionado del calendario interno (se pasa tal cual; `neutral` = neutral, ya no mapea a primary) */
  color: {
    type: String as PropType<'primary' | 'secondary' | 'neutral' | 'success' | 'warning' | 'danger'>,
    default: 'neutral',
  },
  /** Variante del trigger: `outlined`, `soft`, `ghost`, `subtle`. En el calendario interno `ghost` se mapea a `soft` (el calendario ya no tiene ghost) */
  variant: {
    type: String as PropType<'outlined' | 'soft' | 'ghost' | 'subtle'>,
    default: 'soft',
  },
  /** Deshabilita el picker completo */
  disabled: { type: Boolean, default: false },
  /** Texto cuando no hay fecha (default: `"Seleccionar fecha..."`, rango: `"Seleccionar rango..."`) */
  placeholder: { type: String, default: '' },
  /** Locale del calendario y nombres de mes */
  locale: { type: String, default: 'es' },
  /** Primer día de la semana (`0` domingo, `1` lunes) */
  weekStart: { type: Number, default: 1 },
  /** Formato de la fecha en el trigger (ver [Formato](#formato)) */
  format: { type: String, default: 'dd/MM/yyyy' },
  /** Controles de mes del calendario interno: botones `«`/`»` de año */
  yearNavigation: { type: [Boolean, String] as PropType<boolean | string>, default: false },
  /** Formato del mes en el header del calendario interno: `MMMM` (septiembre), `MMM` (sept), `MM` (09) o `M` (9). Un valor no soportado cae a `MMMM` */
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
  /** Días de la semana no seleccionables (`0`=domingo … `6`=sábado). En HTML: `disabled-weekdays="0,6"` */
  disabledWeekdays: { type: [Array, String] as PropType<number[] | string>, default: '' },
  /** Fechas puntuales no seleccionables. En HTML: `disabled-dates="2026-08-15,2026-08-16"` */
  disabledDates: { type: [Array, String] as PropType<(string | Date)[] | string>, default: '' },
  /** Eventos a señalar con puntos bajo la fecha en el calendario interno (ver [Eventos](cu-calendar.md#eventos-puntos)). Se asigna como propiedad JS */
  events: {
    type: Array as PropType<CalendarEvent[]>,
    default: () => [],
  },
  /** Líneas **interiores** (cuadrícula) entre los días del calendario interno */
  grid: { type: Boolean, default: false },
  /** **Marco exterior** alrededor de la cuadrícula de días del calendario interno */
  border: { type: Boolean, default: false },
  /** Activa el rango a dos meses (dual). **Implica `range`**: aunque `mode` sea `single`, el picker selecciona un rango */
  dualCalendar: { type: Boolean, default: false },
  /** `right` */
  position: { type: String, default: 'bottom' },
  /** `end` */
  align: { type: String, default: 'start' },
  /** Panel en `position: fixed` (útil en contenedores con overflow) */
  fixed: { type: Boolean, default: false },
  /** Muestra el botón "Limpiar" en el footer del panel */
  clearable: { type: Boolean, default: true },
  /** Muestra el botón "Hoy" en el footer del panel (default: `true` en `single`, `false` en `range`) */
  todayButton: { type: Boolean, default: undefined },
  /** Texto del label sobre el picker */
  label: { type: String, default: '' },
})

interface CalendarEvent {
  date: string | number | Date
  color?: string
}

const pickerRef = ref<InstanceType<typeof DatePicker> | null>(null)
const innerValue = ref(props.modelValue)

watch(() => props.modelValue, (val) => {
  innerValue.value = val
})

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

/** Abre, cierra o alterna el panel */
function open() { pickerRef.value?.open() }
function close() { pickerRef.value?.close() }
function toggle() { pickerRef.value?.toggle() }
/** Devuelve la fecha seleccionada (modo `single`) */
function getValue(): Date | null { return pickerRef.value?.getValue() ?? null }
/** Selecciona una fecha (string/number/Date) (modo `single`) */
function setValue(value: string | number | Date | null) { pickerRef.value?.setValue(value) }
/** Devuelve la fecha de inicio (modo `range`) */
function getStartDate(): Date | null { return pickerRef.value?.getStartDate() ?? null }
/** Devuelve la fecha de fin (modo `range`) */
function getEndDate(): Date | null { return pickerRef.value?.getEndDate() ?? null }
/** Setea el rango (string/number/Date) (modo `range`) */
function setRange(start: string | number | Date | null, end: string | number | Date | null) {
  pickerRef.value?.setRange(start, end)
}
/** Limpia la selección (emite `null`) */
function clear() { pickerRef.value?.clear() }

defineExpose({
  open,
  close,
  toggle,
  getValue,
  setValue,
  getStartDate,
  getEndDate,
  setRange,
  clear,
  isOpen: () => pickerRef.value?.isOpen() ?? false,
})
</script>

<template>
  <DatePicker
    ref="pickerRef"
    :mode="props.mode"
    :model-value="innerValue"
    :start-date="props.startDate"
    :end-date="props.endDate"
    :min="props.min"
    :max="props.max"
    :color="props.color"
    :variant="props.variant"
    :disabled="props.disabled"
    :placeholder="props.placeholder"
    :locale="props.locale"
    :week-start="props.weekStart"
    :format="props.format"
    :year-navigation="props.yearNavigation"
    :month-format="props.monthFormat"
    :year-format="props.yearFormat"
    :disabled-weekdays="props.disabledWeekdays"
    :disabled-dates="props.disabledDates"
    :events="props.events"
    :grid="props.grid"
    :border="props.border"
    :dual-calendar="props.dualCalendar"
    :position="props.position"
    :align="props.align"
    :fixed="props.fixed"
    :clearable="props.clearable"
    :today-button="props.todayButton"
    :label="props.label"
    @select="ceEmit('select', $event)"
    @change="ceEmit('change', $event)"
    @open="ceEmit('open', $event)"
    @close="ceEmit('close', $event)"
    @update:modelValue="ceEmit('update:modelValue', $event)"
    @update:startDate="ceEmit('update:startDate', $event)"
    @update:endDate="ceEmit('update:endDate', $event)"
  />
</template>

<style>
:host {
  display: block;
  width: 100%;
}
</style>