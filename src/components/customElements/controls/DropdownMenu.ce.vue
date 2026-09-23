<script setup lang="ts">
import { ref, computed, getCurrentInstance, onMounted, onBeforeUnmount } from "vue";
import DropdownMenu from "../../controls/DropdownMenu.vue";

const props = defineProps({
  /** Tema: `light`, `dark`, `sigacadv2` (hereda de `<html data-theme>` si se omite) */
  theme: { type: String, required: false, default: "" },
  /** Color semántico del toggle: `primary`, `neutral`, `success`, `warning`, `danger` */
  color: {
    type: String,
    required: false,
    default: "neutral",
    validator: (value: string) =>
      ["primary", "secondary", "neutral", "success", "warning", "danger"].includes(value),
  },
  /** Variante del toggle: `solid`, `outlined`, `soft`, `ghost`, `subtle`, `link`, `none` */
  variant: {
    type: String,
    required: false,
    default: "ghost",
    validator: (value: string) =>
      ["solid", "outlined", "soft", "ghost", "subtle", "link", "none"].includes(value),
  },
  /** Deshabilita el toggle */
  disabled: { type: Boolean, required: false, default: false },
  /** Texto del toggle (se ignora si se provee slot `toggle`) */
  label: { type: String, required: false, default: "" },
  /** Posición preferida del panel: `bottom`, `top` */
  position: {
    type: String,
    required: false,
    default: "bottom",
    validator: (value: string) => ["bottom", "top"].includes(value),
  },
  /** Alineación del panel: `start`, `center`, `end` */
  align: {
    type: String,
    required: false,
    default: "start",
    validator: (value: string) => ["start", "center", "end"].includes(value),
  },
  /** Alineación del texto del toggle: `left`, `center`, `right` */
  textAlign: {
    type: String,
    required: false,
    default: "left",
    validator: (value: string) => ["left", "center", "right"].includes(value),
  },
  /** Separación en píxeles entre el toggle y el panel */
  offset: { type: Number, required: false, default: 4 },
  /** Si es `true`, el panel usa `position: fixed` en vez de absoluto */
  fixed: { type: Boolean, required: false, default: false },
  /** Lista de items (ver abajo). Se asigna como propiedad JS, no como atributo HTML */
  items: { type: Array, required: false, default: () => [] },
});

const emit = defineEmits(["open", "close"]);

const resolvedItems = computed(() =>
  (props.items || []).map((item: any) => ({
    ...item,
    color: item.color || undefined,
  })),
);

const dropdownRef = ref<InstanceType<typeof DropdownMenu> | null>(null);

// El slot `toggle` es light DOM. Solo lo reenviamos a DropdownMenu si el host
// trae contenido con slot="toggle"; si no, un slot provisto pero vacío pisaría
// el botón por defecto del componente. En shadow DOM el contenido no llega por
// `$slots`, hay que mirarlo en el DOM del host.
const instance = getCurrentInstance();

function hostElement(): HTMLElement | null {
  const ce = (instance as unknown as { ce?: HTMLElement } | null)?.ce;
  if (ce) return ce;
  const el = instance?.vnode.el as HTMLElement | null;
  return ((el?.getRootNode() as ShadowRoot | null)?.host as HTMLElement | null) ?? el;
}

function hasToggleContent(): boolean {
  return !!hostElement()?.querySelector('[slot="toggle"]');
}

const hasToggleSlot = ref(hasToggleContent());

let observer: MutationObserver | null = null;
onMounted(() => {
  hasToggleSlot.value = hasToggleContent();
  const host = hostElement();
  if (host && typeof MutationObserver !== "undefined") {
    observer = new MutationObserver(() => {
      hasToggleSlot.value = hasToggleContent();
    });
    observer.observe(host, { childList: true, attributes: true, attributeFilter: ["slot"] });
  }
});
onBeforeUnmount(() => {
  observer?.disconnect();
  observer = null;
});

defineExpose({
  open: () => dropdownRef.value?.open(),
  close: () => dropdownRef.value?.close(),
  toggle: () => dropdownRef.value?.toggle(),
  isOpen: () => dropdownRef.value?.isOpen || false,
});
</script>

<template>
  <DropdownMenu
    ref="dropdownRef"
    :color="props.color"
    :variant="props.variant"
    :disabled="props.disabled"
    :label="props.label"
    :position="props.position"
    :align="props.align"
    :text-align="props.textAlign"
    :fixed="props.fixed"
    :offset="props.offset"
    :items="resolvedItems"
    @open="emit('open')"
    @close="emit('close')"
  >
    <template v-if="hasToggleSlot" #toggle>
      <slot name="toggle"></slot>
    </template>
    <slot></slot>
  </DropdownMenu>
</template>
