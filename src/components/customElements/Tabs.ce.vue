<script setup lang="ts">
import { ref, watch, getCurrentInstance, type PropType } from "vue";
import Tabs from "../Tabs.vue";
import { initTokens } from "@/plugins/cu-tokens/css";

initTokens();

const props = defineProps({
  /** Definición de las pestañas */
  tabs: {
    type: Array as PropType<{ key: string; label: string; icon?: string; disabled?: boolean; keepAlive?: boolean }[]>,
    default: () => [],
  },
  /** Key del tab activo (controlado) */
  modelValue: { type: String, default: "" },
  /** Color semántico: `primary`, `secondary`, `neutral`, `success`, `warning`, `danger` */
  color: {
    type: String as PropType<'primary' | 'secondary' | 'neutral' | 'success' | 'warning' | 'danger'>,
    default: "primary",
  },
  /** `ghost`, `solid`, `boxed`, `soft` */
  variant: { type: String as PropType<'ghost' | 'solid' | 'boxed' | 'soft'>, default: "ghost" },
  /** `sm`, `md`, `lg` */
  size: { type: String as PropType<'sm' | 'md' | 'lg'>, default: "md" },
  /** Deshabilita todas las pestañas */
  disabled: Boolean,
});

const tabsRef = ref<InstanceType<typeof Tabs> | null>(null);

const instance = getCurrentInstance();
function ceEmit(event: string, payload: unknown) {
  const el = instance?.vnode.el as HTMLElement | null;
  const root = el?.getRootNode() as ShadowRoot | Document | null;
  const host = root && 'host' in root ? (root as ShadowRoot).host : el;
  if (host) {
    host.dispatchEvent(new CustomEvent(event, {
      detail: payload,
      bubbles: true,
      composed: true,
    }));
  }
}

const localModel = ref(props.modelValue);
watch(() => props.modelValue, (v) => {
  localModel.value = v;
});

function onUpdate(val: string) {
  localModel.value = val;
  ceEmit('update:modelValue', val);
}

/** Devuelve la key del tab activo */
function getActive() { return tabsRef.value?.getActive() ?? ""; }
/** Activa el tab con esa key */
function setActive(key: string) { tabsRef.value?.setActive(key); }
/** Activa el próximo tab habilitado */
function next() { tabsRef.value?.next(); }
/** Activa el tab anterior habilitado */
function prev() { tabsRef.value?.prev(); }

defineExpose({ getActive, setActive, next, prev });
</script>

<template>
  <Tabs
    ref="tabsRef"
    :tabs="props.tabs"
    :modelValue="localModel"
    :color="props.color"
    :variant="props.variant"
    :size="props.size"
    :disabled="props.disabled"
    @update:modelValue="onUpdate"
    @change="ceEmit('change', $event)"
  >
    <template v-for="tab in props.tabs" :key="tab.key" #[tab.key]>
      <slot :name="tab.key"></slot>
    </template>
    <template v-for="tab in props.tabs" :key="`icon-${tab.key}`" #[`tab-icon-${tab.key}`]>
      <slot :name="`tab-icon-${tab.key}`"></slot>
    </template>
  </Tabs>
</template>

<style>
@unocss-placeholder;
</style>
