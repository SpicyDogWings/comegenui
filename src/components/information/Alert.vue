<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, onUpdated, ref, watch, type PropType } from "vue";
import { isColor, isVariant } from '@/utils/validators'

const props = defineProps({
  color: {
    type: String as PropType<'primary' | 'secondary' | 'neutral' | 'success' | 'warning' | 'danger'>,
    required: false,
    default: "neutral",
    validator: isColor,
  },
  variant: {
    type: String as PropType<'solid' | 'outlined' | 'soft' | 'ghost' | 'subtle'>,
    required: false,
    default: "soft",
    validator: isVariant,
  },
  title: {
    type: String,
    required: false,
  },
  close: {
    type: Boolean,
    required: false,
    default: false,
  },
  show: {
    type: Boolean,
    required: false,
    default: true,
  },
});

const emit = defineEmits(["close", "open", "update:show"]);

/** Un color fuera del set no tiene tokens: la variante solid quedaría sin fondo
 *  y con el texto del tema encima (invisible). Cae al color seguro. */
const safeColor = computed(() => (isColor(props.color) ? props.color : 'neutral'));

/* Rol ARIA según urgencia: warning/danger se anuncian como `alert` (assertive);
   el resto son avisos informativos y usan `status` (polite). */
const isUrgent = computed(() => safeColor.value === 'warning' || safeColor.value === 'danger');
const ariaRole = computed(() => (isUrgent.value ? 'alert' : 'status'));
const ariaLive = computed(() => (isUrgent.value ? 'assertive' : 'polite'));

const iconWrap = ref<HTMLElement | null>(null);
const hasIcon = ref(false);
const hasHeader = computed(() => !!props.title || hasIcon.value);
let iconSlot: HTMLSlotElement | null = null;

/**
 * Presencia del ícono. En Vue el contenido del slot se renderiza como hijos del
 * wrapper; en el custom element el slot es nativo y hay que mirar `assignedNodes`.
 * El `<span>` del título lo pinta el componente: no cuenta como ícono.
 */
function nodeHasIconContent(node: Node): boolean {
  if (node.nodeType === Node.TEXT_NODE) return !!node.textContent?.trim();
  if (node.nodeType !== Node.ELEMENT_NODE) return false;
  const el = node as Element;
  if (el.classList.contains('cu-alert-title-text')) return false;
  if (el.tagName === 'SLOT') {
    return (el as HTMLSlotElement).assignedNodes().some(nodeHasIconContent);
  }
  return true;
}

function detectIcon() {
  const el = iconWrap.value;
  if (!el) return;
  hasIcon.value = Array.from(el.childNodes).some(nodeHasIconContent);
}

/**
 * En el custom element el ícono puede llegar después del mount (el HTML se
 * parsea después de la upgrade): `slotchange` vuelve a detectarlo. En Vue no hay
 * `<slot>` en el DOM y el re-render lo cubre `onUpdated`.
 */
function bindIconSlot() {
  const slot = iconWrap.value?.querySelector("slot") as HTMLSlotElement | null;
  if (!slot || slot === iconSlot) return;
  iconSlot?.removeEventListener("slotchange", detectIcon);
  iconSlot = slot;
  iconSlot.addEventListener("slotchange", detectIcon);
}

onMounted(() => {
  detectIcon();
  bindIconSlot();
});
onUpdated(() => {
  detectIcon();
  bindIconSlot();
});
onBeforeUnmount(() => {
  iconSlot?.removeEventListener("slotchange", detectIcon);
  iconSlot = null;
});

const internalShow = ref(props.show);

watch(() => props.show, (val) => {
  internalShow.value = val;
});
watch(internalShow, (val) => {
  emit("update:show", val);
});

const colorStyles = computed(() => ({
  '--alert-solid': `var(--cu-color-${safeColor.value}-solid)`,
  '--alert-solid-hover': `var(--cu-color-${safeColor.value}-solid-hover)`,
  '--alert-solid-active': `var(--cu-color-${safeColor.value}-solid-active)`,
  '--alert-solid-text': `var(--cu-color-surface)`,
  '--alert-border': `var(--cu-color-${safeColor.value}-border)`,
  '--alert-text': `var(--cu-color-${safeColor.value}-text)`,
  '--alert-ghost-hover': `var(--cu-color-${safeColor.value}-ghost-hover)`,
  '--alert-ghost-active': `var(--cu-color-${safeColor.value}-ghost-active)`,
  '--alert-soft': `var(--cu-color-${safeColor.value}-soft)`,
  '--alert-soft-hover': `var(--cu-color-${safeColor.value}-soft-hover)`,
  '--alert-soft-active': `var(--cu-color-${safeColor.value}-soft-active)`,
  '--alert-subtle': `var(--cu-color-${safeColor.value}-subtle)`,
  '--alert-subtle-hover': `var(--cu-color-${safeColor.value}-subtle-hover)`,
  '--alert-subtle-active': `var(--cu-color-${safeColor.value}-subtle-active)`,
  '--alert-subtle-border': `var(--cu-color-${safeColor.value}-subtle-border)`,
}))

function open() {
  internalShow.value = true;
  emit("open");
}
function close() {
  internalShow.value = false;
  emit("close");
}
function toggle() {
  internalShow.value = !internalShow.value;
  emit(internalShow.value ? "open" : "close");
}

defineExpose({
  open,
  close,
  toggle,
  isOpen: () => internalShow.value,
});
</script>

<template>
  <div
    v-show="internalShow"
    :class="['cu-alert', `cu-alert--${props.variant}`, { 'cu-alert--floating-close': props.close && !hasHeader }]"
    :style="colorStyles"
    :role="ariaRole"
    :aria-live="ariaLive"
  >
    <div v-show="hasHeader" class="cu-alert-header">
      <div ref="iconWrap" class="cu-alert-title">
        <slot name="icon" />
        <span v-if="props.title" class="cu-alert-title-text">{{ props.title }}</span>
      </div>
      <button
        v-if="props.close && hasHeader"
        type="button"
        @click="close"
        class="cu-alert-close"
        aria-label="Cerrar alerta"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"> <path d="M18 6 6 18"/> <path d="m6 6 12 12"/> </svg>
      </button>
    </div>
    <button
      v-if="props.close && !hasHeader"
      type="button"
      @click="close"
      class="cu-alert-close cu-alert-close--floating"
      aria-label="Cerrar alerta"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"> <path d="M18 6 6 18"/> <path d="m6 6 12 12"/> </svg>
    </button>
    <div class="cu-alert-content">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.cu-alert {
  font-family: var(--cu-font-sans);
  font-size: var(--cu-font-size-sm);
  padding: var(--cu-space-md) var(--cu-space-lg);
  border-radius: var(--cu-radius);
  display: flex;
  flex-direction: column;
  gap: var(--cu-space-sm);
  box-sizing: border-box;
  position: relative;
}

/* solid */
.cu-alert.cu-alert--solid {
  background-color: var(--alert-solid);
  color: var(--alert-solid-text);
}
.cu-alert.cu-alert--solid .cu-alert-title-text {
  color: var(--alert-solid-text);
}

/* ghost */
.cu-alert.cu-alert--ghost {
  background-color: transparent;
  color: var(--alert-text);
}

/* soft */
.cu-alert.cu-alert--soft {
  background-color: var(--alert-soft);
  color: var(--alert-text);
}

/* subtle */
.cu-alert.cu-alert--subtle {
  background-color: var(--alert-subtle);
  color: var(--alert-text);
  border: var(--cu-border-thin) solid var(--alert-subtle-border);
}

/* outlined */
.cu-alert.cu-alert--outlined {
  background-color: transparent;
  color: var(--alert-text);
  border: var(--cu-border-thin) solid var(--alert-border);
}

.cu-alert-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.cu-alert-title {
  display: flex;
  align-items: center;
  gap: var(--cu-space-sm);
}

.cu-alert-title-text {
  font-size: var(--cu-font-size-lg);
  font-weight: var(--cu-font-weight-bold);
  margin: 0;
  color: inherit;
}

.cu-alert-close {
  background: none;
  border: none;
  cursor: pointer;
  color: inherit;
  padding: var(--cu-space-2xs);
  border-radius: var(--cu-radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 150ms ease;
}

.cu-alert-close:hover {
  background-color: var(--alert-ghost-hover);
}

.cu-alert-close:active {
  background-color: var(--alert-ghost-active);
}

/* Sin título ni ícono: el close acompaña a la primera fila del cuerpo en vez
   de ocupar una cabecera propia. */
.cu-alert-close--floating {
  position: absolute;
  top: var(--cu-space-md);
  right: var(--cu-space-lg);
}

.cu-alert--floating-close .cu-alert-content {
  padding-right: var(--cu-space-xl);
}

.cu-alert-content {
  color: inherit;
}
</style>
