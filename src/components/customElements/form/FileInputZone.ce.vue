<script setup lang="ts">
import { ref, getCurrentInstance, type PropType } from "vue";
import FileInputZone from "../../form/FileInputZone.vue";
import { initTokens } from "@/plugins/cu-tokens/css";

initTokens();

const props = defineProps({
  /** Archivo/s seleccionados */
  modelValue: { type: Object as PropType<File | File[] | null>, default: null },
  /** Color semántico: `primary`, `neutral`, `success`, `warning`, `danger` */
  color: {
    type: String as PropType<'primary' | 'secondary' | 'neutral' | 'success' | 'warning' | 'danger'>,
    default: "neutral",
  },
  /** Texto cuando no hay archivos */
  placeholder: { type: String, default: "Selecciona un archivo o arrastra aquí" },
  /** Deshabilita interacción */
  disabled: Boolean,
  /** Modo solo lectura */
  readOnly: Boolean,
  /** Tipos aceptados (ej: `"image/*"`) */
  accept: String,
  /** Permite múltiples archivos */
  multiple: Boolean,
  /** Tamaño máximo en bytes */
  maxSize: Number,
  /** Activa modo carpeta (incluye `multiple` implícitamente) */
  directory: Boolean,
  /** Niveles de recursión en carpetas: `0` = solo raíz, `1` = +1 subnivel, `-1` = sin límite */
  directoryDeep: { type: Number, default: 0 },
  /** Altura máxima del listado (ej: `"200px"`). Sin scroll si se omite. */
  maxHeight: { type: String, default: "" },
});

const zoneRef = ref<InstanceType<typeof FileInputZone> | null>(null);

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

function get() { return zoneRef.value?.get() ?? null; }
function set(val: File | File[] | null) { zoneRef.value?.set(val); }
function reset() { zoneRef.value?.reset(); }
function focus() { zoneRef.value?.focus(); }
function trigger() { zoneRef.value?.trigger(); }

defineExpose({ get, set, reset, focus, trigger });
</script>

<template>
  <FileInputZone
    ref="zoneRef"
    :modelValue="props.modelValue"
    :color="props.color"
    :placeholder="props.placeholder"
    :disabled="props.disabled"
    :readOnly="props.readOnly"
    :accept="props.accept"
    :multiple="props.multiple"
    :maxSize="props.maxSize"
    :directory="props.directory"
    :directoryDeep="props.directoryDeep"
    :maxHeight="props.maxHeight"
    @update:modelValue="ceEmit('update:modelValue', $event)"
  />
</template>

<style>
@unocss-placeholder;
</style>
