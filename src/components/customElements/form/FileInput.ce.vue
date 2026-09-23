<script setup lang="ts">
import { ref, getCurrentInstance, type PropType } from "vue";
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
  variant: { type: String, default: "outlined" },
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
    :modelValue="props.modelValue"
    :color="props.color"
    :variant="props.variant"
    :placeholder="props.placeholder"
    :disabled="props.disabled"
    :readOnly="props.readOnly"
    :accept="props.accept"
    :maxSize="props.maxSize"
    @update:modelValue="ceEmit('update:modelValue', $event)"
  />
</template>

<style>
@unocss-placeholder;
</style>
