<script setup lang="ts">
import { ref, watch, getCurrentInstance, type PropType } from "vue";
import Input from "../../form/Input.vue";

const props = defineProps({
  /** Valor actual del input. El CE sincroniza su estado; asigná `modelValue` sólo si querés controlarlo */
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
  },
  /** `text`, `password`, `email`, `number`, `tel`, `url`, `search` */
  type: {
    type: String as PropType<'text' | 'password' | 'email' | 'number' | 'tel' | 'url' | 'search'>,
    required: false,
    default: "text",
  },
  /** Placeholder del input */
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
  /** Tamaño: `sm`, `md`, `lg` */
  size: {
    type: String as PropType<'sm' | 'md' | 'lg'>,
    required: false,
    default: "md",
  },
});

const inputRef = ref<InstanceType<typeof Input> | null>(null);
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

/** Devuelve el valor actual del input. */
const get = () => inputRef.value?.get();
/** Setea el valor del input (acepta `string | number`). */
const set = (value: string | number) => inputRef.value?.set(value);
/** Limpia el campo. */
const reset = () => inputRef.value?.reset();
/** Enfoca el input. */
const focus = () => inputRef.value?.focus();

defineExpose({ get, set, reset, focus });
</script>

<template>
  <Input
    ref="inputRef"
    :color="props.color"
    :variant="props.variant"
    :type="props.type"
    :placeholder="props.placeholder"
    :disabled="props.disabled"
    :read-only="props.readOnly"
    :size="props.size"
    :start-value="props.startValue"
    :model-value="localModel"
    @update:model-value="onUpdate"
  />
</template>

<style scoped>
</style>
