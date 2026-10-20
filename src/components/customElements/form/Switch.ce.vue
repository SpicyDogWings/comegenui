<script setup lang="ts">
import { ref, watch, getCurrentInstance, onMounted, onBeforeUnmount, type PropType } from "vue";
import Switch from "../../form/Switch.vue";

const props = defineProps({
  /** Estado del toggle. El CE sincroniza su estado; asigná `modelValue` sólo si querés controlarlo */
  modelValue: { type: Boolean, default: false },
  /** Color semántico: `primary`, `neutral`, `success`, `warning`, `danger` */
  color: {
    type: String as PropType<'primary' | 'secondary' | 'neutral' | 'success' | 'warning' | 'danger'>,
    default: "neutral",
  },
  /** Tamaño del switch: `sm`, `md` */
  size: { type: String as PropType<'sm' | 'md'>, default: "md" },
  /** Estado deshabilitado */
  disabled: Boolean,
  label: { type: String, default: "" },
  /** Posición de la etiqueta: `end` (derecha, default) o `start` (izquierda) */
  labelPosition: {
    type: String as PropType<'start' | 'end'>,
    default: "end",
  },
});

const switchRef = ref<InstanceType<typeof Switch> | null>(null);
const localModel = ref(props.modelValue);

watch(() => props.modelValue, (val) => {
  localModel.value = val;
});

const instance = getCurrentInstance();

// El CE siempre declara un `<slot>` en su template, así que el Switch interno
// vería `$slots.default` aunque el host no tenga hijos y nunca caería al
// fallback de `label`. Sólo pasamos el slot cuando el host tiene contenido real
// (ignorando espacios y comentarios) y reaccionamos si ese contenido cambia.
const hasHostContent = ref(false);
let hostObserver: MutationObserver | null = null;

function nodeCountsAsContent(node: ChildNode): boolean {
  if (node.nodeType === Node.TEXT_NODE) return !!node.textContent?.trim();
  if (node.nodeType === Node.COMMENT_NODE) return false;
  return true;
}

onMounted(() => {
  const el = instance?.vnode.el as HTMLElement | null;
  const host = (el?.getRootNode() as ShadowRoot | null)?.host as HTMLElement | null;
  if (!host) return;

  const update = () => {
    hasHostContent.value = Array.from(host.childNodes).some(nodeCountsAsContent);
  };

  update();
  hostObserver = new MutationObserver(update);
  hostObserver.observe(host, { childList: true, subtree: true, characterData: true });
});

onBeforeUnmount(() => hostObserver?.disconnect());
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

function onUpdate(val: boolean) {
  localModel.value = val;
  ceEmit("update:modelValue", val);
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
    :model-value="localModel"
    :color="props.color"
    :size="props.size"
    :disabled="props.disabled"
    :label="props.label"
    :label-position="props.labelPosition"
    @update:model-value="onUpdate"
    @change="ceEmit('change', $event)"
  >
    <template v-if="hasHostContent" #default>
      <slot></slot>
    </template>
  </Switch>
</template>

<style>
@unocss-placeholder;
</style>
