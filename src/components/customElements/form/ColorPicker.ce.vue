<script setup lang="ts">
import { ref, watch, getCurrentInstance } from "vue";
import ColorPicker from "../../form/ColorPicker.vue";

const props = defineProps({
  /** Valor del color en formato hex (`#RRGGBB`) */
  modelValue: { type: String, default: "#000000" },
  /** Color semántico: `primary`, `neutral`, `success`, `warning`, `danger` (define el acento del borde/foco) */
  color: { type: String, default: "neutral" },
  /** Deshabilita el control */
  disabled: { type: Boolean, default: false },
});

const pickerRef = ref<InstanceType<typeof ColorPicker> | null>(null);
const localModel = ref(props.modelValue);

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

function onUpdate(val: string) {
  localModel.value = val;
  ceEmit("update:modelValue", val);
}

/** Devuelve el color actual (`string` hex) */
function get() { return pickerRef.value?.get() ?? "#000000"; }
/** Asigna un color programáticamente */
function set(val: string) { pickerRef.value?.set(val); }
/** Vuelve al valor por defecto `#000000` */
function reset() { pickerRef.value?.reset(); }
/** Enfoca el campo de texto */
function focus() { pickerRef.value?.focus(); }

defineExpose({ get, set, reset, focus });
</script>

<template>
  <ColorPicker
    ref="pickerRef"
    :model-value="localModel"
    :color="props.color"
    :disabled="props.disabled"
    @update:model-value="onUpdate"
    @change="ceEmit('change', $event)"
  />
</template>

<style>
@unocss-placeholder;
</style>
