<script setup lang="ts">
import { ref, watch, getCurrentInstance, type PropType } from 'vue'
import DatePicker from '../../form/DatePicker.vue'
import { initTokens } from '@/plugins/cu-tokens/css'

initTokens()

const props = defineProps({
  /** Fecha seleccionada */
  modelValue: {
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
  /** Texto cuando no hay fecha (default: `"Seleccionar fecha..."`) */
  placeholder: { type: String, default: '' },
  /** Locale del calendario y nombres de mes */
  locale: { type: String, default: 'es' },
  /** Primer día de la semana (`0` domingo, `1` lunes) */
  weekStart: { type: Number, default: 1 },
  /** Formato de la fecha en el trigger (ver [Formato](#formato)) */
  format: { type: String, default: 'dd/MM/yyyy' },
  /** Controles de mes del calendario interno: botones `«`/`»` de año */
  yearNavigation: { type: [Boolean, String] as PropType<boolean | string>, default: false },
  /** Formato del mes en el header del calendario interno */
  monthFormat: { type: String, default: 'MMMM' },
  /** Formato del año en el header del calendario interno */
  yearFormat: { type: String, default: 'yyyy' },
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
  /** `right` */
  position: { type: String, default: 'bottom' },
  /** `end` */
  align: { type: String, default: 'start' },
  /** Panel en `position: fixed` (útil en contenedores con overflow) */
  fixed: { type: Boolean, default: false },
  /** Muestra el botón "Limpiar" en el footer del panel */
  clearable: { type: Boolean, default: true },
  /** Muestra el botón "Hoy" en el footer del panel */
  todayButton: { type: Boolean, default: true },
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
/** null` con la fecha seleccionada */
function getValue(): Date | null { return pickerRef.value?.getValue() ?? null }
/** Selecciona una fecha (string/number/Date) */
function setValue(value: string | number | Date | null) { pickerRef.value?.setValue(value) }
/** Limpia la selección (emite `null`) */
function clear() { pickerRef.value?.clear() }

defineExpose({ open, close, toggle, getValue, setValue, clear, isOpen: () => pickerRef.value?.isOpen() || false })
</script>

<template>
  <DatePicker
    ref="pickerRef"
    :model-value="innerValue"
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
  />
</template>

<style>
:host {
  display: block;
  width: 100%;
}
</style>
