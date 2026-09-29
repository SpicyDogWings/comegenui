<script setup lang="ts">
import { ref, getCurrentInstance, type PropType } from "vue";
import Alert from "../../information/Alert.vue";
import { initTokens } from "@/plugins/cu-tokens/css";

initTokens();

const props = defineProps({
  /** Color semántico: `primary`, `neutral`, `success`, `warning`, `danger` */
  color: {
    type: String as PropType<'primary' | 'secondary' | 'neutral' | 'success' | 'warning' | 'danger'>,
    default: "neutral",
  },
  /** `solid`, `outlined`, `soft`, `ghost`, `subtle` */
  variant: {
    type: String as PropType<'solid' | 'outlined' | 'soft' | 'ghost' | 'subtle'>,
    default: "soft",
  },
  /** Título visible en la cabecera */
  title: String,
  /** Muestra el botón de cerrar (X) */
  close: Boolean,
  /** Controla visibilidad. Cambiar este atributo emite `update:show` */
  show: { type: Boolean, default: true },
});

const alertRef = ref<InstanceType<typeof Alert> | null>(null);

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

/** Muestra la alerta */
function open() { alertRef.value?.open(); }
/** Oculta la alerta */
function close() { alertRef.value?.close(); }
/** Alterna visibilidad */
function toggle() { alertRef.value?.toggle(); }
/** Devuelve `true`/`false` según la visibilidad actual */
function isOpen() { return alertRef.value?.isOpen() ?? false; }

defineExpose({ open, close, toggle, isOpen });
</script>

<template>
  <Alert
    ref="alertRef"
    :color="props.color"
    :variant="props.variant"
    :title="props.title"
    :close="props.close"
    :show="props.show"
    @close="ceEmit('close', $event)"
    @open="ceEmit('open', $event)"
    @update:show="ceEmit('update:show', $event)"
  >
    <template #icon>
      <!-- Ícono junto al título (slot HTML nativo) -->
      <slot name="icon"></slot>
    </template>
    <!-- Cuerpo principal de la alerta -->
    <slot></slot>
  </Alert>
</template>

<style>
@unocss-placeholder;
</style>
