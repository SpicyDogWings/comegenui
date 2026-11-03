<script setup lang="ts">
import { ref, computed, watch, getCurrentInstance, onMounted, onBeforeUnmount, type PropType } from 'vue';
import { isAlign, isColor, isPositionVertical, isTextAlign, isVariantFull } from '@/utils/validators'
import DropdownMenu from "../../controls/DropdownMenu.vue";

const props = defineProps({
  /** Color semántico del toggle: `primary`, `neutral`, `success`, `warning`, `danger` */
  color: {
    type: String as PropType<'primary' | 'secondary' | 'neutral' | 'success' | 'warning' | 'danger'>,
    required: false,
    default: "neutral",
    validator: isColor,
  },
  /** Variante del toggle: `solid`, `outlined`, `soft`, `ghost`, `subtle`, `link`, `none` */
  variant: {
    type: String as PropType<'solid' | 'outlined' | 'soft' | 'ghost' | 'subtle' | 'link' | 'none'>,
    required: false,
    default: "ghost",
    validator: isVariantFull,
  },
  /** Deshabilita el toggle */
  disabled: { type: Boolean, required: false, default: false },
  /** Texto del toggle (se ignora si se provee slot `toggle`) */
  label: { type: String, required: false, default: "" },
  /** Posición preferida del panel: `bottom`, `top` */
  position: {
    type: String as PropType<'bottom' | 'top'>,
    required: false,
    default: "bottom",
    validator: isPositionVertical,
  },
  /** Alineación del panel: `start`, `center`, `end` */
  align: {
    type: String as PropType<'start' | 'center' | 'end'>,
    required: false,
    default: "start",
    validator: isAlign,
  },
  /**
   * Alineación del texto de los items del panel: `left` (default), `center`, `right`.
   * No aplica al toggle: su ancho lo define su contenido.
   */
  textAlign: {
    type: String as PropType<'left' | 'center' | 'right'>,
    required: false,
    default: "left",
    validator: isTextAlign,
  },
  /** Separación en píxeles entre el toggle y el panel */
  offset: { type: Number, required: false, default: 4 },
  /** Si es `true`, el panel usa `position: fixed` en vez de absoluto */
  fixed: { type: Boolean, required: false, default: false },
  /** Lista de items (ver abajo). Se asigna como propiedad JS, no como atributo HTML */
  items: { type: Array, required: false, default: () => [] },
});

// `items` es una propiedad JS (no un atributo): puede llegar `null`, un string o una
// lista con entradas nulas desde datos de la app. `.map` sobre eso rompía el computed
// y el menú entero dejaba de renderizar (trigger incluido).
const resolvedItems = computed(() =>
  (Array.isArray(props.items) ? props.items : [])
    .filter((item: any) => !!item && typeof item === "object")
    .map((item: any) => ({
      ...item,
      color: item.color || undefined,
    })),
);

const dropdownRef = ref<InstanceType<typeof DropdownMenu> | null>(null);
// Estado del menú para publicarlo en el trigger del light DOM.
const menuOpen = computed(() => dropdownRef.value?.isOpen() ?? false);

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

function ceEmit(event: string, payload?: unknown) {
  const host = hostElement();
  if (host) {
    host.dispatchEvent(new CustomEvent(event, {
      detail: payload,
      bubbles: true,
      composed: true,
    }));
  }
}

const hasToggleSlot = ref(hasToggleContent());

// El trigger provisto por el usuario vive en el light DOM: el wrapper le publica el
// estado del menú (`aria-haspopup`/`aria-expanded`), que es lo que un botón genérico
// no puede saber. `aria-controls` no se replica: su id vive en el shadow root y un
// IDREF no cruza la frontera (el panel queda sin referencia por id, como en el resto
// de los CE con panel).
function syncToggleAria() {
  for (const el of hostElement()?.querySelectorAll<HTMLElement>('[slot="toggle"]') ?? []) {
    el.setAttribute("aria-haspopup", "menu");
    el.setAttribute("aria-expanded", dropdownRef.value?.isOpen() ? "true" : "false");
  }
}

watch(menuOpen, syncToggleAria);

let observer: MutationObserver | null = null;
onMounted(() => {
  hasToggleSlot.value = hasToggleContent();
  syncToggleAria();
  const host = hostElement();
  if (host && typeof MutationObserver !== "undefined") {
    observer = new MutationObserver(() => {
      hasToggleSlot.value = hasToggleContent();
      syncToggleAria();
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
  isOpen: () => dropdownRef.value?.isOpen() ?? false,
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
    @open="ceEmit('open')"
    @close="ceEmit('close')"
  >
    <template v-if="hasToggleSlot" #toggle>
      <!-- Reemplaza el botón toggle (sintaxis HTML `slot="toggle"`) -->
      <slot name="toggle"></slot>
    </template>
    <!-- Contenido del panel. Se usa solo si `items` está vacío o no se provee -->
    <slot></slot>
  </DropdownMenu>
</template>
