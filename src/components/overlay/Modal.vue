<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, useAttrs, useSlots, watch, type PropType } from "vue";
import { isModalSize } from '@/utils/validators'
import { useMagicKeys, whenever } from "@vueuse/core";
import Button from "../buttons/Button.vue";

const props = defineProps({
  color: {
    type: String as PropType<'primary' | 'secondary' | 'neutral' | 'success' | 'warning' | 'danger'>,
    required: false,
    default: "neutral",
  },
  title: {
    type: String,
    required: false,
    default: "",
  },
  description: {
    type: String,
    required: false,
    default: "",
  },
  persistent: {
    type: Boolean,
    required: false,
    default: false,
  },
  size: {
    type: String as PropType<'auto' | 'sm' | 'md' | 'lg' | 'xl' | 'full'>,
    required: false,
    default: "auto",
    validator: isModalSize,
  },
  height: {
    type: String as PropType<'auto' | 'sm' | 'md' | 'lg' | 'xl' | 'full'>,
    required: false,
    default: "auto",
    validator: isModalSize,
  },
});

const emit = defineEmits(["close", "opened", "closed", "cancel", "accept"]);

const slots = useSlots();
const attrs = useAttrs();
const isOpen = ref(false);

const backdropRef = ref<HTMLElement | null>(null);
/** Elemento que tenía el foco al abrir: se le devuelve al cerrar. */
const trigger = ref<HTMLElement | null>(null);

const hasFooter = computed(() => !!slots.footer?.());

// Nombre accesible: con `title` manda `aria-labelledby`; sin él (p. ej.
// CommandPalette, que no pasa título) el diálogo quedaría sin nombre. El autor
// puede pisarlo con `aria-label` en el host; si no, hay un fallback genérico.
const dialogLabel = computed(() =>
  props.title ? undefined : ((attrs['aria-label'] as string | undefined) || 'Diálogo'),
);

const colorStyles = computed(() => ({
  '--modal-color': `var(--cu-color-${props.color})`,
}));

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'area[href]',
  'button:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  'iframe',
  'object',
  'embed',
  'audio[controls]',
  'video[controls]',
  'summary',
  '[contenteditable="true"]',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

/** Oculta por atributo/inline style (v-show): `focus()` no serviría y el trap no debe contarla. */
function isHidden(el: Element): boolean {
  for (let node: Element | null = el; node; node = node.parentElement) {
    if (node.hasAttribute('hidden')) return true;
    const style = (node as HTMLElement).style;
    if (style && (style.display === 'none' || style.visibility === 'hidden')) return true;
  }
  return false;
}

function isFocusable(el: Element): el is HTMLElement {
  return el instanceof HTMLElement && el.matches(FOCUSABLE_SELECTOR) && !isHidden(el);
}

/**
 * Focusables del diálogo en orden de tabulación. Recorre slots (`assignedElements`)
 * y shadow roots anidados: el contenido de un `<cu-modal>` vive en el light DOM del
 * host y el de un `<cu-input>` en su propio shadow, y `querySelectorAll` no cruza
 * ninguna de las dos fronteras.
 */
function collectFocusables(root: ParentNode, out: HTMLElement[] = []): HTMLElement[] {
  for (const child of Array.from(root.children)) {
    if (child.tagName === 'SLOT' && 'assignedElements' in child) {
      const slot = child as HTMLSlotElement;
      const assigned = slot.assignedElements({ flatten: true });
      const source = assigned.length ? assigned : Array.from(slot.children);
      for (const node of source) {
        if (isFocusable(node)) out.push(node);
        if (node.shadowRoot) collectFocusables(node.shadowRoot, out);
        collectFocusables(node, out);
      }
      continue;
    }
    if (isFocusable(child)) out.push(child);
    if (child.shadowRoot) collectFocusables(child.shadowRoot, out);
    collectFocusables(child, out);
  }
  return out;
}

function dialogFocusables(): HTMLElement[] {
  const root = backdropRef.value;
  return root ? collectFocusables(root) : [];
}

/** Elemento realmente enfocado, atravesando shadow roots anidados. */
function deepActiveElement(): Element | null {
  let active: Element | null = document.activeElement;
  while (active?.shadowRoot?.activeElement) active = active.shadowRoot.activeElement;
  return active;
}

/**
 * Foco inicial: `[autofocus]` si existe, si no el primer focusable, si no el
 * diálogo. No pisa un foco que ya está adentro: un consumidor (CommandPalette)
 * puede enfocar su buscador en el mismo tick y ese foco manda.
 */
function focusFirst() {
  const root = backdropRef.value;
  if (!root) return;
  const focusables = dialogFocusables();
  const active = deepActiveElement();
  if (active && (focusables.includes(active as HTMLElement) || root.contains(active))) return;
  const autofocus = root.querySelector('[autofocus]') as HTMLElement | null;
  (autofocus ?? focusables[0] ?? root).focus();
}

/** Devuelve el foco al trigger; si es un custom element, a su control interno. */
function restoreFocus() {
  const el = trigger.value;
  trigger.value = null;
  if (!el || !el.isConnected) return;
  el.focus();
  if (document.activeElement !== el && el.shadowRoot) {
    collectFocusables(el.shadowRoot)[0]?.focus();
  }
}

/**
 * Trampa de foco: Tab/Shift+Tab ciclan dentro del diálogo. Se escucha en
 * `document` (keydown es `composed`) para cubrir también el foco que quedó
 * fuera —body, la barra del navegador— y el contenido sloteado en el shadow.
 */
function handleKeydown(event: KeyboardEvent) {
  if (!isOpen.value || event.key !== 'Tab') return;
  const focusables = dialogFocusables();
  const root = backdropRef.value;
  if (!focusables.length) {
    event.preventDefault();
    root?.focus();
    return;
  }
  const path = typeof event.composedPath === 'function' ? event.composedPath() : [];
  const target = (path[0] as Element | undefined) ?? (event.target as Element | null);
  const index = target ? focusables.indexOf(target as HTMLElement) : -1;
  const first = focusables[0]!;
  const last = focusables[focusables.length - 1]!;

  if (index === -1) {
    event.preventDefault();
    (event.shiftKey ? last : first).focus();
  } else if (event.shiftKey && index === 0) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && index === focusables.length - 1) {
    event.preventDefault();
    first.focus();
  }
}

/** Abre el modal. */
function open() {
  if (isOpen.value) return;
  trigger.value = document.activeElement instanceof HTMLElement ? document.activeElement : null;
  isOpen.value = true;
}
/** Cierra el modal. */
function close() {
  isOpen.value = false;
}
/** Alterna la visibilidad del modal. */
function toggle() {
  if (isOpen.value) close();
  else open();
}
function handleCancel() {
  emit("cancel");
  close();
}
function handleAccept() {
  emit("accept");
  close();
}

const keys = useMagicKeys({ target: typeof window !== "undefined" ? window : undefined });
whenever(() => keys.Escape?.value, () => !props.persistent && isOpen.value && close());

function handleBackdropClick(event: MouseEvent) {
  if (!props.persistent && event.target === event.currentTarget) {
    close();
  }
}

watch(isOpen, (newVal) => {
  emit(newVal ? "opened" : "closed");
  if (!newVal) emit("close");
  if (newVal) {
    document.addEventListener("keydown", handleKeydown);
    nextTick(() => {
      if (isOpen.value) focusFirst();
    });
  } else {
    document.removeEventListener("keydown", handleKeydown);
    restoreFocus();
  }
});

onBeforeUnmount(() => {
  document.removeEventListener("keydown", handleKeydown);
});

defineExpose({
  open,
  close,
  toggle,
  /** Devuelve true si el modal está abierto. */
  isOpen: () => isOpen.value,
});
</script>

<template>
  <div
    ref="backdropRef"
    v-show="isOpen"
    @click="handleBackdropClick"
    tabindex="-1"
    role="dialog"
    class="cu-modal-backdrop"
    aria-modal="true"
    :aria-labelledby="title ? 'modal-title' : undefined"
    :aria-label="dialogLabel"
    :aria-describedby="description ? 'modal-description' : undefined"
  >
    <div
      class="cu-modal"
      :style="colorStyles"
      :data-size="size"
      :data-height="height"
    >
      <header class="cu-modal-header" :class="{ 'cu-modal-header--accent': color !== 'neutral' }">
        <div class="cu-modal-header-text">
          <div v-if="title" class="cu-modal-title-row">
            <slot name="icon" />
            <h2
              id="modal-title"
              class="cu-modal-title"
            >
              {{ title }}
            </h2>
          </div>
          <p
            v-if="description"
            id="modal-description"
            class="cu-modal-description"
          >
            {{ description }}
          </p>
        </div>
        <Button
          v-if="!persistent"
          :color="color"
          variant="ghost"
          @click="close"
          class="cu-modal-close"
          aria-label="Cerrar modal"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        </Button>
      </header>

      <main class="cu-modal-body">
        <slot></slot>
      </main>

      <footer class="cu-modal-footer">
        <slot name="footer">
          <div v-if="!hasFooter" class="cu-modal-footer-default">
            <template v-if="persistent">
              <Button color="neutral" variant="ghost" @click="handleCancel">Cancelar</Button>
              <Button :color="color" variant="solid" @click="handleAccept">Aceptar</Button>
            </template>
            <template v-else>
              <Button color="neutral" variant="ghost" @click="close">Cerrar</Button>
            </template>
          </div>
        </slot>
      </footer>
    </div>
  </div>
</template>

<style>
.cu-modal-backdrop {
  z-index: 1000;
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--cu-space-md);
  background-color: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(4px);
}

.cu-modal {
  background-color: var(--cu-color-surface);
  color: var(--cu-color-neutral);
  border-radius: var(--cu-radius);
  box-shadow: var(--cu-shadow-xl);
  padding: var(--cu-space-md);
  width: 100%;
  display: flex;
  flex-direction: column;
  overflow: visible;
  box-sizing: border-box;
}

/* size */
.cu-modal[data-size="auto"] { max-width: var(--cu-modal-size-auto, 50vw); }
.cu-modal[data-size="sm"] { max-width: var(--cu-modal-size-sm, 25vw); }
.cu-modal[data-size="md"] { max-width: var(--cu-modal-size-md, 30vw); }
.cu-modal[data-size="lg"] { max-width: var(--cu-modal-size-lg, 35vw); }
.cu-modal[data-size="xl"] { max-width: var(--cu-modal-size-xl, 40vw); }
.cu-modal[data-size="full"] { max-width: var(--cu-modal-size-full, 90vw); }

/* height */
.cu-modal[data-height="auto"] { max-height: var(--cu-modal-height-auto, 50vh); }
.cu-modal[data-height="sm"] { max-height: var(--cu-modal-height-sm, 30vh); }
.cu-modal[data-height="md"] { max-height: var(--cu-modal-height-md, 40vh); }
.cu-modal[data-height="lg"] { max-height: var(--cu-modal-height-lg, 50vh); }
.cu-modal[data-height="xl"] { max-height: var(--cu-modal-height-xl, 60vh); }
.cu-modal[data-height="full"] {
  max-height: var(--cu-modal-height-full, 90vh);
  height: var(--cu-modal-height-full, 90vh);
}

.cu-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: var(--cu-space-lg);
  gap: var(--cu-space-md);
}

.cu-modal-header-text {
  display: flex;
  flex-direction: column;
  gap: var(--cu-space-2xs);
  min-width: 0;
}

.cu-modal-title-row {
  display: flex;
  align-items: center;
  gap: var(--cu-space-sm);
}

.cu-modal-title {
  font-family: var(--cu-font-sans);
  font-size: var(--cu-font-size-lg);
  font-weight: var(--cu-font-weight-bold);
  margin: 0;
  color: var(--modal-color);
}

.cu-modal-description {
  font-family: var(--cu-font-sans);
  font-size: var(--cu-font-size-sm);
  margin: 0;
  color: var(--cu-color-neutral);
  opacity: 0.7;
}

.cu-modal-close {
  flex-shrink: 0;
  padding: var(--cu-space-sm) !important;
  height: auto !important;
  width: auto !important;
}

.cu-modal-body {
  padding: 0 var(--cu-space-lg) var(--cu-space-lg);
  flex: 1;
  min-height: 0;
  overflow-y: auto;
}

.cu-modal-body > * {
  width: 100%;
}

.cu-modal-footer {
  padding: var(--cu-space-lg);
  border-top: var(--cu-border-thin) solid var(--cu-border-color);
}

.cu-modal-footer-default {
  display: flex;
  justify-content: flex-end;
  gap: var(--cu-space-sm);
}
</style>
