<script setup lang="ts">
import { ref, watch, getCurrentInstance, type PropType } from 'vue';
import { isFieldVariant } from '@/utils/validators'
import Textarea from "../../form/Textarea.vue";

const props = defineProps({
  /** Tema: `light`, `dark`, `sigacadv2` (hereda de `<html data-theme>` si se omite) */
  theme: {
    type: String,
    required: false,
    default: "",
  },
  /** Valor controlado */
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
  /** Modo de alto contraste para el texto */
  hightContrast: {
    type: Boolean,
    required: false,
    default: false,
  },
});

const innerValue = ref(props.modelValue);
const textareaRef = ref<InstanceType<typeof Textarea> | null>(null);
const instance = getCurrentInstance();

watch(() => props.modelValue, (val) => {
  innerValue.value = val;
});

watch(() => textareaRef.value?.get(), (val) => {
  if (val !== undefined && val !== null && val !== innerValue.value) {
    innerValue.value = val;
    ceEmit("update:modelValue", val);
  }
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

defineExpose({
  get: () => textareaRef.value?.get(),
  set: (value: string | number) => textareaRef.value?.set(value),
  reset: () => textareaRef.value?.reset(),
  focus: () => textareaRef.value?.focus(),
});
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
    :model-value="innerValue"
  />
</template>

<style scoped>
</style>
