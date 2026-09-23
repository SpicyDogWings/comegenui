<script setup lang="ts">
import { ref, getCurrentInstance, type PropType } from "vue";
import Switch from "../../form/Switch.vue";
import { initTokens } from "@/plugins/cu-tokens/css";

initTokens();

const props = defineProps({
  /** Estado del toggle (controlado) */
  modelValue: { type: Boolean, default: false },
  /** Color semántico: `primary`, `neutral`, `success`, `warning`, `danger` */
  color: {
    type: String as PropType<'primary' | 'secondary' | 'neutral' | 'success' | 'warning' | 'danger'>,
    default: "neutral",
  },
  /** Tamaño del switch: `sm`, `md` */
  size: { type: String, default: "md" },
  /** Estado deshabilitado */
  disabled: Boolean,
  label: { type: String, default: "" },
});

const switchRef = ref<InstanceType<typeof Switch> | null>(null);

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

/** Devuelve el estado actual (`boolean`) */
function get() { return switchRef.value?.get() ?? false; }
/** Asigna el estado */
function set(val: boolean) { switchRef.value?.set(val); }
/** Pone el estado en `false` */
function reset() { switchRef.value?.reset(); }
/** Enfoca el switch */
function focus() { switchRef.value?.focus(); }

defineExpose({ get, set, reset, focus });
</script>

<template>
  <Switch
    ref="switchRef"
    :modelValue="props.modelValue"
    :color="props.color"
    :size="props.size"
    :disabled="props.disabled"
    :label="props.label"
    @update:modelValue="ceEmit('update:modelValue', $event)"
    @change="ceEmit('change', $event)"
  >
    <slot></slot>
  </Switch>
</template>

<style>
@unocss-placeholder;
</style>
