<script setup lang="ts">
import { computed, ref, watch, type PropType } from 'vue';
import Input from './Input.vue';
import Button from '../buttons/Button.vue';
import Select from './Select.vue';
import { isColor, isFieldVariant, isSize } from '@/utils/validators'

/** Valor numérico del campo: `null` es el campo vacío. */
const value = defineModel<number | null>({ default: null });

const props = defineProps({
  /** Color semántico: `primary`, `neutral`, `success`, `warning`, `danger` */
  color: {
    type: String as PropType<'primary' | 'secondary' | 'neutral' | 'success' | 'warning' | 'danger'>,
    required: false,
    default: "neutral",
    validator: isColor,
  },
  /** `outlined`, `soft`, `ghost`, `subtle` */
  variant: {
    type: String as PropType<'outlined' | 'soft' | 'ghost' | 'subtle'>,
    required: false,
    default: "soft",
    validator: isFieldVariant,
  },
  /** Tamaño del campo y de los botones: `sm`, `md`, `lg` */
  size: {
    type: String as PropType<'sm' | 'md' | 'lg'>,
    required: false,
    default: "md",
    validator: isSize,
  },
  /** Estado deshabilitado: apaga el campo, los botones y el select de paso */
  disabled: {
    type: Boolean,
    required: false,
    default: false,
  },
  /** Solo lectura: deja leer y seleccionar el texto, pero no editarlo ni cambiar el valor */
  readOnly: {
    type: Boolean,
    required: false,
    default: false,
  },
  /** Placeholder del campo */
  placeholder: {
    type: String,
    required: false,
  },
  /** Valor mínimo permitido (inclusive); al tipear no se recorta, Enter/blur y la API clampean */
  min: {
    type: Number,
    required: false,
  },
  /** Valor máximo permitido (inclusive); al tipear no se recorta, Enter/blur y la API clampean */
  max: {
    type: Number,
    required: false,
  },
  /** Incremento por defecto de los botones y las flechas */
  step: {
    type: Number,
    required: false,
    default: 1,
  },
  /** Muestra los botones − / + a los costados del campo */
  showControls: {
    type: Boolean,
    required: false,
    default: true,
  },
  /** Muestra el select de paso, que define cuánto suman o restan los botones y las flechas */
  showStepSelect: {
    type: Boolean,
    required: false,
    default: false,
  },
  /** Pasos ofrecidos por el select de paso (el `step` siempre está incluido) */
  steps: {
    type: Array as PropType<number[]>,
    required: false,
    default: () => [1, 5, 10],
  },
});

const emit = defineEmits<{
  /** Se dispara al confirmar el valor (Enter, blur, botones o `set()`/`reset()`), con el valor final. */
  (e: 'change', value: number | null): void
  /** Se dispara al incrementar, con el valor nuevo (ya clampeado). */
  (e: 'increment', value: number): void
  /** Se dispara al decrementar, con el valor nuevo (ya clampeado). */
  (e: 'decrement', value: number): void
}>();

const inputRef = ref<InstanceType<typeof Input> | null>(null);

/**
 * Valor vigente dentro del componente. Es la fuente de verdad inmediata: los
 * métodos (`get`, `set`, `increment`…) no esperan al re-render del host. Cuando
 * el `model-value` lo controla un padre (el custom element espeja su estado), la
 * prop vuelve recién en el tick siguiente y leerla dejaría métodos y `get()`
 * con el valor viejo.
 */
const current = ref<number | null>(toNumber(value.value) ?? null);

/** El texto es la fuente de verdad mientras se tipea (`null` → campo vacío). */
const text = ref(numberToText(current.value));
/** Paso activo: arranca en `step` y el select lo puede cambiar. */
const activeStep = ref<number | string>(props.step);
/** ¿El usuario editó el campo desde la última confirmación? (para no repetir `change`). */
let dirty = false;

/**
 * Número a partir de una prop: los atributos HTML del custom element llegan como
 * string (`step="5"`), así que se normalizan acá.
 */
function toNumber(raw: unknown): number | undefined {
  if (raw === null || raw === undefined || raw === '') return undefined;
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : undefined;
}

const minValue = computed(() => toNumber(props.min));
const maxValue = computed(() => toNumber(props.max));
const stepProp = computed(() => toNumber(props.step) ?? 1);

/** `null` → `""`; un número → su representación decimal. */
function numberToText(next: number | null): string {
  return next === null || next === undefined ? '' : String(next);
}

/** Texto → número, `null` (vacío) o `undefined` (texto incompleto: `"-"`, `"1."`). */
function parseText(raw: string): number | null | undefined {
  const trimmed = raw.trim();
  if (trimmed === '') return null;
  const parsed = Number(trimmed);
  return Number.isFinite(parsed) ? parsed : undefined;
}

/** Cantidad de decimales de un número (para no arrastrar `0.30000000000000004`). */
function decimalsOf(next: number): number {
  // `String` usa notación exponencial para valores muy chicos o muy grandes
  // (`1e-7`): sin normalizarla, un paso por debajo de `1e-6` redondeaba a 0.
  const [mantissa = '', exponent] = String(next).split('e');
  const dot = mantissa.indexOf('.');
  const decimals = dot === -1 ? 0 : mantissa.length - dot - 1;
  const shift = exponent === undefined ? 0 : Number(exponent);
  return Math.max(0, decimals - shift);
}

/** Redondea al decimal más fino de los operandos (tope de 10). */
function roundLike(next: number, ...operands: number[]): number {
  const places = Math.min(10, Math.max(decimalsOf(next), ...operands.map(decimalsOf)));
  return Number(next.toFixed(places));
}

/** Aplica `min`/`max` (los límites son inclusive). */
function clamp(next: number): number {
  let clamped = next;
  if (minValue.value !== undefined) clamped = Math.max(minValue.value, clamped);
  if (maxValue.value !== undefined) clamped = Math.min(maxValue.value, clamped);
  return clamped;
}

const isLocked = computed(() => props.disabled || props.readOnly);

/** Paso efectivo: ignora valores no finitos o no positivos. */
const stepValue = computed(() => {
  const current = toNumber(activeStep.value);
  return current !== undefined && current > 0 ? current : 1;
});

/** Opciones del select de paso, con `step` primero y sin repetidos. */
const stepOptions = computed(() => {
  const extra = Array.isArray(props.steps) ? props.steps : [];
  const all = [stepProp.value, ...extra]
    .map(toNumber)
    .filter((n): n is number => n !== undefined && n > 0);
  return [...new Set(all)];
});

/** Opciones del Select de la librería (`{ value, label }`, ambos string). */
const stepSelectOptions = computed(() =>
  stepOptions.value.map((option) => ({ value: String(option), label: String(option) })),
);

const atMax = computed(
  () => maxValue.value !== undefined && current.value !== null && current.value >= maxValue.value,
);
const atMin = computed(
  () => minValue.value !== undefined && current.value !== null && current.value <= minValue.value,
);
const canIncrement = computed(() => !isLocked.value && !atMax.value);
const canDecrement = computed(() => !isLocked.value && !atMin.value);

const rootStyles = computed(() => ({
  '--btn-subtle': `var(--cu-color-${props.color}-subtle)`,
  '--btn-subtle-hover': `var(--cu-color-${props.color}-subtle-hover)`,
  '--btn-subtle-border': `var(--cu-color-${props.color}-subtle-border)`,
}));

/** Escribe el valor: estado interno ya, y `update:modelValue` para el host. */
function commitValue(next: number | null) {
  current.value = next;
  if (next !== value.value) value.value = next;
}

/** Aplica un valor programático: clampea, sincroniza el texto y emite lo que corresponda. */
function applyValue(
  next: number | null,
  options: { change?: boolean; kind?: 'increment' | 'decrement' } = {},
) {
  const nextValue = next === null ? null : clamp(next);
  commitValue(nextValue);
  text.value = numberToText(nextValue);
  dirty = false;

  if (options.kind === 'increment') emit('increment', nextValue as number);
  if (options.kind === 'decrement') emit('decrement', nextValue as number);

  if (options.change) emit('change', nextValue);
}

/**
 * Tipear: el texto se respeta tal cual (nunca se reescribe por estar fuera de
 * rango, así se puede completar un año como `2019`). El modelo sólo sigue a los
 * números dentro de `[min, max]`; fuera de rango se recorta recién al confirmar.
 */
function onInput(raw: string) {
  text.value = raw;
  dirty = true;
  const parsed = parseText(raw);
  if (parsed === undefined) return;
  if (parsed === null) {
    if (current.value !== null) commitValue(null);
    return;
  }
  if (clamp(parsed) === parsed && parsed !== current.value) commitValue(parsed);
}

/** Confirma el texto (Enter o blur) y emite `change` si hubo edición. */
function commit() {
  const parsed = parseText(text.value);
  const next =
    parsed === undefined ? current.value : parsed === null ? null : clamp(parsed);
  text.value = numberToText(next);
  if (next !== current.value) commitValue(next);
  if (!dirty) return;
  dirty = false;
  emit('change', next);
}

/** Incrementa el valor con el paso activo, respetando `max`. */
function increment() {
  if (!canIncrement.value) return;
  const base = current.value ?? minValue.value ?? 0;
  const next = clamp(roundLike(base + stepValue.value, base, stepValue.value));
  if (next === current.value) return;
  applyValue(next, { change: true, kind: 'increment' });
}

/** Decrementa el valor con el paso activo, respetando `min`. */
function decrement() {
  if (!canDecrement.value) return;
  const base = current.value ?? minValue.value ?? 0;
  const next = clamp(roundLike(base - stepValue.value, base, stepValue.value));
  if (next === current.value) return;
  applyValue(next, { change: true, kind: 'decrement' });
}

/** Cambia el paso que usan los botones y las flechas (no altera el valor). */
function onStepChange(value: string) {
  const next = toNumber(value);
  if (next !== undefined && next > 0) activeStep.value = next;
}

/** Devuelve el valor actual (o `null` si el campo está vacío). */
function get(): number | null {
  return current.value;
}
/** Setea el valor (clampeado a `min`/`max`) y emite `change`. */
function set(next: number | null) {
  applyValue(next, { change: true });
}
/** Vacía el campo y emite `change` con `null`. */
function reset() {
  applyValue(null, { change: true });
}
/** Enfoca el campo. */
function focus() {
  inputRef.value?.focus();
}

// Un `modelValue` externo manda: sincroniza el estado y el texto (salvo que el
// usuario esté tipeando el mismo número).
watch(value, (next) => {
  const normalized = toNumber(next) ?? null;
  current.value = normalized;
  if (parseText(text.value) !== normalized) text.value = numberToText(normalized);
});

// Si cambia el `step` por prop, el paso activo lo sigue.
watch(
  () => props.step,
  (next) => {
    activeStep.value = next;
  },
);

defineExpose({ get, set, reset, focus, increment, decrement });
</script>

<template>
  <div
    class="cu-number-input"
    :class="[
      `cu-number-input--${props.size}`,
      { 'cu-number-input--disabled': props.disabled, 'cu-number-input--readonly': props.readOnly },
    ]"
    :style="rootStyles"
  >
    <Button
      v-if="props.showControls"
      class="cu-number-input__control cu-number-input__control--decrement"
      :color="props.color"
      variant="ghost"
      :size="props.size"
      :disabled="!canDecrement"
      aria-label="Restar"
      @click="decrement"
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
        aria-hidden="true"
      >
        <path d="M5 12h14" />
      </svg>
    </Button>

    <Input
      ref="inputRef"
      class="cu-number-input__field"
      type="text"
      inputmode="decimal"
      :model-value="text"
      :placeholder="props.placeholder"
      :color="props.color"
      :variant="props.variant"
      :size="props.size"
      :disabled="props.disabled"
      :read-only="props.readOnly"
      @update:model-value="onInput"
      @keydown.up.prevent="increment"
      @keydown.down.prevent="decrement"
      @keydown.enter.prevent="commit"
      @blur="commit"
      @change.stop
    />

    <Button
      v-if="props.showControls"
      class="cu-number-input__control cu-number-input__control--increment"
      :color="props.color"
      variant="ghost"
      :size="props.size"
      :disabled="!canIncrement"
      aria-label="Sumar"
      @click="increment"
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
        aria-hidden="true"
      >
        <path d="M5 12h14" />
        <path d="M12 5v14" />
      </svg>
    </Button>

    <!-- El paso usa el Select de la librería (no un <select> nativo), para que
         comparta color, variante y estados con el resto del campo. -->
    <span v-if="props.showStepSelect" class="cu-number-input__step">
      <Select
        :model-value="String(stepValue)"
        :options="stepSelectOptions"
        :color="props.color"
        :variant="props.variant"
        :disabled="isLocked"
        aria-label="Paso"
        @change="onStepChange"
      />
    </span>
  </div>
</template>

<style scoped>
.cu-number-input {
  display: inline-flex;
  align-items: stretch;
  gap: var(--cu-space-xs);
  width: 100%;
  box-sizing: border-box;
  font-family: var(--cu-font-sans);
}

.cu-number-input__field {
  flex: 1 1 auto;
  min-width: 0;
}

.cu-number-input__control {
  flex: 0 0 auto;
  padding-left: var(--cu-space-sm);
  padding-right: var(--cu-space-sm);
}

.cu-number-input__step {
  flex: 0 0 auto;
  display: inline-flex;
  min-width: 4.5rem;
}

.cu-number-input__step :deep(.cu-select) {
  width: 100%;
}

/* Mismo padding que el botón del campo, para que el select no quede más alto. */
.cu-number-input__step :deep(.cu-select-toggle) {
  padding: var(--cu-space-md) var(--cu-space-md);
}

.cu-number-input--sm .cu-number-input__step :deep(.cu-select-toggle) {
  font-size: var(--cu-font-size-xs);
  padding: var(--cu-space-xs) var(--cu-space-sm);
}

.cu-number-input--lg .cu-number-input__step :deep(.cu-select-toggle) {
  font-size: var(--cu-font-size-lg);
  padding: var(--cu-space-lg) var(--cu-space-lg);
}

.cu-number-input--disabled {
  opacity: 0.5;
}

.cu-number-input--readonly .cu-number-input__step :deep(.cu-select-toggle) {
  cursor: default;
}
</style>
