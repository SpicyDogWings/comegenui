<script setup lang="ts">
import { computed, getCurrentInstance, ref, watch, type PropType } from 'vue';
import { isColor, isFieldVariant, isSize } from '@/utils/validators'
import NumberInput from "../../form/NumberInput.vue";

const props = defineProps({
  /** Valor actual (`null` = campo vacío). El CE sincroniza su estado; asigná `modelValue` sólo si querés controlarlo */
  modelValue: {
    type: Number,
    required: false,
    default: null,
  },
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
  /** Solo lectura (en HTML: `read-only`) */
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
  /** Valor mínimo permitido (inclusive); por debajo se clampea */
  min: {
    type: Number,
    required: false,
  },
  /** Valor máximo permitido (inclusive); por encima se clampea */
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
  /** Muestra el select de paso (atributo HTML: `show-step-select`) */
  showStepSelect: {
    type: Boolean,
    required: false,
    default: false,
  },
  /** Pasos ofrecidos por el select (se asigna como propiedad JS; `step` siempre está incluido) */
  steps: {
    type: Array as PropType<number[]>,
    required: false,
    default: () => [1, 5, 10],
  },
});

const numberRef = ref<InstanceType<typeof NumberInput> | null>(null);
const instance = getCurrentInstance();
/** El valor se espeja localmente: el CE manda su estado y `update:modelValue` avisa al host. */
const localModel = ref<number | null>(props.modelValue ?? null);
const resolvedSteps = computed(() => props.steps ?? [1, 5, 10]);

watch(
  () => props.modelValue,
  (value) => {
    localModel.value = value ?? null;
  },
);

function ceEmit(event: string, payload: unknown) {
  const el = instance?.vnode.el as HTMLElement | null;
  const host = ((el?.getRootNode() as ShadowRoot | null | undefined)?.host as HTMLElement | null) ?? el;
  if (host) {
    host.dispatchEvent(new CustomEvent(event, {
      detail: payload,
      bubbles: true,
      composed: true,
    }));
  }
}

function onUpdate(value: number | null) {
  localModel.value = value;
  ceEmit("update:modelValue", value);
}

/** Devuelve el valor actual (o `null` si el campo está vacío). */
const get = () => numberRef.value?.get() ?? null;
/** Setea el valor (clampeado a `min`/`max`) y emite `change`. */
const set = (value: number | null) => numberRef.value?.set(value);
/** Vacía el campo y emite `change` con `null`. */
const reset = () => numberRef.value?.reset();
/** Enfoca el campo. */
const focus = () => numberRef.value?.focus();
/** Incrementa el valor con el paso activo, respetando `max`. */
const increment = () => numberRef.value?.increment();
/** Decrementa el valor con el paso activo, respetando `min`. */
const decrement = () => numberRef.value?.decrement();

defineExpose({ get, set, reset, focus, increment, decrement });
</script>

<template>
  <NumberInput
    ref="numberRef"
    :model-value="localModel"
    :color="props.color"
    :variant="props.variant"
    :size="props.size"
    :disabled="props.disabled"
    :read-only="props.readOnly"
    :placeholder="props.placeholder"
    :min="props.min"
    :max="props.max"
    :step="props.step"
    :show-controls="props.showControls"
    :show-step-select="props.showStepSelect"
    :steps="resolvedSteps"
    @update:model-value="onUpdate"
    @change="ceEmit('change', $event)"
    @increment="ceEmit('increment', $event)"
    @decrement="ceEmit('decrement', $event)"
  />
</template>

<style>
:host {
  display: block;
  width: 100%;
}
</style>
