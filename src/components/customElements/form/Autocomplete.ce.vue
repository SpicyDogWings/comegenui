<script setup lang="ts">
import { ref, watch, getCurrentInstance, type PropType } from "vue";
import Autocomplete from "../../form/Autocomplete.vue";

const props = defineProps({
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
    type: String,
    required: false,
    default: "text",
  },
  /** Estado deshabilitado */
  disabled: { type: Boolean, required: false, default: false },
  /** Solo lectura (en HTML se usa como `readonly`) */
  readOnly: { type: Boolean, required: false, default: false },
  /** Placeholder del input */
  placeholder: { type: String, required: false, default: "" },
  /** Caracteres mínimos para que el menú se abra al tipear o al enfocar (atributo HTML: `min-chars`) */
  minChars: { type: Number, required: false, default: 0 },
  /** Posición del dropdown: `bottom`, `top` */
  position: { type: String as PropType<'bottom' | 'top' | 'left' | 'right'>, required: false, default: "bottom" },
  /** Alineación: `start`, `center`, `end` */
  align: { type: String as PropType<'start' | 'center' | 'end'>, required: false, default: "start" },
  /** Panel en `position: fixed` (útil en contenedores con overflow) */
  fixed: { type: Boolean, required: false, default: false },
  /** Opciones del menú (ver abajo). Se asigna como propiedad JS */
  items: { type: Array, required: false, default: () => [] },
  /** Valor actual del texto. El CE sincroniza su estado; asigná `modelValue` sólo si querés controlarlo */
  modelValue: { type: String, required: false, default: "" },
});

const autocompleteRef = ref<InstanceType<typeof Autocomplete> | null>(null);
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

defineExpose({
  get: () => autocompleteRef.value?.get(),
  /** Setea el texto actual sin abrir el panel (para ver sugerencias usá `open()`). */
  set: (val: string) => autocompleteRef.value?.set(val),
  focus: () => autocompleteRef.value?.focus(),
  reset: () => autocompleteRef.value?.reset(),
  /** Abre el panel de sugerencias (ignora `min-chars`). */
  open: () => autocompleteRef.value?.open(),
  /** Cierra el panel de sugerencias. */
  close: () => autocompleteRef.value?.close(),
  /** Alterna la visibilidad del panel de sugerencias. */
  toggle: () => autocompleteRef.value?.toggle(),
  isOpen: () => autocompleteRef.value?.isOpen() ?? false,
  selectedItem: () => autocompleteRef.value?.selectedItem || null,
});
</script>

<template>
  <Autocomplete
    ref="autocompleteRef"
    :color="props.color"
    :variant="props.variant"
    :type="props.type"
    :disabled="props.disabled"
    :read-only="props.readOnly"
    :placeholder="props.placeholder"
    :min-chars="props.minChars"
    :position="props.position"
    :align="props.align"
    :fixed="props.fixed"
    :items="props.items"
    :model-value="localModel"
    @update:model-value="onUpdate"
    @select="ceEmit('select', $event)"
    @blur="ceEmit('blur', $event)"
  />
</template>

<style scoped>
</style>
