<script setup lang="ts">
import { computed, ref, watch, getCurrentInstance, type PropType } from 'vue';
import { isTextAlign } from '@/utils/validators'
import Select from "../../form/Select.vue";

interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
  color?: string;
  variant?: string;
}

const props = defineProps({
  /** Valor seleccionado */
  modelValue: { type: String, required: false, default: "" },
  /** Opciones del select (ver abajo). Se asigna como propiedad JS */
  options: { type: Array as () => SelectOption[], required: false, default: () => [] },
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
  /** Texto mostrado cuando no hay selección */
  placeholder: { type: String, required: false },
  /** Si `true`, el texto wrappea; si `false`, se trunca con `...` (atributo HTML: `placeholder-wrap`) */
  placeholderWrap: { type: Boolean, required: false, default: false },
  /** Posición del dropdown: `bottom`, `top` */
  position: { type: String, required: false, default: "bottom" },
  /** Alineación: `start`, `center`, `end` */
  align: { type: String, required: false, default: "start" },
  /** Alineación del texto seleccionado: `left`, `center`, `right` */
  textAlign: {
    type: String as PropType<'left' | 'center' | 'right'>,
    required: false,
    default: "left",
    validator: isTextAlign,
  },
  /** Estado deshabilitado */
  disabled: { type: Boolean, required: false, default: false },
  /** Si es `true`, el dropdown usa `position: fixed` en vez de absoluto */
  fixed: { type: Boolean, required: false, default: false },
  /** Activa búsqueda por teclado (estilo select nativo: escribir hace scroll al match) */
  searchEnabled: { type: Boolean, required: false, default: false },
  /** Modo de coincidencia: `startsWith` (solo al inicio del label) o `includes` (en cualquier parte) */
  searchMode: { type: String as PropType<'startsWith' | 'includes'>, required: false, default: "startsWith" },
  /** Tiempo (ms) antes de resetear el texto de búsqueda. Se reinicia con cada tecla */
  searchResetDelay: { type: Number, required: false, default: 1000 },
  /** Muestra una barra de progreso animada en el dropdown */
  loading: { type: Boolean, required: false, default: false },
  /** Estilo de la barra de cooldown: `ghost` (suave) o `solid` (color lleno). No se muestra si `loading` está activo */
  cooldownVariant: { type: String, required: false, default: "ghost-hover" },
});

const resolvedOptions = computed(() =>
  (props.options || []).map((opt: any) => ({
    ...opt,
    color: opt.color || undefined,
  })),
);

const selectRef = ref<InstanceType<typeof Select> | null>(null);
const instance = getCurrentInstance();
const innerValue = ref(props.modelValue);

watch(() => props.modelValue, (val) => {
  innerValue.value = val;
});

watch(() => selectRef.value?.get(), (val) => {
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
  get: () => selectRef.value?.get(),
  set: (val: string) => selectRef.value?.set(val),
  reset: () => selectRef.value?.reset(),
  focus: () => selectRef.value?.focus(),
  isOpen: () => selectRef.value?.isOpen() ?? false,
  selectedItem: () => selectRef.value?.selectedItem || null,
});
</script>

<template>
  <Select
    ref="selectRef"
    :color="props.color"
    :variant="props.variant"
    :disabled="props.disabled"
    :placeholder="props.placeholder"
    :placeholder-wrap="props.placeholderWrap"
    :position="props.position"
    :align="props.align"
    :text-align="props.textAlign"
    :fixed="props.fixed"
    :model-value="innerValue"
    :options="resolvedOptions"
    :search-enabled="props.searchEnabled"
    :search-mode="props.searchMode"
    :search-reset-delay="props.searchResetDelay"
    :loading="props.loading"
    :cooldown-variant="props.cooldownVariant"
    @select="ceEmit('select', $event)"
    @close="ceEmit('close', $event)"
    @blur="ceEmit('blur', $event)"
  />
</template>

<style>
:host {
  display: block;
  width: 100%;
}
</style>
