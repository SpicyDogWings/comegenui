<script setup lang="ts">
import { ref, watch, getCurrentInstance, type PropType } from 'vue';
import { isFieldVariant } from '@/utils/validators'
import Textarea from "../../form/Textarea.vue";

const props = defineProps({
  /** Valor actual del textarea. El CE sincroniza su estado; asigná `modelValue` sólo si querés controlarlo */
  modelValue: {
    type: String,
    required: false,
    default: "",
  },
  /** Valor inicial usado por `.reset()` */
  startValue: {
    type: String,
    required: false,
  },
  /** Color semántico: `primary`, `neutral`, `success`, `warning`, `danger` */
  color: {
    type: String as PropType<'primary' | 'secondary' | 'neutral' | 'success' | 'warning' | 'danger'>,
    required: false,
    default: "neutral",
  },
  /** `outlined`, `soft`, `ghost`, `subtle` */
  variant: {
    type: String as PropType<'outlined' | 'soft' | 'ghost' | 'subtle'>,
    required: false,
    default: "soft",
    validator: isFieldVariant,
  },
  /** Placeholder del textarea */
  placeholder: {
    type: String,
    required: false,
  },
  /** Estado deshabilitado */
  disabled: {
    type: Boolean,
    required: false,
    default: false,
  },
  /** Solo lectura (en HTML se usa como `readonly`) */
  readOnly: {
    type: Boolean,
    required: false,
    default: false,
  },
  /** Cantidad de filas visibles */
  rows: {
    type: Number,
    required: false,
    default: 3,
  },
  /** Desactiva el redimensionado manual (atributo HTML: `no-resize`) */
  noResize: {
    type: Boolean,
    required: false,
    default: false,
  },
});

const textareaRef = ref<InstanceType<typeof Textarea> | null>(null);
const instance = getCurrentInstance();
const localModel = ref(props.modelValue);

watch(() => props.modelValue, (val) => {
  localModel.value = val;
});

function ceEmit(event: string, payload: unknown) {
  const el = instance?.vnode.el as HTMLElement | null;
  const host = el?.getRootNode()?.host || el;
  if (host) {
    host.dispatchEvent(new CustomEvent(event, {
      detail: payload,
      bubbles: true,
      composed: true,
    }));
  }
}

function onUpdate(val: string) {
  localModel.value = val;
  ceEmit("update:modelValue", val);
}

/** Devuelve el valor actual del textarea. */
const get = () => textareaRef.value?.get();
/** Setea el valor (acepta `string | number`). */
const set = (value: string | number) => textareaRef.value?.set(value);
/** Limpia el campo. */
const reset = () => textareaRef.value?.reset();
/** Enfoca el textarea. */
const focus = () => textareaRef.value?.focus();

defineExpose({ get, set, reset, focus });
</script>

<template>
  <Textarea
    ref="textareaRef"
    :color="props.color"
    :variant="props.variant"
    :placeholder="props.placeholder"
    :disabled="props.disabled"
    :read-only="props.readOnly"
    :rows="props.rows"
    :no-resize="props.noResize"
    :start-value="props.startValue"
    :model-value="localModel"
    @update:model-value="onUpdate"
  />
</template>

<style scoped>
</style>
