<script setup lang="ts">
import { computed, ref, watch, type PropType } from 'vue'
import Dropdown from '../Dropdown.vue'
import Button from '../buttons/Button.vue'
import Calendar from '../controls/Calendar.vue'

const props = defineProps({
  // API espejo de MonthSlider/YearSlider: acepta Date, timestamp o fecha "YYYY-MM-DD"
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
  position: { type: String, required: false, default: '' },
  align: { type: String, required: false, default: '' },
  placement: { type: String, required: false, default: '' },
  fixed: { type: Boolean, required: false, default: false },
  clearable: { type: Boolean, required: false, default: true },
  todayButton: { type: Boolean, required: false, default: true },
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: Date | null): void
  (e: 'change', value: Date | null): void
  (e: 'select', value: Date): void
  (e: 'open'): void
  (e: 'close'): void
}>()

const dropdownRef = ref<InstanceType<typeof Dropdown> | null>(null)

// ── Utilidades de fecha (mismas reglas que Calendar/sliders) ──

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

// ── Estado y label ──

// Estado interno (como Select): se actualiza al seleccionar y se sincroniza
// con la prop modelValue desde afuera. Sin esto, en el CE el valor emitido
// no volvía como prop y el trigger/calendario no reflejaban la selección.
const selectedValue = ref<Date | null>(parseDateInput(props.modelValue))

watch(
  () => props.modelValue,
  (value) => {
    selectedValue.value = parseDateInput(value)
  },
)

const selectedLabel = computed(() => {
  if (selectedValue.value === null) return props.placeholder || 'Seleccionar fecha...'
  return formatDate(selectedValue.value, props.format, props.locale)
})

// Panel: más ancho cuando el calendario interno tiene navegación de año
// (header del MonthSlider con 4 botones necesita ~300-310px).
const panelWidth = computed(() => (props.yearNavigation ? '330px' : '280px'))

// ── Interacción ──

function onSelect(day: Date) {
  selectedValue.value = day
  emit('update:modelValue', day)
  emit('change', day)
  emit('select', day)
  dropdownRef.value?.close()
}

function goToday() {
  const now = normalize(new Date())
  selectedValue.value = now
  emit('update:modelValue', now)
  emit('change', now)
  emit('select', now)
  dropdownRef.value?.close()
}

function clear() {
  selectedValue.value = null
  emit('update:modelValue', null)
  emit('change', null)
  dropdownRef.value?.close()
}

// ── API programática ──

function getValue(): Date | null {
  return selectedValue.value
}

function setValue(value: string | number | Date | null) {
  const parsed = parseDateInput(value)
  if (parsed === null) return
  selectedValue.value = parsed
  emit('update:modelValue', parsed)
  emit('change', parsed)
}

function open() { dropdownRef.value?.open() }
function close() { dropdownRef.value?.close() }
function toggle() { dropdownRef.value?.toggle() }

defineExpose({ open, close, toggle, getValue, setValue, clear, isOpen: () => dropdownRef.value?.isOpen || false })
</script>

<template>
  <div class="cu-date-picker">
    <Dropdown
      ref="dropdownRef"
      :color="color"
      :disabled="disabled"
      :position="position"
      :align="align"
      :placement="placement"
      :fixed="fixed"
      :offset="4"
      :panel-width="panelWidth"
      @open="emit('open')"
      @close="emit('close')"
    >
      <!-- Trigger: un botón tipo Select con ícono de calendario -->
      <template #toggle="{ toggle, isOpen }">
        <Button
          :color="color"
          :variant="variant"
          :disabled="disabled"
          class="cu-date-picker-toggle"
          @click="toggle"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="cu-date-picker-icon"
          >
            <path d="M8 2v4" />
            <path d="M16 2v4" />
            <rect width="18" height="18" x="3" y="4" rx="2" />
            <path d="M3 10h18" />
          </svg>
          <span class="cu-date-picker-label">{{ selectedLabel }}</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="cu-date-picker-chevron"
            :class="{ 'cu-date-picker-chevron--open': isOpen }"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </Button>
      </template>

      <!-- Panel: el calendario adentro (no es un item seleccionable, es un box) -->
      <template #default>
        <div class="cu-date-picker-panel">
          <Calendar
            :model-value="selectedValue"
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
            @select="onSelect"
          />
          <div v-if="todayButton || clearable" class="cu-date-picker-footer">
            <Button
              v-if="todayButton"
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
      </template>
    </Dropdown>
  </div>
</template>

<style scoped>
.cu-date-picker {
  width: 100%;
  outline: none;
}

.cu-date-picker :deep(.cu-dropdown) {
  width: 100%;
}

.cu-date-picker-toggle {
  width: 100%;
  justify-content: space-between;
  gap: var(--cu-space-md);
  box-sizing: border-box;
}

.cu-date-picker-icon {
  flex-shrink: 0;
}

.cu-date-picker-label {
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

.cu-date-picker-chevron--open {
  transform: rotate(180deg);
}

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
