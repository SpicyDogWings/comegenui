<script setup lang="ts">
import { ref, watch, getCurrentInstance, type PropType } from "vue";
import FileInput from "../../form/FileInput.vue";
import { initTokens } from "@/plugins/cu-tokens/css";

initTokens();

const props = defineProps({
  /** Archivo seleccionado (vía JS, no HTML) */
  modelValue: { type: Object as PropType<File | null>, default: null },
  /** Color semántico: `primary`, `neutral`, `success`, `warning`, `danger` */
  color: {
    type: String as PropType<'primary' | 'secondary' | 'neutral' | 'success' | 'warning' | 'danger'>,
    default: "neutral",
  },
  /** `outlined`, `soft`, `ghost`, `subtle` */
  variant: { type: String as PropType<'outlined' | 'soft' | 'ghost' | 'subtle'>, default: "outlined" },
  /** Texto cuando no hay archivo */
  placeholder: { type: String, default: "Seleccionar archivo" },
  /** Deshabilita click, drag y drop */
  disabled: Boolean,
  /** Modo solo lectura */
  readOnly: Boolean,
  /** Tipos aceptados (ej: `"image/*"`, `".pdf,.doc"`) */
  accept: String,
  /** Tamaño máximo en bytes */
  maxSize: Number,
});

const fileInputRef = ref<InstanceType<typeof FileInput> | null>(null);
const localModel = ref<File | null>(props.modelValue);

watch(() => props.modelValue, (val) => {
  localModel.value = val;
});

const instance = getCurrentInstance();
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

function onUpdate(val: File | null) {
  localModel.value = val;
  ceEmit("update:modelValue", val);
}

/** Devuelve el `File` actual o `null` */
function get() { return fileInputRef.value?.get() ?? null; }
/** Asigna un archivo programáticamente */
function set(val: File | null) { fileInputRef.value?.set(val); }
/** Limpia la selección */
function reset() { fileInputRef.value?.reset(); }
/** Enfoca el input */
function focus() { fileInputRef.value?.focus(); }
/** Abre el diálogo nativo de selección de archivos */
function trigger() { fileInputRef.value?.trigger(); }

defineExpose({ get, set, reset, focus, trigger });
</script>

<template>
  <FileInput
    ref="fileInputRef"
    :model-value="localModel"
    :color="props.color"
    :variant="props.variant"
    :placeholder="props.placeholder"
    :disabled="props.disabled"
    :read-only="props.readOnly"
    :accept="props.accept"
    :max-size="props.maxSize"
    @update:model-value="onUpdate"
  />
</template>

<style>
@unocss-placeholder;
</style>
